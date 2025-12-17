# Claude Code Plugins

[English](./README.md)

[Claude Code](https://docs.anthropic.com/en/docs/claude-code)向けプラグイン集。

## プラグイン一覧

| プラグイン | 説明 |
|-----------|------|
| [backlog-skill](./plugins/backlog-skill/) | Nulab Backlog連携 |

## インストール

```bash
/plugin marketplace add abekdwight/claude-code-plugin
/plugin install <plugin-name>
```

または手動でクローン:

```bash
git clone https://github.com/abekdwight/claude-code-plugin.git ~/.claude/plugins/abekdwight-plugins
```

## 構成

```
claude-code-plugin/
├── plugins/
│   └── backlog-skill/    # Backlog連携
└── ...
```

## ライセンス

MIT
