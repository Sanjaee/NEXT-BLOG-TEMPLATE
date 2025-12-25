import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  BookOpen, 
  Edit, 
  Zap, 
  Database, 
  Code, 
  Sparkles
} from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const features = [
  {
    icon: BookOpen,
    title: "Blog Management",
    description: "Kelola blog Anda dengan mudah. Buat, edit, dan hapus posts dengan interface yang intuitif.",
  },
  {
    icon: Database,
    title: "Drizzle ORM",
    description: "Type-safe database queries dengan Drizzle ORM. Mendukung PostgreSQL dengan schema management yang powerful.",
  },
  {
    icon: Code,
    title: "Modern Stack",
    description: "Dibangun dengan Next.js 16, TypeScript, dan shadcn/ui untuk pengalaman development yang maksimal.",
  },
  {
    icon: Zap,
    title: "Fast & Responsive",
    description: "Aplikasi cepat dan responsif dengan optimasi untuk performa terbaik di semua perangkat.",
  },
];

const techStack = [
  "Next.js 16",
  "TypeScript",
  "Drizzle ORM",
  "PostgreSQL",
  "shadcn/ui",
  "Tailwind CSS",
];

export default function Home() {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-black dark:via-zinc-950 dark:to-black`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div 
          className="absolute inset-0 -z-10 opacity-[0.04] dark:opacity-[0.03]" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='currentColor'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
            backgroundSize: "20px 20px"
          }} 
        />
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Modern Blog Platform</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-black dark:text-white sm:text-6xl lg:text-7xl">
              Buat Blog Anda dengan{" "}
              <span className="bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-white dark:to-zinc-400">
                Mudah
              </span>
            </h1>
            <p className="mb-10 text-xl leading-8 text-zinc-600 dark:text-zinc-400 sm:text-2xl">
              Platform blog modern dengan CRUD lengkap menggunakan Next.js, Drizzle ORM, dan shadcn/ui. 
              Cepat, aman, dan mudah digunakan.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/blog">
                <Button size="lg" className="group gap-2 text-lg">
                  Jelajahi Blog
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/blog/new">
                <Button size="lg" variant="outline" className="text-lg">
                  Buat Post Baru
                  <Edit className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-6 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Powered by
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {techStack.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="px-4 py-2 text-sm font-medium"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
              Fitur Unggulan
            </h2>
            <p className="mb-12 text-lg text-zinc-600 dark:text-zinc-400">
              Semua yang Anda butuhkan untuk membuat dan mengelola blog profesional
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="group border-zinc-200 transition-all hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:hover:border-zinc-700"
                >
                  <CardHeader>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Card className="border-zinc-200 bg-gradient-to-br from-zinc-50 to-white dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
            <CardHeader className="text-center">
              <CardTitle className="mb-4 text-3xl font-bold sm:text-4xl">
                Siap Memulai?
              </CardTitle>
              <CardDescription className="text-lg">
                Mulai membuat konten blog Anda sekarang. Gratis dan mudah digunakan.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/blog/new" className="w-full sm:w-auto">
                <Button size="lg" className="w-full gap-2 text-lg">
                  Buat Post Pertama
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/blog" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full text-lg">
                  Lihat Semua Posts
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 px-4 py-12 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-zinc-600 dark:text-zinc-400">
            Dibuat dengan ❤️ menggunakan Next.js, Drizzle ORM, dan shadcn/ui
          </p>
        </div>
      </footer>
    </div>
  );
}
