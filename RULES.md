# RULES.md
> Single source of truth for coding agents working in this repository.
> Read this file in full before making any changes.

## Development rules

This repo follows strict rules when developing components:
- Every component shouldn't be more that 200 lines long
- Every interface and type must be in /src/types
- Every component should have its own file
- Naming component files follows CamelCase except for files in src/app
- Components must be reusable 
- Components shouldn't tighly coupled
- SVG elements should live in src/icons
- Image tags should always be Image component from next
- Use Link component from Next
- Components names in English
- Text should be in neutral Spanish
- Forms and validations uses Formik and Yup
- Use sileo for toasts
- Label forms always has to use htmlFor
- Do not use window.confirm or window.alert, use sileo.action instead.

---
## Code quality checks

Run in this exact order after every change. A failure in any step blocks the next.
1. pnpm format 
2. pnpm build

## Code exploration (CodeGraph)

**Use CodeGraph FIRST** before grep, find, or manual file reading when locating or understanding code.

If a `.codegraph/` directory exists at repo root:
- **MCP tool** (preferred): `codegraph_explore` — returns verbatim source + call paths, including dynamic dispatch.
- **Shell fallback**: `codegraph explore "<symbol or question>"`

If no `.codegraph/` directory exists: init codegraph.
If codegraph could not be initiated, skip it.
