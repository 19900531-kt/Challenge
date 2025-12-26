import { NextRequest, NextResponse } from 'next/server';
import { buildSchema } from 'graphql';
import { graphql } from 'graphql';
import { getPosts, savePost, deletePost, getPostById } from '../../utils/serverStorage';

// GraphQL スキーマを定義
const schema = buildSchema(`
  type Author {
    name: String!
    avatar: String!
  }

  type BlogPost {
    id: ID!
    title: String!
    content: String!
    author: Author!
    tags: [String!]!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    blogPosts: [BlogPost!]!
    blogPost(id: ID!): BlogPost
  }

  type Mutation {
    createPost(input: CreatePostInput!): BlogPost!
    createBlogPost(input: CreateBlogPostInput!): BlogPost!
    updateBlogPost(id: ID!, input: UpdateBlogPostInput!): BlogPost!
    deleteBlogPost(id: ID!): Boolean!
  }

  input CreatePostInput {
    title: String!
    content: String!
    author: String!
    tags: [String!]!
  }

  input CreateBlogPostInput {
    title: String!
    content: String!
    author: String!
    tags: [String!]!
  }

  input UpdateBlogPostInput {
    title: String
    content: String
    tags: [String!]
  }
`);

// 既存のデータにauthorとtagsがない場合のデフォルト値を設定するヘルパー関数
function ensurePostStructure(post: any) {
  return {
    ...post,
    author: post.author || { name: 'Unknown', avatar: '' },
    tags: post.tags || [],
    content: post.content || '',
  };
}

// リゾルバーを定義（非同期関数）
const rootValue = {
  blogPosts: async () => {
    const posts = await getPosts();
    return posts.map(ensurePostStructure);
  },
  blogPost: async ({ id }: { id: string }) => {
    const post = await getPostById(id);
    return post ? ensurePostStructure(post) : null;
  },
  createPost: async ({ input }: { input: { title: string; content: string; author: string; tags: string[] } }) => {
    // バリデーション
    if (!input.title || !input.title.trim()) {
      throw new Error('タイトルは必須です');
    }
    if (!input.content || !input.content.trim()) {
      throw new Error('内容は必須です');
    }
    if (!input.author || !input.author.trim()) {
      throw new Error('著者名は必須です');
    }
    if (input.title.length > 100) {
      throw new Error('タイトルは100文字以内で入力してください');
    }
    if (input.content.length < 10) {
      throw new Error('内容は10文字以上で入力してください');
    }
    if (input.content.length > 5000) {
      throw new Error('内容は5000文字以内で入力してください');
    }

    const now = new Date().toISOString();
    const newPost = {
      id: Date.now().toString(),
      title: input.title.trim(),
      content: input.content.trim(),
      author: {
        name: input.author.trim(),
        avatar: '',
      },
      tags: input.tags || [],
      createdAt: now,
      updatedAt: now,
    };
    await savePost(newPost);
    return newPost;
  },
  createBlogPost: async ({ input }: { input: { title: string; content: string; author: string; tags: string[] } }) => {
    // バリデーション
    if (!input.title || !input.title.trim()) {
      throw new Error('タイトルは必須です');
    }
    if (!input.content || !input.content.trim()) {
      throw new Error('内容は必須です');
    }
    if (!input.author || !input.author.trim()) {
      throw new Error('著者名は必須です');
    }
    if (input.title.length > 100) {
      throw new Error('タイトルは100文字以内で入力してください');
    }
    if (input.content.length < 10) {
      throw new Error('内容は10文字以上で入力してください');
    }
    if (input.content.length > 5000) {
      throw new Error('内容は5000文字以内で入力してください');
    }

    const now = new Date().toISOString();
    const newPost = {
      id: Date.now().toString(),
      title: input.title.trim(),
      content: input.content.trim(),
      author: {
        name: input.author.trim(),
        avatar: '',
      },
      tags: input.tags || [],
      createdAt: now,
      updatedAt: now,
    };
    await savePost(newPost);
    return newPost;
  },
  updateBlogPost: async ({ id, input }: { id: string; input: { title?: string; content?: string; tags?: string[] } }) => {
    const existingPost = await getPostById(id);
    if (!existingPost) {
      throw new Error(`Post with id ${id} not found`);
    }

    // バリデーション
    if (input.title !== undefined) {
      if (!input.title.trim()) {
        throw new Error('タイトルは必須です');
      }
      if (input.title.length > 100) {
        throw new Error('タイトルは100文字以内で入力してください');
      }
    }
    if (input.content !== undefined) {
      if (!input.content.trim()) {
        throw new Error('内容は必須です');
      }
      if (input.content.length < 10) {
        throw new Error('内容は10文字以上で入力してください');
      }
      if (input.content.length > 5000) {
        throw new Error('内容は5000文字以内で入力してください');
      }
    }

    const updatedPost = {
      ...existingPost,
      title: input.title !== undefined ? input.title.trim() : existingPost.title,
      content: input.content !== undefined ? input.content.trim() : existingPost.content,
      tags: input.tags !== undefined ? input.tags : existingPost.tags || [],
      updatedAt: new Date().toISOString(),
    };
    await savePost(updatedPost);
    return updatedPost;
  },
  deleteBlogPost: async ({ id }: { id: string }) => {
    const existingPost = await getPostById(id);
    if (!existingPost) {
      throw new Error(`Post with id ${id} not found`);
    }
    await deletePost(id);
    return true;
  },
};

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

    const result = await graphql({
      schema,
      source: query,
      rootValue,
      variableValues: variables,
    });

    // GraphQL のエラーがある場合は 200 で返す（GraphQL の仕様）
    if (result.errors && result.errors.length > 0) {
      return NextResponse.json(result, { status: 200 });
    }

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('GraphQL Error:', error);
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

