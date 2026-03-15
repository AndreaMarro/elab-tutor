"""
Template-based section: reads YAML config with {var} placeholders,
explodes combinatorially, applies corruptions, generates ChatML examples.

This is the workhorse — most sections use this without custom Python.
"""
import json
import itertools
import random
import os
import yaml
from .base import Section


class TemplateSection(Section):
    """Generate examples from YAML templates with variable expansion."""

    def __init__(self, config: dict, corruption_pipeline, system_prompt: str = "",
                 responses_config: dict = None):
        super().__init__(config)
        self.cp = corruption_pipeline
        self.system_prompt = system_prompt
        self.templates = config.get("templates", [])
        self.default_intent = config.get("intent", "action")
        self.default_needs_llm = config.get("needs_llm", False)
        self.corruptions = config.get("corruptions", {})
        self.responses_config = responses_config or {}

    def _pick_response(self, response_key: str, replacements: dict = None) -> str:
        """Pick a random response from responses.yml templates."""
        if response_key and response_key.startswith("@"):
            key = response_key[1:]  # strip @
            templates = self.responses_config.get(key, [response_key])
            if isinstance(templates, list) and templates:
                chosen = self.cp.rng.choice(templates)
                if replacements:
                    for k, v in replacements.items():
                        chosen = chosen.replace(f"{{{k}}}", str(v))
                return chosen
        return response_key

    def _expand_template(self, template: dict) -> list[dict]:
        """Expand a single template with all var combinations."""
        input_tmpl = template["input"]
        vars_dict = template.get("vars", {})

        if not vars_dict:
            return [self._make_example(template, input_tmpl, {})]

        keys = list(vars_dict.keys())
        values = [vars_dict[k] for k in keys]
        combos = list(itertools.product(*values))

        results = []
        for combo in combos:
            replacements = dict(zip(keys, combo))
            results.append(self._make_example(template, input_tmpl, replacements))
        return results

    def _substitute(self, text: str, replacements: dict) -> str:
        """Replace {var} placeholders in text."""
        if not text or not replacements:
            return text
        for key, val in replacements.items():
            text = text.replace(f"{{{key}}}", str(val))
        return text

    def _make_example(self, template: dict, input_tmpl: str, replacements: dict) -> dict:
        """Create a single example from template + replacements."""
        text = self._substitute(input_tmpl, replacements)

        intent = template.get("intent", self.default_intent)
        needs_llm = template.get("needs_llm", self.default_needs_llm)
        response = template.get("response")
        llm_hint = template.get("llm_hint")
        actions = template.get("actions", [])
        entities = template.get("entities", [])

        # Substitute vars in output fields
        llm_hint = self._substitute(llm_hint, replacements)
        response = self._substitute(response, replacements)

        # Handle @responses.yml references
        if response and isinstance(response, str) and response.startswith("@"):
            response = self._pick_response(response, replacements)

        # Substitute vars in entities
        if entities and replacements:
            entities = [self._substitute(e, replacements) for e in entities]

        # Substitute vars in actions
        if actions and replacements:
            actions = [self._substitute(a, replacements) for a in actions]

        output = json.dumps({
            "intent": intent,
            "entities": entities,
            "actions": actions,
            "needs_llm": needs_llm,
            "response": response,
            "llm_hint": llm_hint,
        }, ensure_ascii=False)

        return {
            "messages": [
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": text},
                {"role": "assistant", "content": output},
            ],
            "_clean_input": text,
        }

    def generate(self, target_count: int) -> list[dict]:
        """Generate up to target_count examples with corruption variants.

        Uses progressive corruption: starts with config-level corruption,
        escalates aggressiveness every 500 failed attempts to maximize
        unique output diversity.
        """
        # Phase 1: expand all templates combinatorially
        base_examples = []
        for tmpl in self.templates:
            base_examples.extend(self._expand_template(tmpl))

        if not base_examples:
            return []

        results = list(base_examples)

        # Track seen inputs to avoid intra-section duplicates
        seen_inputs = {ex["_clean_input"] for ex in results}

        # Phase 2: fill to target via corruption with progressive escalation
        max_attempts = target_count * 5
        attempts = 0
        level = 1  # escalation level

        while len(results) < target_count and attempts < max_attempts:
            ex = self.cp.rng.choice(base_examples)
            clean = ex["_clean_input"]

            # Apply config-level corruption first
            corrupted = self.cp.apply_config(clean, self.corruptions)

            # Escalate: apply extra random corruptions at higher levels
            if level > 1:
                corrupted = self.cp.apply_random(corrupted, level=min(level, 4))

            if corrupted not in seen_inputs:
                seen_inputs.add(corrupted)
                new_ex = {
                    "messages": [
                        ex["messages"][0],  # system
                        {"role": "user", "content": corrupted},
                        ex["messages"][2],  # assistant (same output)
                    ],
                    "_clean_input": clean,
                }
                results.append(new_ex)

            attempts += 1
            # Every 500 failed attempts, escalate corruption aggressiveness
            if attempts % 500 == 0:
                level += 1

        return results[:target_count]
