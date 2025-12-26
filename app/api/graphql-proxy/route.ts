import { NextRequest, NextResponse } from 'next/server';

const EXTERNAL_GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 
  'https://kadai-post-server-o8swk2av3-instansys.vercel.app/api/graphql';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, variables } = body;

    if (!query) {
      return NextResponse.json(
        {
          errors: [
            {
              message: 'GraphQL query is required',
            },
          ],
        },
        { status: 400 }
      );
    }

    // 外部GraphQLサーバーにリクエストをプロキシ
    const response = await fetch(EXTERNAL_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      return NextResponse.json(
        {
          errors: [
            {
              message: `External GraphQL server error: ${response.status} - ${errorText}`,
            },
          ],
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // CORSヘッダーを追加
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('GraphQL Proxy Error:', error);
    return NextResponse.json(
      {
        errors: [
          {
            message: error instanceof Error ? error.message : 'Internal server error',
          },
        ],
      },
      { status: 500 }
    );
  }
}

// OPTIONSリクエスト（CORS preflight）を処理
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

