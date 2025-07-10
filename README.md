# タスクマネージャー

React、TypeScript、Redux、Material-UIを使用したシンプルなタスク管理アプリケーションです。

## 機能

- タスクの追加
- タスクの編集
- タスクの削除
- タスクの完了/未完了の切り替え

## 技術スタック

- React 18
- TypeScript
- Redux Toolkit
- Material-UI (MUI)
- React Redux

## セットアップ

1. 依存関係をインストール:
```bash
npm install
```

2. 開発サーバーを起動:
```bash
npm start
```

3. ブラウザで http://localhost:3000 を開いてアプリケーションを確認

## ビルド

本番用ビルドを作成するには:
```bash
npm run build
```

## プロジェクト構造

```
src/
├── components/     # Reactコンポーネント
│   ├── AddTask.tsx
│   ├── TaskItem.tsx
│   └── TaskList.tsx
├── store/         # Reduxストア
│   ├── index.ts
│   └── taskSlice.ts
├── types/         # TypeScript型定義
│   └── task.ts
├── hooks/         # カスタムフック
│   └── redux.ts
├── App.tsx        # メインアプリケーション
├── index.tsx      # エントリーポイント
└── index.css      # グローバルスタイル
``` 