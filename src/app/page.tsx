import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to public landing page
  redirect('/(public)');
}
