"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, X, Loader2 } from "lucide-react";

export default function AddMemoryPage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const maxChars = 500;

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 10) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);

    try {
      // TODO: Call API to save memory
      const response = await fetch("https://app.chaosmind.dev/api/v1/memories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Sends httpOnly cookie
        body: JSON.stringify({ content, tags }),
      });

      if (!response.ok) {
        throw new Error("Failed to save memory");
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving memory:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">Add Memory</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Memory Content */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-gray-700">Memory Content</Label>
                <Textarea
                  id="content"
                  placeholder="What do you want to remember?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={maxChars}
                  rows={6}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-violet-500 focus:ring-violet-500 resize-none"
                  required
                />
                <div className="text-right text-sm text-gray-500">
                  {content.length}/{maxChars} characters
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label className="text-gray-700">Tags (optional)</Label>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-violet-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-violet-500 focus:ring-violet-500"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTag}
                    disabled={!newTag.trim() || tags.length >= 10}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500">Press Enter to add a tag. Max 10 tags.</p>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading || !content.trim()}
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Memory"
                  )}
                </Button>
                <Link href="/dashboard">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
