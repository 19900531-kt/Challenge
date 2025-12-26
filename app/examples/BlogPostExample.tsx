'use client';

import {
  useGetBlogPostsQuery,
  useGetBlogPostQuery,
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
} from '../../graphql/generated/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

/**
 * GraphQL Codegen で生成された @tanstack/react-query のフックを使用する例
 */
export default function BlogPostExample() {
  const queryClient = useQueryClient();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // Query: ブログ投稿一覧を取得
  const {
    data: postsData,
    isLoading: isLoadingPosts,
    error: postsError,
  } = useGetBlogPostsQuery();

  // Query: 特定のブログ投稿を取得
  const {
    data: postData,
    isLoading: isLoadingPost,
    error: postError,
  } = useGetBlogPostQuery(
    { id: selectedPostId! },
    {
      enabled: !!selectedPostId, // selectedPostId が存在する場合のみ実行
    }
  );

  // Mutation: ブログ投稿を作成
  const createPostMutation = useCreateBlogPostMutation({
    onSuccess: () => {
      // 成功時に投稿一覧を再取得
      queryClient.invalidateQueries(['GetBlogPosts']);
      alert('投稿を作成しました');
    },
    onError: (error) => {
      alert(`エラー: ${error.message}`);
    },
  });

  // Mutation: ブログ投稿を更新
  const updatePostMutation = useUpdateBlogPostMutation({
    onSuccess: () => {
      // 成功時に投稿一覧と個別投稿を再取得
      queryClient.invalidateQueries(['GetBlogPosts']);
      if (selectedPostId) {
        queryClient.invalidateQueries(['GetBlogPost', { id: selectedPostId }]);
      }
      alert('投稿を更新しました');
    },
    onError: (error) => {
      alert(`エラー: ${error.message}`);
    },
  });

  // Mutation: ブログ投稿を削除
  const deletePostMutation = useDeleteBlogPostMutation({
    onSuccess: () => {
      // 成功時に投稿一覧を再取得
      queryClient.invalidateQueries(['GetBlogPosts']);
      setSelectedPostId(null);
      alert('投稿を削除しました');
    },
    onError: (error) => {
      alert(`エラー: ${error.message}`);
    },
  });

  const handleCreatePost = () => {
    createPostMutation.mutate({
      input: {
        title: '新しい投稿',
        content: 'これはサンプル投稿です。',
      },
    });
  };

  const handleUpdatePost = (id: string) => {
    updatePostMutation.mutate({
      id,
      input: {
        title: '更新されたタイトル',
        content: '更新された内容',
      },
    });
  };

  const handleDeletePost = (id: string) => {
    if (confirm('この投稿を削除してもよろしいですか？')) {
      deletePostMutation.mutate({ id });
    }
  };

  if (isLoadingPosts) {
    return <div className="p-4">読み込み中...</div>;
  }

  if (postsError) {
    return (
      <div className="p-4 text-red-600">
        エラー: {postsError instanceof Error ? postsError.message : '不明なエラー'}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">ブログ投稿管理（GraphQL + React Query）</h2>
        <button
          onClick={handleCreatePost}
          disabled={createPostMutation.isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {createPostMutation.isLoading ? '作成中...' : '新規投稿作成'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 投稿一覧 */}
        <div>
          <h3 className="text-xl font-semibold mb-4">投稿一覧</h3>
          <div className="space-y-2">
            {postsData?.blogPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 border rounded-lg cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900"
                onClick={() => setSelectedPostId(post.id)}
              >
                <h4 className="font-semibold">{post.title}</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
                  {post.content}
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdatePost(post.id);
                    }}
                    disabled={updatePostMutation.isLoading}
                    className="px-2 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
                  >
                    更新
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePost(post.id);
                    }}
                    disabled={deletePostMutation.isLoading}
                    className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
            {postsData?.blogPosts.length === 0 && (
              <p className="text-zinc-500">投稿がありません</p>
            )}
          </div>
        </div>

        {/* 選択された投稿の詳細 */}
        <div>
          <h3 className="text-xl font-semibold mb-4">投稿詳細</h3>
          {selectedPostId ? (
            isLoadingPost ? (
              <div>読み込み中...</div>
            ) : postError ? (
              <div className="text-red-600">
                エラー: {postError instanceof Error ? postError.message : '不明なエラー'}
              </div>
            ) : postData?.blogPost ? (
              <div className="p-4 border rounded-lg">
                <h4 className="text-lg font-semibold mb-2">
                  {postData.blogPost.title}
                </h4>
                <p className="mb-4">{postData.blogPost.content}</p>
                <div className="text-sm text-zinc-500">
                  <div>作成: {new Date(postData.blogPost.createdAt).toLocaleString('ja-JP')}</div>
                  <div>更新: {new Date(postData.blogPost.updatedAt).toLocaleString('ja-JP')}</div>
                </div>
              </div>
            ) : (
              <div>投稿が見つかりません</div>
            )
          ) : (
            <div className="text-zinc-500">左側の投稿を選択してください</div>
          )}
        </div>
      </div>
    </div>
  );
}

