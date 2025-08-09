# Contributing Guidelines

This guide explains how to contribute to the FinVision project and maintain consistency across the codebase. It is mirrored on the [internal wiki](https://wiki.internal/FinVision/Contributing) for easy reference.

## Naming Conventions
- **Design tokens** use the `fin-` prefix and lowercase, hyphen-separated names (e.g., `fin-primary-color`).
- **Components** are named in `PascalCase` and the filename should match the exported component.
- **Branches** follow `type/short-description` (e.g., `feature/add-dashboard`).

## Component Guidelines
- Build components using the defined design tokens.
- Keep components small, focused, and reusable.
- Document new components in the Storybook or relevant docs.

## Review Procedures
1. Create a branch for your change.
2. Run pre-commit checks and tests locally.
3. Open a pull request and request review.
4. Address feedback and obtain at least one approval before merging.
