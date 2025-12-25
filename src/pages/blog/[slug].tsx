import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Calendar, User, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Section {
  id: number;
  type: 'text' | 'html' | 'code' | 'image' | 'video';
  title?: string;
  content: string;
  metadata?: {
    alt?: string;
    language?: string;
    [key: string]: unknown;
  };
  order: number;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  author: string | null;
  createdAt: string;
  updatedAt: string;
  sections?: Section[];
}

export default function BlogDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/slug/${slug}`);
      const result = await response.json();
      if (response.ok) {
        setPost(result.data);
      } else {
        router.push("/blog");
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      router.push("/blog");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!post) return;

    setDeleting(true);
    setShowDeleteDialog(false);
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Post berhasil dihapus!", {
          description: "Post telah dihapus dari database.",
        });
        router.push("/blog");
      } else {
        toast.error("Gagal menghapus post", {
          description: "Terjadi kesalahan saat menghapus post.",
        });
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Gagal menghapus post", {
        description: "Terjadi kesalahan saat menghapus post. Silakan coba lagi.",
      });
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderSection = (section: Section) => {
    const getVideoEmbedUrl = (url: string) => {
      // YouTube
      const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
      const youtubeMatch = url.match(youtubeRegex);
      if (youtubeMatch) {
        return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
      }
      
      // Vimeo
      const vimeoRegex = /vimeo\.com\/(\d+)/;
      const vimeoMatch = url.match(vimeoRegex);
      if (vimeoMatch) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
      }
      
      return url;
    };

    let sectionContent;
    switch (section.type) {
      case 'text':
        sectionContent = (
          <div className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 leading-7">
            {section.content}
          </div>
        );
        break;
      
      case 'html':
        sectionContent = (
          <div 
            className="prose prose-zinc dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        );
        break;
      
      case 'code':
        sectionContent = (
          <div>
            <pre className="bg-zinc-900 dark:bg-zinc-950 text-zinc-100 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">{section.content}</code>
            </pre>
            {section.metadata?.language && (
              <p className="text-xs text-zinc-500 mt-1">Language: {section.metadata.language}</p>
            )}
          </div>
        );
        break;
      
      case 'image':
        sectionContent = (
          <div>
            <img 
              src={section.content} 
              alt={section.metadata?.alt || 'Image'} 
              className="w-full rounded-lg"
            />
            {section.metadata?.alt && (
              <p className="text-sm text-zinc-500 mt-2 text-center italic">
                {section.metadata.alt}
              </p>
            )}
          </div>
        );
        break;
      
      case 'video':
        sectionContent = (
          <div>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={getVideoEmbedUrl(section.content)}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        );
        break;
      
      default:
        sectionContent = null;
    }

    return (
      <div className="mb-8">
        {section.title && (
          <h3 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
            {section.title}
          </h3>
        )}
        {sectionContent}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-zinc-600 dark:text-zinc-400">Memuat post...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/blog">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Blog
          </Button>
        </Link>

        <Card>
          <CardHeader>
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
            <CardTitle className="text-3xl md:text-4xl">{post.title}</CardTitle>
            {post.excerpt && (
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mt-2">
                {post.excerpt}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              {post.sections && post.sections.length > 0 ? (
                post.sections
                  .sort((a, b) => a.order - b.order)
                  .map((section) => (
                    <div key={section.id}>
                      {renderSection(section)}
                    </div>
                  ))
              ) : (
                <p className="text-zinc-500 italic">No content available.</p>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
              <Link href={`/blog/${post.slug}/edit`} className="flex-1">
                <Button className="w-full gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Post
                </Button>
              </Link>
              <Button
                variant="destructive"
                className="gap-2"
                onClick={handleDeleteClick}
                disabled={deleting}
              >
                <Trash2 className="h-4 w-4" />
                {deleting ? "Menghapus..." : "Hapus"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Post?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus post ini? Tindakan ini tidak dapat dibatalkan dan akan menghapus post secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
