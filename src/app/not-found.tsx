import { Hero, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-4">
        <Hero className="mb-8">404</Hero>
        <Body className="mb-8 text-gray-600 text-lg">
          Page not found. The resource you are looking for does not exist.
        </Body>
        <Link href="/">
          <Button variant="primary" size="lg">Return Home</Button>
        </Link>
      </div>
    </div>
  );
}
