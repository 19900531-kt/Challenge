'use client';

import Link from 'next/link';
import { BlogPost } from '../types/blog';

interface BlogPostCardProps {
  post: BlogPost;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
}

export default function BlogPostCard({ post, onEdit, onDelete }: BlogPostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <Link
            href={`/posts/${post.id}`}
            className="block group mb-3"
          >
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {post.title}
            </h3>
          </Link>
          <div className="space-y-2">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              <span className="font-medium">著者:</span>{' '}
              <span className="text-zinc-900 dark:text-zinc-100">{post.author.name}</span>
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-500">
              <span className="font-medium">投稿日時:</span>{' '}
              {formatDate(post.createdAt)}
            </div>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(post)}
            className="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
          >
            編集
          </button>
          <button
            onClick={() => onDelete(post.id)}
            className="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}



