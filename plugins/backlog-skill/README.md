# Backlog Skill Plugin

[Nulab Backlog](https://backlog.com/)をClaude Codeから自然言語で操作するためのプラグイン。

**MCPサーバー不使用** - Skill + Bunスクリプトによる軽量な実装。

## 特徴

- 課題の検索・作成・更新・コメント追加
- プロジェクト情報の取得
- 通知の確認
- 外部依存なし（標準fetch使用）
- クロスプラットフォーム対応（Bun）

## 必要なもの

- [Bun](https://bun.sh/) v1.0以上
- Backlog APIキー

## インストール

### マーケットプレイス経由（推奨）

```bash
# Claude Code内で実行
/plugin marketplace add abekdwight/claude-code-plugin
/plugin install backlog-skill
```

### 手動インストール

```bash
git clone https://github.com/abekdwight/claude-code-plugin.git ~/.claude/plugins/abekdwight-plugins
```

## 設定

環境変数を設定してください。

### グローバル設定（全プロジェクト共通）

`~/.claude/settings.local.json`（gitignore推奨）:

```json
{
  "env": {
    "BACKLOG_DOMAIN": "your-space.backlog.com",
    "BACKLOG_API_KEY": "your-api-key"
  }
}
```

### プロジェクト固有設定

各プロジェクトで異なるBacklogスペースを使う場合:

`./.claude/settings.local.json`:

```json
{
  "env": {
    "BACKLOG_DOMAIN": "project-space.backlog.com",
    "BACKLOG_API_KEY": "project-api-key"
  }
}
```

> **注意:** `settings.local.json`は機密情報を含むため、必ず`.gitignore`に追加してください。

### APIキーの取得方法

1. Backlogにログイン
2. 右上のユーザーアイコン → **個人設定**
3. **API** → **新しいAPIキーを追加**

## 使い方

「Backlog」「課題」「チケット」などのキーワードで自動的にスキルが起動します。

```
課題MYPROJ-123の詳細を教えて
```

```
今日の未読通知を確認して
```

```
新しいバグ課題を作成して
```

```
課題MYPROJ-456のステータスを完了に変更して
```

## 仕組み

```
User → Claude → SKILL.md (ガイダンス)
                    ↓
              Bash: bun run scripts/backlog.ts <command>
                    ↓
              Backlog API (fetch)
```

- **MCPサーバーなし** - プロセス起動のオーバーヘッドなし
- **Bunで直接実行** - TypeScriptをビルドなしで実行
- **標準fetch** - 外部依存なし

## コマンドリファレンス

スクリプトを直接実行する場合:

```bash
# ヘルプ表示
bun run scripts/backlog.ts --help

# スペース情報取得
bun run scripts/backlog.ts get-space

# 自分の情報取得
bun run scripts/backlog.ts get-myself

# プロジェクト一覧
bun run scripts/backlog.ts get-projects

# 課題検索
bun run scripts/backlog.ts get-issues --project=123 --status=2 --keyword=バグ

# 課題詳細取得
bun run scripts/backlog.ts get-issue MYPROJ-123

# 課題作成
bun run scripts/backlog.ts create-issue '{"projectId":123,"summary":"タイトル","issueTypeId":456,"priorityId":3}'

# 課題更新
bun run scripts/backlog.ts update-issue MYPROJ-123 '{"statusId":4,"comment":"完了"}'

# コメント追加
bun run scripts/backlog.ts add-comment MYPROJ-123 "進捗報告"

# 通知確認
bun run scripts/backlog.ts get-notifications --count=10
```

詳細は `skills/backlog-api/SKILL.md` を参照。

## トラブルシューティング

### Bunがインストールされていない

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Homebrew
brew install oven-sh/bun/bun

# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"
```

### 認証エラー（401）

- `BACKLOG_DOMAIN`が正しいか確認（`https://`は不要）
- `BACKLOG_API_KEY`が有効か確認
- APIキーの権限を確認

### 課題が見つからない（404）

- 課題キーが正しいか確認（例: `MYPROJ-123`）
- プロジェクトへのアクセス権があるか確認

### ネットワークエラー

- インターネット接続を確認
- ドメイン名のスペルを確認
- プロキシ設定が必要な場合は環境変数を設定

## コントリビュート

Issue報告やPull Requestを歓迎します。

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. Pull Requestを作成

## ライセンス

MIT License - 詳細は [LICENSE](LICENSE) を参照。

## 関連リンク

- [Nulab Backlog](https://backlog.com/)
- [Backlog API ドキュメント](https://developer.nulab.com/ja/docs/backlog/)
- [Bun](https://bun.sh/)
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
