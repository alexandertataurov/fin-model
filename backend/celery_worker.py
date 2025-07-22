#!/usr/bin/env python3
"""
Celery Worker Entry Point

This script starts the Celery worker for background task processing.
Run with: python celery_worker.py

For production, use: celery -A app.core.celery_app worker --loglevel=info
"""

from app.core.celery_app import celery_app

if __name__ == '__main__':
    celery_app.start() 