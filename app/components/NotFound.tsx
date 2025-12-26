import Link from 'next/link';

interface NotFoundProps {
  message?: string;
  backHref?: string;
  backLabel?: string;
}

export default function NotFound({
  message = 'ページが見つかりません',
  backHref = '/',
  backLabel = '一覧に戻る',
}: NotFoundProps) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
      <div className="text-center px-4">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-900 mb-4">
            <svg
              className="w-10 h-10 text-zinc-400 dark:text-zinc-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">404</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">{message}</p>
        </div>
        <Link
          href={backHref}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          ← {backLabel}
        </Link>
      </div>
    </div>
  );
}

