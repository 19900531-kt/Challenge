'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SuccessMessageProps {
  message: string;
  onClose: () => void;
  linkHref?: string;
  linkLabel?: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export default function SuccessMessage({
  message,
  onClose,
  linkHref,
  linkLabel,
  autoClose = true,
  autoCloseDelay = 5000,
}: SuccessMessageProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // マウント時にアニメーションを開始
    setTimeout(() => setIsVisible(true), 10);

    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(), 300); // アニメーション完了後に閉じる
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
    >
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg shadow-lg p-4 max-w-md">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-green-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">{message}</p>
            {linkHref && linkLabel && (
              <div className="mt-2">
                <Link
                  href={linkHref}
                  className="text-sm font-medium text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200 underline"
                  onClick={onClose}
                >
                  {linkLabel}
                </Link>
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex text-green-400 hover:text-green-500 focus:outline-none"
            >
              <span className="sr-only">閉じる</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

