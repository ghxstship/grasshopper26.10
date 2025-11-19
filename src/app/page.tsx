import { redirect } from 'next/navigation';

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api

export default function Home() {
  // Root domain (gvteway.one) redirects to GVTEWAY landing page
  // Subdomains are handled by middleware
  redirect('/gvteway');
}
