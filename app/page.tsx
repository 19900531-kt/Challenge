'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useGetBlogPostsQuery,
  useCreatePostMutation,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
} from '../graphql/generated/react-query';
import BlogPostCard from './components/BlogPostCard';
import BlogPostForm from './components/BlogPostForm';
import LoadingState from './components/LoadingState';
import ErrorMessage from './components/ErrorMessage';
import SuccessMessage from './components/SuccessMessage';

export default function Home() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<{
    id: string;
    title: string;
    content?: string;
    author: { name: string };
    tags?: string[];
    createdAt: string;
    updatedAt: string;
  } | null>(null);
  const [successMessage, setSuccessMessage] = useState<{
    message: string;
    postId?: string;
  } | null>(null);

  // Query: ブログ投稿一覧を取得
  const {
    data: postsData,
    isLoading,
    error,
    refetch,
  } = useGetBlogPostsQuery(undefined, {
    queryKey: ['GetBlogPosts'],
    staleTime: 1000 * 60, // 1分間キャッシュ
  } as any);

  // Mutation: ブログ投稿を作成（createPostを使用）
  const createMutation = useCreatePostMutation({
    onSuccess: (data) => {
      // 成功時に投稿一覧のキャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: ['GetBlogPosts'] });
      setIsFormOpen(false);
      setEditingPost(null);
      // 成功メッセージを表示
      setSuccessMessage({
        message: '投稿が正常に作成されました！',
        postId: data.createPost.id,
      });
    },
    onError: (error) => {
      // エラーはフォーム内で表示される
      console.error('投稿作成エラー:', error);
    },
  });

  // Mutation: ブログ投稿を更新
  const updateMutation = useUpdateBlogPostMutation({
    onSuccess: () => {
      // 成功時に投稿一覧のキャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: ['GetBlogPosts'] });
      setIsFormOpen(false);
      setEditingPost(null);
      // 成功メッセージを表示
      setSuccessMessage({
        message: '投稿が正常に更新されました！',
      });
    },
    onError: (error) => {
      // エラーはフォーム内で表示される
      console.error('投稿更新エラー:', error);
    },
  });

  // Mutation: ブログ投稿を削除
  const deleteMutation = useDeleteBlogPostMutation({
    onSuccess: () => {
      // 成功時に投稿一覧のキャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: ['GetBlogPosts'] });
    },
    onError: (error) => {
      alert(`削除に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    },
  });

  const handleCreate = () => {
    setEditingPost(null);
    setIsFormOpen(true);
  };

  const handleEdit = (post: {
    id: string;
    title: string;
    content?: string;
    author: { name: string };
    tags?: string[];
    createdAt: string;
    updatedAt: string;
  }) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const handleSave = (post: {
    id: string;
    title: string;
    content?: string;
    author: { name: string };
    tags?: string[];
    createdAt: string;
    updatedAt: string;
  }) => {
    if (editingPost) {
      // 更新
      updateMutation.mutate({
        id: post.id,
        input: {
          title: post.title,
          content: post.content,
          tags: post.tags || [],
        },
      });
    } else {
      // 作成
      createMutation.mutate({
        input: {
          title: post.title,
          content: post.content || '',
          author: post.author.name,
          tags: post.tags || [],
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('この投稿を削除してもよろしいですか？')) {
      deleteMutation.mutate({ id });
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingPost(null);
  };

  // 投稿日で降順ソート（新しい順）
  const posts = [...(postsData?.blogPosts || [])].map((post) => ({
    ...post,
    author: {
      name: post.author.name,
      avatar: (post.author as any).avatar || '',
    },
    content: (post as any).content || '',
    tags: post.tags || [],
  })).sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            ミニブログ管理ダッシュボード
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            ブログ投稿の作成、編集、削除ができます
          </p>
        </header>

        <div className="mb-6">
          <button
            onClick={handleCreate}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            + 新しい投稿を作成
          </button>
        </div>

        {isLoading ? (
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <LoadingState message="投稿を読み込んでいます..." />
          </div>
        ) : error ? (
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
            <ErrorMessage
              error={error}
              onRetry={() => refetch()}
              title="投稿の取得に失敗しました"
            />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">
              まだ投稿がありません。最初の投稿を作成しましょう！
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <BlogPostCard
                key={post.id}
                post={post}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {isFormOpen && (
          <BlogPostForm
            post={editingPost}
            onSave={handleSave}
            onCancel={handleCancel}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
            error={(createMutation.error || updateMutation.error) as Error | null}
          />
        )}

        {/* 成功メッセージ */}
        {successMessage && (
          <SuccessMessage
            message={successMessage.message}
            onClose={() => setSuccessMessage(null)}
            linkHref={successMessage.postId ? `/posts/${successMessage.postId}` : undefined}
            linkLabel={successMessage.postId ? '詳細ページを表示' : undefined}
          />
        )}
      </div>
    </div>
  );
}
