import { GraphQLClient } from 'graphql-request';

// GraphQL エンドポイントのURLを設定
// 実際のプロジェクトでは環境変数から取得することを推奨
const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || '/api/graphql';

export const graphqlClient = new GraphQLClient(endpoint, {
  headers: {
    'Content-Type': 'application/json',
  },
});

// fetch 関数として使用（codegen で生成されるコードで使用）
export const fetcher = <TData, TVariables>(
  query: string,
  variables?: TVariables
): (() => Promise<TData>) => {
  return async () => {
    const response = await graphqlClient.request<TData>(query, variables);
    return response;
  };
};


