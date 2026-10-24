import json
import os
import yaml

class BaseSoul:
    def __init__(self, team_id: str, config_path: str = "config/settings.yaml"):
        with open(config_path, "r", encoding="utf-8") as f:
            self.settings = yaml.safe_load(f)

        with open("config/team_pipeline.yaml", "r", encoding="utf-8") as f:
            pipeline_cfg = yaml.safe_load(f)
            self.team_info = next(t for t in pipeline_cfg["teams"] if t["id"] == team_id)

        self.memory_path = "memory/framework_knowledge.json"
        self.memory = self._load_memory()

    def _load_memory(self) -> dict:
        if os.path.exists(self.memory_path):
            try:
                with open(self.memory_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                return {}
        return {}

    def retain_knowledge(self, key: str, value: str):
        """Saves newly discovered frameworks or patterns across runs."""
        self.memory[key] = value
        with open(self.memory_path, "w", encoding="utf-8") as f:
            json.dump(self.memory, f, indent=2)

    def get_assigned_model(self) -> str:
        model_alias = self.team_info["model"]
        return self.settings["models"].get(model_alias, "gemini-2.5-pro")

    def execute_stage(self, input_data: str) -> dict:
        raise NotImplementedError("Subclasses must implement execute_stage.")