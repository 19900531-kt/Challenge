'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogPostFormSchema, type BlogPostFormData } from '../schemas/blogPost';

// フォーム入力用の型（tagsは文字列）
type BlogPostFormInput = {
  title: string;
  content: string;
  author: string;
  tags?: string;
};

// 固定の著者リスト
const AUTHORS = [
  '山田太郎',
  '佐藤花子',
  '鈴木一郎',
  '田中次郎',
  '高橋三郎',
  '伊藤四郎',
  '渡辺五郎',
];

interface BlogPostFormProps {
  post?: {
    id: string;
    title: string;
    content?: string;
    author: { name: string };
    tags?: string[];
    createdAt: string;
    updatedAt: string;
  } | null;
  onSave: (post: {
    id: string;
    title: string;
    content?: string;
    author: { name: string };
    tags?: string[];
    createdAt: string;
    updatedAt: string;
  }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  error?: Error | null;
}

export default function BlogPostForm({ post, onSave, onCancel, isSubmitting = false, error }: BlogPostFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<BlogPostFormInput, any, BlogPostFormData>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: post?.title || '',
      content: post?.content || '',
      author: post?.author?.name || '',
      tags: post?.tags ? post.tags.join(', ') : '',
    },
    mode: 'onBlur', // フォーカスが外れたときにバリデーション
  });

  // post が変更されたときにフォームをリセット
  useEffect(() => {
    reset({
      title: post?.title || '',
      content: post?.content || '',
      author: post?.author?.name || '',
      tags: post?.tags ? post.tags.join(', ') : '',
    } as BlogPostFormInput);
  }, [post, reset]);

  const onSubmit = (data: BlogPostFormData) => {
    const now = new Date().toISOString();
    const blogPost = post
      ? {
          ...post,
          title: data.title,
          content: data.content,
          author: { name: data.author },
          tags: data.tags,
          updatedAt: now,
        }
      : {
          id: '', // 作成時は空文字（サーバー側で生成される）
          title: data.title,
          content: data.content,
          author: { name: data.author },
          tags: data.tags,
          createdAt: now,
          updatedAt: now,
        };

    onSave(blogPost);
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            {post ? '投稿を編集' : '新しい投稿を作成'}
          </h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    エラーが発生しました
                  </p>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                    {error instanceof Error ? error.message : '不明なエラーが発生しました'}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              タイトル
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className={`w-full px-4 py-2 border rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 resize-none ${
                errors.title
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-zinc-300 dark:border-zinc-700 focus:ring-blue-500'
              }`}
              placeholder="投稿のタイトルを入力（1-100文字）"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              本文
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              id="content"
              rows={12}
              {...register('content')}
              className={`w-full px-4 py-2 border rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 resize-none ${
                errors.content
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-zinc-300 dark:border-zinc-700 focus:ring-blue-500'
              }`}
              placeholder="投稿の本文を入力（10-5000文字）"
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                {errors.content.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="author"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              著者選択
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              id="author"
              {...register('author')}
              className={`w-full px-4 py-2 border rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 ${
                errors.author
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-zinc-300 dark:border-zinc-700 focus:ring-blue-500'
              }`}
            >
              <option value="">著者を選択してください</option>
              {AUTHORS.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
            {errors.author && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                {errors.author.message}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              タグ
            </label>
            <input
              id="tags"
              type="text"
              {...register('tags')}
              className={`w-full px-4 py-2 border rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 resize-none ${
                errors.tags
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-zinc-300 dark:border-zinc-700 focus:ring-blue-500'
              }`}
              placeholder="タグをカンマ区切りで入力（例: React, TypeScript, Next.js）"
            />
            {errors.tags && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                {errors.tags.message}
              </p>
            )}
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              カンマ区切りで複数のタグを入力できます（最大10個、各タグは20文字以内）
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (post ? '更新中...' : '作成中...') : (post ? '更新' : '作成')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



