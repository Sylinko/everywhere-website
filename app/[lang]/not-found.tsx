import { NotFoundContent } from '@/components/not-found';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'We searched Everywhere, but this place remains untouched.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundContent />;
}
