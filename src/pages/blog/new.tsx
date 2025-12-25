import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Plus, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";

interface Section {
  id?: number;
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

export default function NewBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    author: "",
  });
  const [sections, setSections] = useState<Section[]>([
    { type: 'text', content: '', order: 0 }
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSectionChange = (index: number, field: keyof Section, value: string | Section['type'] | Section['metadata']) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };
    setSections(updated);
  };

  const addSection = (type: Section['type'] = 'text') => {
    setSections([...sections, { type, title: '', content: '', order: sections.length }]);
    const typeNames: Record<Section['type'], string> = {
      text: 'Text',
      html: 'HTML',
      code: 'Code',
      image: 'Image',
      video: 'Video',
    };
    toast.success(`Section ${typeNames[type]} ditambahkan`, {
      description: `Section ${typeNames[type]} berhasil ditambahkan ke post.`,
    });
  };

  const removeSection = (index: number) => {
    const updated = sections.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i }));
    setSections(updated);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const updated = [...sections];
    if (direction === 'up' && index > 0) {
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      updated[index - 1].order = index - 1;
      updated[index].order = index;
    } else if (direction === 'down' && index < updated.length - 1) {
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      updated[index].order = index;
      updated[index + 1].order = index + 1;
    }
    setSections(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          sections: sections.map((s, i) => ({ ...s, order: i })),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Post berhasil dibuat!", {
          description: "Post Anda telah berhasil disimpan.",
        });
        router.push(`/blog/${result.data.slug}`);
      } else {
        toast.error("Gagal membuat post", {
          description: result.error || "Terjadi kesalahan saat membuat post.",
        });
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Gagal membuat post", {
        description: "Terjadi kesalahan saat membuat post. Silakan coba lagi.",
      });
    } finally {
      setLoading(false);
    }
  };

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
            <CardTitle className="text-2xl">Buat Post Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Judul *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Masukkan judul post"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Ringkasan</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Ringkasan singkat tentang post ini (opsional)"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Penulis</Label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Nama penulis (opsional)"
                />
              </div>

              {/* Sections */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Sections</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addSection('text')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Text
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addSection('html')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      HTML
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addSection('code')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Code
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addSection('image')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Image
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addSection('video')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Video
                    </Button>
                  </div>
                </div>

                {sections.map((section, index) => (
                  <Card key={index} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-5 w-5 text-zinc-400" />
                          <CardTitle className="text-lg capitalize">{section.type}</CardTitle>
                          <span className="text-sm text-zinc-500">#{index + 1}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={section.type}
                            onChange={(e) => handleSectionChange(index, 'type', e.target.value)}
                            className="rounded-md border border-input bg-background px-3 py-1 text-sm"
                          >
                            <option value="text">Text</option>
                            <option value="html">HTML</option>
                            <option value="code">Code</option>
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                          </select>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => moveSection(index, 'up')}
                            disabled={index === 0}
                          >
                            ↑
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => moveSection(index, 'down')}
                            disabled={index === sections.length - 1}
                          >
                            ↓
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSection(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Title (Opsional)</Label>
                        <Input
                          value={section.title || ''}
                          onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                          placeholder="Judul section (opsional)"
                        />
                      </div>
                      {section.type === 'image' && (
                        <div className="space-y-2">
                          <Label>Image URL</Label>
                          <Input
                            value={section.content}
                            onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                            placeholder="https://example.com/image.jpg"
                          />
                          <Input
                            value={section.metadata?.alt || ''}
                            onChange={(e) => handleSectionChange(index, 'metadata', { ...section.metadata, alt: e.target.value })}
                            placeholder="Alt text (optional)"
                          />
                        </div>
                      )}
                      {section.type === 'video' && (
                        <div className="space-y-2">
                          <Label>Video URL (YouTube, Vimeo, etc)</Label>
                          <Input
                            value={section.content}
                            onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                            placeholder="https://youtube.com/watch?v=..."
                          />
                        </div>
                      )}
                      {(section.type === 'text' || section.type === 'html' || section.type === 'code') && (
                        <div className="space-y-2">
                          <Label>Content {section.type === 'code' && '(Language in metadata)'}</Label>
                          <Textarea
                            value={section.content}
                            onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                            placeholder={section.type === 'code' ? 'console.log("Hello World");' : 'Tulis konten di sini'}
                            rows={section.type === 'code' ? 10 : 8}
                          />
                          {section.type === 'code' && (
                            <Input
                              value={section.metadata?.language || ''}
                              onChange={(e) => handleSectionChange(index, 'metadata', { ...section.metadata, language: e.target.value })}
                              placeholder="Language (e.g., javascript, python, html)"
                            />
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-2 justify-end">
                <Link href="/blog">
                  <Button type="button" variant="outline">
                    Batal
                  </Button>
                </Link>
                <Button type="submit" disabled={loading} className="gap-2">
                  <Save className="h-4 w-4" />
                  {loading ? "Menyimpan..." : "Simpan Post"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
