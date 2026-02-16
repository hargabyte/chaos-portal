"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, Settings, LogOut, Brain, Tag, Clock, Loader2 } from "lucide-react";

interface Memory {
  id: string;
  content: string;
  created_at: string;
  tags: string[];
}

interface User {
  name: string;
  email: string;
}

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserAndMemories();
  }, []);

  const fetchUserAndMemories = async () => {
    try {
      // Fetch user profile
      const userResponse = await fetch("https://app.chaosmind.dev/api/v1/user/profile", {
        credentials: "include", // Sends httpOnly cookie
      });

      if (!userResponse.ok) {
        if (userResponse.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch user");
      }

      const userData = await userResponse.json();
      setUser(userData);

      // Fetch memories
      const memoriesResponse = await fetch("https://app.chaosmind.dev/api/v1/memories", {
        credentials: "include",
      });

      if (memoriesResponse.ok) {
        const memoriesData = await memoriesResponse.json();
        setMemories(memoriesData.memories || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("https://app.chaosmind.dev/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
    router.push("/login");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900">CHAOS</span>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-gray-600 hidden sm:block">{user.email}</span>
            )}
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder='Search your memories... (e.g., "What did I decide about pricing?")'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-6 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 text-lg rounded-xl focus:border-violet-500 focus:ring-violet-500"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Memories
            <span className="ml-2 text-sm font-normal text-gray-500">({memories.length} total)</span>
          </h2>
          <Link href="/memories/new">
            <Button className="bg-violet-600 hover:bg-violet-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Memory
            </Button>
          </Link>
        </div>

        {/* Memories List */}
        <div className="space-y-4">
          {memories.length === 0 ? (
            <Card className="bg-white border-gray-200">
              <CardContent className="py-12 text-center">
                <Brain className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">No memories yet</p>
                <Link href="/memories/new">
                  <Button className="bg-violet-600 hover:bg-violet-700 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Add your first memory
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            memories.map((memory) => (
              <Card
                key={memory.id}
                className="bg-white border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                        <Brain className="h-5 w-5 text-violet-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 mb-3 line-clamp-2">{memory.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {formatDate(memory.created_at)} • {formatTime(memory.created_at)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          <div className="flex gap-1">
                            {memory.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-gray-100 rounded text-gray-600 text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex gap-4">
          <Link href="/memories">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              View All
            </Button>
          </Link>
          <Link href="/analytics">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Analytics
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
