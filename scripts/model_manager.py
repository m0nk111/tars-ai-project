import json
import os

MODEL_HISTORY_FILE = "/home/flip/tars-ai-project/generated/model_history.json"

def get_last_used_model():
    """Get the last used model from history"""
    try:
        if os.path.exists(MODEL_HISTORY_FILE):
            with open(MODEL_HISTORY_FILE, 'r') as f:
                data = json.load(f)
                return data.get('last_model', 'gemma2:2b')
    except:
        pass
    return 'gemma2:2b'

def save_last_used_model(model_name):
    """Save the last used model to history"""
    try:
        os.makedirs(os.path.dirname(MODEL_HISTORY_FILE), exist_ok=True)
        with open(MODEL_HISTORY_FILE, 'w') as f:
            json.dump({'last_model': model_name}, f)
    except:
        pass
