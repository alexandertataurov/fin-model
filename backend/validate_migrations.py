#!/usr/bin/env python3
"""
Validate migration chain without database connection
"""

import os
import re
from pathlib import Path

def extract_revision_info(file_path):
    """Extract revision and down_revision from migration file."""
    with open(file_path, 'r') as f:
        content = f.read()
    
    revision_match = re.search(r"revision\s*=\s*['\"]([^'\"]+)['\"]", content)
    down_revision_match = re.search(r"down_revision\s*=\s*['\"]([^'\"]+)['\"]", content)
    
    revision = revision_match.group(1) if revision_match else None
    down_revision = down_revision_match.group(1) if down_revision_match else None
    
    return revision, down_revision

def validate_migration_chain():
    """Validate the migration chain."""
    versions_dir = Path(__file__).parent / "alembic" / "versions"
    
    if not versions_dir.exists():
        print("❌ Versions directory not found")
        return False
    
    # Collect all migration files
    migration_files = list(versions_dir.glob("*.py"))
    migration_files.sort()
    
    print(f"📁 Found {len(migration_files)} migration files")
    
    # Extract revision information
    revisions = {}
    for file_path in migration_files:
        revision, down_revision = extract_revision_info(file_path)
        if revision:
            revisions[revision] = {
                'down_revision': down_revision,
                'file': file_path.name
            }
    
    print(f"📋 Found {len(revisions)} revisions")
    
    # Check for broken chain
    broken_links = []
    for revision, info in revisions.items():
        down_revision = info['down_revision']
        if down_revision and down_revision not in revisions:
            broken_links.append((revision, down_revision))
    
    if broken_links:
        print("❌ Broken migration chain found:")
        for revision, down_revision in broken_links:
            print(f"   {revision} -> {down_revision} (missing)")
        return False
    
    # Find head (revision with no down_revision or not referenced by others)
    referenced = set()
    for info in revisions.values():
        if info['down_revision']:
            referenced.add(info['down_revision'])
    
    heads = [rev for rev in revisions.keys() if rev not in referenced]
    
    if len(heads) == 1:
        print(f"✅ Valid migration chain. Head: {heads[0]}")
        return True
    elif len(heads) > 1:
        print(f"❌ Multiple heads found: {heads}")
        return False
    else:
        print("❌ No head found (circular reference?)")
        return False

if __name__ == "__main__":
    if validate_migration_chain():
        print("✅ Migration chain is valid!")
    else:
        print("❌ Migration chain has issues!")
