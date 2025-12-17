# Backlog Skill

[日本語](./README.ja.md)

[Nulab Backlog](https://backlog.com/) integration for Claude Code.

Based on [nulab/backlog-mcp-server](https://github.com/nulab/backlog-mcp-server), reimplemented as a Claude Code Skill without MCP dependencies.

## Why

- **Zero dependencies** — Uses native `fetch`, no npm packages
- **No server process** — Direct script execution via Bun
- **Project-scoped config** — Different Backlog spaces per project

## Requirements

- [Bun](https://bun.sh/) >= 1.0
- Backlog API key

## Install

```bash
/plugin marketplace add abekdwight/claude-code-plugin
/plugin install backlog-skill
```

## Configure

Set environment variables in `.claude/settings.local.json`:

```json
{
  "env": {
    "BACKLOG_DOMAIN": "your-space.backlog.com",
    "BACKLOG_API_KEY": "your-api-key"
  }
}
```

> Use `~/.claude/settings.local.json` for global config, `./.claude/settings.local.json` for project-specific.

### Get API Key

Backlog → User Icon → Personal Settings → API → Generate

## Usage

Just talk to Claude:

```
Show me the details of PROJECT-123
```

```
Create a new bug issue
```

```
Check unread notifications
```

## Commands

```bash
# Space
bun run scripts/backlog.ts get-space
bun run scripts/backlog.ts get-myself

# Projects
bun run scripts/backlog.ts get-projects
bun run scripts/backlog.ts get-project <key>
bun run scripts/backlog.ts get-issue-types <key>

# Issues
bun run scripts/backlog.ts get-issues --project=<id> --keyword=<text>
bun run scripts/backlog.ts get-issue <key>
bun run scripts/backlog.ts create-issue '<json>'
bun run scripts/backlog.ts update-issue <key> '<json>'
bun run scripts/backlog.ts add-comment <key> '<text>'

# Notifications
bun run scripts/backlog.ts get-notifications
bun run scripts/backlog.ts count-notifications
```

## Troubleshooting

| Error | Solution |
|-------|----------|
| `BACKLOG_DOMAIN not set` | Check `.claude/settings.local.json` |
| `401 Unauthorized` | Verify API key is valid |
| `404 Not Found` | Check issue key or project access |
| `Network error` | Verify domain (no `https://` prefix) |

## License

MIT

## Credits

- [nulab/backlog-mcp-server](https://github.com/nulab/backlog-mcp-server) — Original MCP implementation
- [Backlog API](https://developer.nulab.com/docs/backlog/) — Official documentation
