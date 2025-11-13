'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Dashboard Error:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
  }, [error]);

  return (
    <main className="flex h-full flex-col items-center justify-center gap-4 p-8">
      <ExclamationTriangleIcon className="w-16 h-16 text-red-500" />
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Something went wrong!</h2>
        <p className="text-gray-600 mb-4">
          We encountered an error while processing your request.
        </p>
        {error.digest && (
          <p className="text-sm text-gray-500 mb-4">
            Error ID: <code className="bg-gray-100 px-2 py-1 rounded">{error.digest}</code>
          </p>
        )}
      </div>
      <div className="flex gap-4">
        <button
          className="rounded-md bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400"
          onClick={() => reset()}
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="rounded-md bg-gray-200 px-6 py-3 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-300"
        >
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
}