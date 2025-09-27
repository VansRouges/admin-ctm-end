import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect all users to login page as this is an admin-only application
  redirect('/login');
}
