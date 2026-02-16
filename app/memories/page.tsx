'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Plus, Search, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Memory {
  id: string;
  content: string;
  tags: string[];
  created_at: string;
}

export default function MemoriesPage() {
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMemories();
  }, []);

  async function fetchMemories() {
    try {
      const res = await fetch('/api/v1/memories', {
        credentials: 'include',
      });
      
      if (res.status === 401) {
        router.push('/login');
        return;
      }

      const data = await res.json();
      setMemories(data.memories || []);
    } catch (err) {
      console.error('Failed to fetch memories:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredMemories = memories.filter(m => 
    m.content.toLowerCase().includes(search.toLowerCase()) ||
    m.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading memories...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-violet-600" />
            <h1 className="text-2xl font-bold text-gray-900">Memories</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              Dashboard
            </Button>
            <Button onClick={() => router.push('/memories/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Memory
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search memories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Memories Grid */}
        {filteredMemories.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No memories yet</h3>
              <p className="text-gray-500 mb-4">Start capturing your first memory</p>
              <Button onClick={() => router.push('/memories/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Memory
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMemories.map((memory) => (
              <Card key={memory.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500">
                    {new Date(memory.created_at).toLocaleDateString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-900 mb-3 line-clamp-3">{memory.content}</p>
                  {memory.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {memory.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-violet-100 text-violet-800"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 text-center text-sm text-gray-500">
          {memories.length} {memories.length === 1 ? 'memory' : 'memories'} stored
        </div>
      </main>
    </div>
  );
}
