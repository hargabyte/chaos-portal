'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PortalPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500">Redirecting to dashboard...</div>
    </div>
  );
}
