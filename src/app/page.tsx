import { redirect } from 'next/navigation';

export default function Page() {
  // Immediately redirect root to photographer login
  redirect('/photographer/login');
}