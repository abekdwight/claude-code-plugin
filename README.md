# Claude Code Plugins

Claude Codeの機能を拡張するプラグイン集。

## Available Plugins

| Plugin | Description |
|--------|-------------|
| [backlog-skill](./plugins/backlog-skill/) | Nulab Backlogプロジェクト管理統合 |

## Installation

### Option 1: マーケットプレイスとして登録

```bash
# Claude Code内で実行
/plugin marketplace add abekdwight/claude-code-plugin
```

### Option 2: 手動インストール

```bash
git clone https://github.com/abekdwight/claude-code-plugin.git ~/.claude/plugins/abekdwight-plugins
```

## Plugin Structure

```
claude-code-plugin/
├── README.md
├── plugins/
│   ├── backlog-skill/      # Backlog統合
│   └── (future plugins)
└── external_plugins/       # 外部サービス統合（必要に応じて）
```

## Configuration

各プラグインの設定方法は、それぞれのREADMEを参照してください：

- [backlog-skill Configuration](./plugins/backlog-skill/README.md#configuration)

## License

MIT

## Author

abekdwight
