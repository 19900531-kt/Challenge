import type { CodegenConfig } from '@graphql-codegen/cli';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://kadai-post-server-o8swk2av3-instansys.vercel.app/api/graphql';

const config: CodegenConfig = {
  // スキーマファイルを使用（外部サーバーが認証を必要とするため）
  schema: './graphql/schema.graphql',
  documents: ['./graphql/**/*.graphql'],
  generates: {
    './graphql/generated/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
    './graphql/generated/react-query.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-query',
      ],
      config: {
        fetcher: {
          endpoint: `process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "${GRAPHQL_ENDPOINT}"`,
          fetchParams: JSON.stringify({
            headers: {
              'Content-Type': 'application/json',
            },
          }),
        },
        exposeQueryKeys: true,
        exposeFetcher: true,
        addInfiniteQuery: false,
      },
    },
  },
};

export default config;

