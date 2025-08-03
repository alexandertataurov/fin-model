web: python3 main.py
worker: python3 -c "import os; os.chdir('backend'); import sys; sys.path.insert(0, '.'); from celery_worker import app; app.worker_main(['worker', '--loglevel=info'])" 