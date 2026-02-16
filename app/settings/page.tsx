'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, User, Key, Shield } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  tenant_id: string;
  role: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch('/api/v1/user/profile', {
        credentials: 'include',
      });
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Settings className="h-8 w-8 text-violet-600" />
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-violet-600" />
              <CardTitle>Profile</CardTitle>
            </div>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-500">Name</Label>
                <p className="text-gray-900 font-medium">{user?.name || 'Not set'}</p>
              </div>
              <div>
                <Label className="text-gray-500">Email</Label>
                <p className="text-gray-900 font-medium">{user?.email}</p>
              </div>
              <div>
                <Label className="text-gray-500">Role</Label>
                <p className="text-gray-900 font-medium capitalize">{user?.role}</p>
              </div>
              <div>
                <Label className="text-gray-500">Workspace ID</Label>
                <p className="text-gray-900 font-mono text-sm">{user?.tenant_id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-violet-600" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-sm mb-4">
              Password change functionality coming soon.
            </p>
            <Button variant="outline" disabled>
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* API Keys Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Key className="h-5 w-5 text-violet-600" />
              <CardTitle>API Keys</CardTitle>
            </div>
            <CardDescription>Manage your API access</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-sm mb-4">
              API key management coming soon. Your API key was provided during registration.
            </p>
            <Button variant="outline" disabled>
              Generate New Key
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50" disabled>
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
