import LoadingSpinner from './LoadingSpinner';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingState({ message = '読み込み中...', size = 'md' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <LoadingSpinner size={size} />
      <p className="mt-4 text-zinc-500 dark:text-zinc-400 text-lg">{message}</p>
    </div>
  );
}

