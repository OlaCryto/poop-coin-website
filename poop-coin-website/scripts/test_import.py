import sys
import importlib
from pathlib import Path

# Ensure script runs from anywhere by adding repo root to sys.path
repo_root = Path(__file__).parent.parent.resolve()
if str(repo_root) not in sys.path:
    sys.path.insert(0, str(repo_root))

if __name__ == '__main__':
    try:
        importlib.import_module('app')
        print('Imported app OK')
    except ImportError as e:
        print('Import failed: ImportError', e)
    except Exception as e:
        print('Import failed:', type(e).__name__, e)
