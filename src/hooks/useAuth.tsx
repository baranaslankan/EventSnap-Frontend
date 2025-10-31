'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export const useAuth = (requireAuth = true) => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = isAuthenticated();
    setIsAuth(auth);
    setLoading(false);

    if (requireAuth && !auth) {
      router.push('/photographer/login');
    }
  }, [requireAuth, router]);

  return { isAuth, loading };
};