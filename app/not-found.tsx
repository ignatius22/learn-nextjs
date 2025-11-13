import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-4">
      <FaceFrownIcon className="w-16 text-gray-400" />
      <h2 className="text-2xl font-semibold">404 Not Found</h2>
      <p className="text-gray-600">Could not find the requested resource.</p>
      <Link
        href="/"
        className="mt-4 rounded-md bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400"
      >
        Go Back Home
      </Link>
    </main>
  );
}
