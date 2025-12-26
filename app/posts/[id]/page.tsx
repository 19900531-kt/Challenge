'use client';

import { use } from 'react';
import Link from 'next/link';
import { useGetBlogPostQuery } from '../../../graphql/generated/react-query';
import LoadingState from '../../components/LoadingState';
import ErrorMessage from '../../components/ErrorMessage';
import NotFound from '../../components/NotFound';

export default function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, error, refetch } = useGetBlogPostQuery(
    { id },
    {
      enabled: !!id,
    }
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ローディング状態
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← 一覧に戻る
            </Link>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-8">
            <LoadingState message="投稿を読み込んでいます..." />
          </div>
        </div>
      </div>
    );
  }

  // エラー状態
  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← 一覧に戻る
            </Link>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
            <ErrorMessage
              error={error}
              onRetry={() => refetch()}
              title="投稿の取得に失敗しました"
            />
          </div>
        </div>
      </div>
    );
  }

  const post = data?.blogPost;

  // Not Found状態（投稿が見つからない場合）
  if (!post) {
    return (
      <NotFound
        message="指定された投稿が見つかりませんでした"
        backHref="/"
        backLabel="一覧に戻る"
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6"
        >
          ← 一覧に戻る
        </Link>

        <article className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-8">
          {/* タイトル */}
          <header className="mb-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
              {post.title}
            </h1>

            {/* 著者情報（アバター + 著者名） */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0">
                {post.author.avatar ? (
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-zinc-200 dark:border-zinc-700"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center border-2 border-zinc-200 dark:border-zinc-700">
                    <span className="text-lg font-semibold text-zinc-500 dark:text-zinc-400">
                      {post.author.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {post.author.name}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-500">
                  {formatDate(post.createdAt)}
                </div>
              </div>
            </div>

            {/* タグ */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* 本文 */}
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <div className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

