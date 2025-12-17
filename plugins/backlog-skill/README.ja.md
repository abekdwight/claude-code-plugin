# Backlog Skill

[English](./README.md)

Claude Code向け[Nulab Backlog](https://backlog.com/)連携プラグイン。

[nulab/backlog-mcp-server](https://github.com/nulab/backlog-mcp-server)をベースに、MCP非依存のClaude Code Skillとして再実装。

## 特徴

- **依存ゼロ** — ネイティブ`fetch`使用、npmパッケージ不要
- **サーバープロセス不要** — Bunによる直接スクリプト実行
- **プロジェクト単位の設定** — プロジェクトごとに異なるBacklogスペースを利用可能

## 必要なもの

- [Bun](https://bun.sh/) >= 1.0
- Backlog APIキー

## インストール

```bash
/plugin marketplace add abekdwight/claude-code-plugin
/plugin install backlog-skill
```

## 設定

`.claude/settings.local.json`に環境変数を設定:

```json
{
  "env": {
    "BACKLOG_DOMAIN": "your-space.backlog.com",
    "BACKLOG_API_KEY": "your-api-key"
  }
}
```

> グローバル設定は`~/.claude/settings.local.json`、プロジェクト固有は`./.claude/settings.local.json`

### APIキーの取得

Backlog → ユーザーアイコン → 個人設定 → API → 新しいAPIキーを追加

## 使い方

Claudeに話しかけるだけ:

```
課題 PROJECT-123 の詳細を見せて
```

```
新しいバグ課題を作成して
```

```
未読の通知を確認
```

## コマンド

```bash
# スペース
bun run scripts/backlog.ts get-space
bun run scripts/backlog.ts get-myself

# プロジェクト
bun run scripts/backlog.ts get-projects
bun run scripts/backlog.ts get-project <key>
bun run scripts/backlog.ts get-issue-types <key>

# 課題
bun run scripts/backlog.ts get-issues --project=<id> --keyword=<text>
bun run scripts/backlog.ts get-issue <key>
bun run scripts/backlog.ts create-issue '<json>'
bun run scripts/backlog.ts update-issue <key> '<json>'
bun run scripts/backlog.ts add-comment <key> '<text>'

# 通知
bun run scripts/backlog.ts get-notifications
bun run scripts/backlog.ts count-notifications
```

## トラブルシューティング

| エラー | 対処法 |
|-------|--------|
| `BACKLOG_DOMAIN not set` | `.claude/settings.local.json`を確認 |
| `401 Unauthorized` | APIキーが有効か確認 |
| `404 Not Found` | 課題キーまたはプロジェクトへのアクセス権を確認 |
| `Network error` | ドメイン名を確認（`https://`は不要） |

## ライセンス

MIT

## クレジット

- [nulab/backlog-mcp-server](https://github.com/nulab/backlog-mcp-server) — オリジナルのMCP実装
- [Backlog API](https://developer.nulab.com/ja/docs/backlog/) — 公式ドキュメント
