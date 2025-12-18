import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold mb-4">Celebrity Not Found</h2>
      <p className="text-gray-600 mb-6">Could not find the requested celebrity</p>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}
