"use client";

import { useState } from "react";
import { BlogFilters } from "@/components/blog/BlogFilters";
import { PostCard } from "@/components/blog/PostCard";
import type { Post } from "@/types";

export function BlogPageClient({
  posts,
}: {
  posts: Post[];
}) {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);

  return (
    <>
      <BlogFilters posts={posts} onFilteredPostsChange={setFilteredPosts} />
      {filteredPosts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">
            No se encontraron posts con estos filtros.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </>
  );
}