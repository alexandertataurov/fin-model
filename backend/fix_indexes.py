#!/usr/bin/env python3
"""Ensure required database indexes exist."""

import logging
import os
import sys
import urllib.parse as up

import psycopg2

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("fix_indexes")


def get_conn():
    url = os.getenv("DATABASE_URL")
    if not url:
        log.error("Need DATABASE_URL env var (postgres://... )")
        sys.exit(1)
    parsed = up.urlparse(url)
    user = parsed.username
    password = parsed.password
    host = parsed.hostname
    port = parsed.port or 5432
    dbname = parsed.path.lstrip("/")
    return psycopg2.connect(
        dbname=dbname, user=user, password=password, host=host, port=port
    )


def index_exists(cur, name: str) -> bool:
    cur.execute("SELECT to_regclass(%s)", (f"public.{name}",))
    return cur.fetchone()[0] is not None


def create_index_if_missing(cur, name: str, definition_sql: str) -> None:
    if index_exists(cur, name):
        log.info("Index %s already exists, skipping", name)
        return
    try:
        log.info("Creating index %s", name)
        cur.execute(definition_sql)
        log.info("Created index %s", name)
    except Exception as e:  # pragma: no cover - database error path
        if "already exists" in str(e):
            log.warning("Race condition: index %s already existed when creating", name)
        else:
            raise


def fix_indexes() -> None:
    conn = get_conn()
    conn.autocommit = True
    with conn:
        with conn.cursor() as cur:
            create_index_if_missing(
                cur,
                "ix_users_last_login",
                "CREATE INDEX ix_users_last_login ON users (last_login)",
            )
            create_index_if_missing(
                cur,
                "ix_users_created_date",
                "CREATE INDEX ix_users_created_date ON users (DATE(created_at))",
            )
            create_index_if_missing(
                cur,
                "ix_users_active_verified",
                (
                    "CREATE INDEX ix_users_active_verified "
                    "ON users (is_active, is_verified)"
                ),
            )
            create_index_if_missing(
                cur,
                "ix_files_status_created",
                (
                    "CREATE INDEX ix_files_status_created "
                    "ON uploaded_files (status, created_at)"
                ),
            )
    conn.close()
    log.info("Done.")


if __name__ == "__main__":
    fix_indexes()
