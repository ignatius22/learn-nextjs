'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex h-screen flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-bold">Something went wrong!</h2>
          <p className="text-gray-600">A critical error occurred. Please try again.</p>
          {error.digest && (
            <p className="text-sm text-gray-500">
              Error ID: <code>{error.digest}</code>
            </p>
          )}
          <button
            className="rounded-md bg-blue-500 px-6 py-3 text-white hover:bg-blue-400"
            onClick={() => reset()}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
