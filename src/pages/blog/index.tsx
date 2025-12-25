import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, User } from "lucide-react";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  author: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      const result = await response.json();
      if (response.ok) {
        setPosts(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncateContent = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-2">
              Blog
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Koleksi artikel dan tulisan terbaru
            </p>
          </div>
          <Link href="/blog/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Buat Post Baru
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">Memuat posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Belum ada posts. Mulai dengan membuat post pertama!
              </p>
              <Link href="/blog/new">
                <Button>Buat Post Pertama</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.id} className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="line-clamp-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {post.excerpt || "Tidak ada ringkasan"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.author && (
                      <Badge variant="secondary" className="gap-1">
                        <User className="h-3 w-3" />
                        {post.author}
                      </Badge>
                    )}
                    <Badge variant="outline" className="gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.createdAt)}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Link href={`/blog/${post.slug}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      Baca Selengkapnya
                    </Button>
                  </Link>
                  <Link href={`/blog/${post.slug}/edit`}>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

