# Instructions for Codex Agents

This repository hosts the **FinVision** financial modeling platform.
Follow these rules when contributing changes:

## Code quality
- Run `pre-commit run --files <changed files>` before committing. The configuration
  applies Black (line length 88), isort, Flake8, and frontend lint/format tasks.
- Keep Python code typed and formatted with Black. Organize imports with isort.
- Frontend changes must pass ESLint and Prettier via `npm run lint` and
  `npm run format`.

## Testing
- Execute the test suite before opening a PR. Use `python run_tests.py --quick`
  for a fast check or `python run_tests.py` for the full matrix. You may also run
  backend tests with `pytest` and frontend tests with `npm run test`.
- Aim for at least **80% coverage** on critical code paths as noted in
  `backend/docs/QA_PROCEDURES.md`.

## Pull requests
- Include a brief description of the change and reference relevant tasks from the
  `tasks/` directory when applicable.
- Ensure CI workflows pass (`.github/workflows/`).

Use these guidelines for all future changes in this repository.
