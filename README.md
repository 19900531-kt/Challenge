# ミニブログ管理ダッシュボード

このプロジェクトは、React と Next.js を使用したミニブログ管理ダッシュボードです。GraphQL API を使用してブログ投稿の作成、編集、削除、表示を行うことができます。

## 起動方法（Front）

### 前提条件

- Node.js 18.0.0 以上
- npm または yarn

### セットアップ

1. 依存関係のインストール

```bash
npm install
```

2. GraphQL コード生成（初回のみ、またはスキーマ変更時）

```bash
npm run codegen
```

3. 開発サーバーの起動

```bash
npm run dev
```

4. ブラウザでアクセス

[http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認します。

### その他のコマンド

```bash
# 本番ビルド
npm run build

# 本番サーバーの起動
npm start

# コード生成（監視モード）
npm run codegen:watch

# リンターの実行
npm run lint
```

## 使用技術

### フロントエンド

- **Next.js 16.1.1** - React フレームワーク（App Router）
- **React 19.2.3** - UI ライブラリ
- **TypeScript 5** - 型安全性
- **Tailwind CSS 4** - ユーティリティファーストの CSS フレームワーク

### データフェッチング・状態管理

- **@tanstack/react-query 5.90.12** - サーバー状態管理とデータフェッチング
- **GraphQL** - API クエリ言語
- **graphql-request 7.4.0** - GraphQL クライアント

### フォーム管理・バリデーション

- **react-hook-form 7.69.0** - フォーム管理ライブラリ
- **zod 4.2.1** - TypeScript ファーストのスキーマバリデーション
- **@hookform/resolvers 5.2.2** - react-hook-form と zod の統合

### 開発ツール

- **GraphQL Code Generator** - GraphQL スキーマから TypeScript 型と React Query フックを自動生成
  - `@graphql-codegen/cli`
  - `@graphql-codegen/client-preset`
  - `@graphql-codegen/typescript-react-query`

### その他

- **ESLint** - コード品質チェック
- **PostCSS** - CSS 処理

## 完成度

### 実装済み機能

#### 記事一覧ページ
- ✅ 記事一覧の表示（タイトル、著者名、投稿日時）
- ✅ 投稿日時の降順ソート（新しい順）
- ✅ ローディング状態の表示
- ✅ エラー状態の表示と再試行機能
- ✅ 空状態の表示

#### 記事詳細ページ
- ✅ 記事詳細の表示（タイトル、著者名、アバター、投稿日、本文、タグ）
- ✅ ローディング状態の表示
- ✅ エラー状態の表示と再試行機能
- ✅ Not Found 状態の表示
- ✅ 一覧ページへの戻るリンク

#### 新規記事作成
- ✅ 記事作成フォーム（タイトル、本文、著者選択、タグ入力）
- ✅ 著者選択（固定値のドロップダウン）
- ✅ タグ入力（カンマ区切り → 配列変換）
- ✅ フォームバリデーション（zod + react-hook-form）
- ✅ 投稿成功後の成功メッセージ表示
- ✅ 投稿成功後の詳細ページへの遷移リンク

#### 記事編集
- ✅ 記事編集フォーム
- ✅ フォームバリデーション
- ✅ 更新成功後の成功メッセージ表示

#### 記事削除
- ✅ 記事削除機能
- ✅ 削除確認ダイアログ

#### UI/UX
- ✅ レスポンシブデザイン
- ✅ ダークモード対応
- ✅ ローディングスピナー
- ✅ エラーメッセージ表示
- ✅ 成功メッセージ表示（トースト通知）
- ✅ アニメーション効果

#### 技術実装
- ✅ GraphQL Code Generation による型安全なコード生成
- ✅ React Query によるデータキャッシュと状態管理
- ✅ クライアントサイドバリデーション（zod）
- ✅ サーバーサイドバリデーション（GraphQL API）
- ✅ 外部 GraphQL API との統合

### 未実装機能

現在、明示的に要求された機能はすべて実装済みです。

#### 将来の拡張候補（オプション）
- ページネーション
- 検索機能
- フィルタリング機能
- 画像アップロード
- マークダウンエディタ
- 認証・認可機能
- コメント機能

## GraphQL API

このプロジェクトでは、データ取得・更新に **外部GraphQL API** を使用しています。

### GraphQL エンドポイント

- **URL**: `https://kadai-post-server-o8swk2av3-instansys.vercel.app/api/graphql`
- **メソッド**: POST
- **環境変数**: `NEXT_PUBLIC_GRAPHQL_ENDPOINT` でエンドポイントを変更可能

### 利用可能な操作

#### Query（取得）
- `blogPosts`: すべてのブログ投稿を取得
- `blogPost(id: ID!)`: 特定のブログ投稿を取得

#### Mutation（更新）
- `createBlogPost(input: CreateBlogPostInput!)`: 新しいブログ投稿を作成
- `updateBlogPost(id: ID!, input: UpdateBlogPostInput!)`: 既存のブログ投稿を更新
- `deleteBlogPost(id: ID!)`: ブログ投稿を削除

### GraphQL Code Generation

このプロジェクトでは [GraphQL Code Generator](https://the-guild.dev/graphql/codegen) を使用して、GraphQL スキーマから TypeScript の型と `@tanstack/react-query` のフックを自動生成します。

### コード生成の実行

```bash
# 一度だけ実行
npm run codegen

# ファイル変更を監視して自動生成
npm run codegen:watch
```

### 生成されるファイル

- `graphql/generated/react-query.ts` - React Query のフック（`useQuery`, `useMutation`）
- `graphql/generated/graphql.ts` - TypeScript の型定義
- `graphql/generated/gql.ts` - GraphQL クエリの型安全なラッパー

### 使用方法

生成されたフックは以下のように使用できます：

```typescript
import { useGetBlogPostsQuery, useCreateBlogPostMutation } from '@/graphql/generated/react-query';

function MyComponent() {
  // Query の使用例
  const { data, isLoading, error } = useGetBlogPostsQuery();

  // Mutation の使用例
  const createMutation = useCreateBlogPostMutation({
    onSuccess: () => {
      // 成功時の処理
    },
  });

  return (
    // ...
  );
}
```

詳細な使用例は `app/examples/BlogPostExample.tsx` を参照してください。

### GraphQL スキーマとクエリの追加

1. `graphql/schema.graphql` にスキーマを定義
2. `graphql/queries/` または `graphql/mutations/` に `.graphql` ファイルを作成
3. `app/api/graphql/route.ts` にリゾルバーを実装
4. `npm run codegen` を実行してコードを生成

### 外部GraphQLサーバー

このプロジェクトは外部のGraphQLサーバーを使用しています。エンドポイントは環境変数 `NEXT_PUBLIC_GRAPHQL_ENDPOINT` で設定できます。

デフォルトのエンドポイント: `https://kadai-post-server-o8swk2av3-instansys.vercel.app/api/graphql`

### バリデーション

GraphQL API では以下のバリデーションが実装されています：

- **タイトル**: 必須、1-100文字
- **内容**: 必須、10-5000文字

クライアントサイド（react-hook-form + zod）とサーバーサイド（GraphQL API）の両方でバリデーションが行われます。

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
