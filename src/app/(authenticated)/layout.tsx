/**
 * Authenticated Routes Layout
 * Wraps all routes requiring authentication
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Add authentication check
  // const session = await getServerSession();
  // if (!session) {
  //   redirect('/auth/login');
  // }

  return <>{children}</>;
}
