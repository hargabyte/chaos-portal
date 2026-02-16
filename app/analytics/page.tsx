'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Brain, TrendingUp } from 'lucide-react';

export default function AnalyticsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-8 w-8 text-violet-600" />
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          </div>
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>Analytics dashboard is under development</CardDescription>
          </CardHeader>
          <CardContent className="py-12 text-center">
            <TrendingUp className="h-16 w-16 text-violet-200 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Track your memory usage, search patterns, and insights.
              This feature will be available soon.
            </p>
            <Button onClick={() => router.push('/dashboard')}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
