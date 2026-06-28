"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import type { Post } from "@/types";

export function BlogFilters({
  posts,
  onFilteredPostsChange,
}: {
  posts: Post[];
  onFilteredPostsChange: (filtered: Post[]) => void;
}) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags ?? []))
  ).sort();

  useEffect(() => {
    let filtered = posts;

    if (selectedTag) {
      filtered = filtered.filter((post) => post.tags?.includes(selectedTag));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    onFilteredPostsChange(filtered);
  }, [selectedTag, searchQuery, posts, onFilteredPostsChange]);

  const clearFilters = () => {
    setSelectedTag(null);
    setSearchQuery("");
  };

  const hasActiveFilters = selectedTag || searchQuery.trim();

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por título, excerpt o tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="size-4" />
          </Button>
        )}
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedTag === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedTag(null)}
          >
            Todos
          </Badge>
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}