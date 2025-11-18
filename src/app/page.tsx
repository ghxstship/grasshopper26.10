import { redirect } from 'next/navigation';

export default function Home() {
  // Root domain (gvteway.one) redirects to GVTEWAY landing page
  // Subdomains are handled by middleware
  redirect('/gvteway');
}
