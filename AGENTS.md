<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:engram-memory -->
## Memory

You have access to Engram persistent memory via MCP tools (mem_save, mem_search, mem_session_summary, mem_context, etc.).

- **Save** proactively after significant work — don't wait to be asked.
- **Search** (`mem_search`) before making architectural decisions that may have prior context.
- **After compaction or context reset**, call `mem_context` first to recover session state before continuing.
- **Session end**: call `mem_session_summary` before concluding.
<!-- END:engram-memory -->
