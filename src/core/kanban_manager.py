import json
import os
from datetime import datetime

class KanbanManager:
    def __init__(self, kanban_path: str = "dashboard/kanban_data.json"):
        self.kanban_path = kanban_path
        if not os.path.exists(self.kanban_path):
            self._init_board()

    def _init_board(self):
        initial_data = {
            "last_updated": datetime.now().isoformat(),
            "columns": {
                "Backlog": [],
                "In Progress": [],
                "Security & Audit": [],
                "QA Verification": [],
                "Done": []
            }
        }
        with open(self.kanban_path, "w", encoding="utf-8") as f:
            json.dump(initial_data, f, indent=2)

    def move_card(self, task_id: str, title: str, to_column: str, details: str = ""):
        with open(self.kanban_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        data["last_updated"] = datetime.now().isoformat()
        
        # Remove task from all columns first
        for col in data["columns"]:
            data["columns"][col] = [item for item in data["columns"][col] if item["id"] != task_id]

        # Append to target column
        data["columns"][to_column].append({
            "id": task_id,
            "title": title,
            "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "details": details
        })

        with open(self.kanban_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)