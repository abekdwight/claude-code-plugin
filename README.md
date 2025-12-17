# Claude Code Plugins

[日本語](./README.ja.md)

A collection of plugins for [Claude Code](https://docs.anthropic.com/en/docs/claude-code).

## Plugins

| Plugin | Description |
|--------|-------------|
| [backlog-skill](./plugins/backlog-skill/) | Nulab Backlog integration |

## Install

```bash
/plugin marketplace add abekdwight/claude-code-plugin
/plugin install <plugin-name>
```

Or clone manually:

```bash
git clone https://github.com/abekdwight/claude-code-plugin.git ~/.claude/plugins/abekdwight-plugins
```

## Structure

```
claude-code-plugin/
├── plugins/
│   └── backlog-skill/    # Backlog integration
└── ...
```

## License

MIT
