import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { posts, sections } from "@/lib/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { generateSlug } from "@/lib/utils/slug";

type Data = {
  message?: string;
  data?: any;
  error?: string;
};

// GET all posts (without sections for list view)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    try {
      const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));
      return res.status(200).json({ data: allPosts });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "POST") {
    try {
      const { title, excerpt, author, sections: sectionsData } = req.body;

      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      // Generate slug from title
      const baseSlug = generateSlug(title);

      // Check if slug exists, if yes append number
      let slug = baseSlug;
      let counter = 1;
      const existingPosts = await db
        .select()
        .from(posts)
        .where(eq(posts.slug, slug));

      if (existingPosts.length > 0) {
        slug = `${baseSlug}-${counter}`;
        const checkSlug = await db
          .select()
          .from(posts)
          .where(eq(posts.slug, slug));
        while (checkSlug.length > 0) {
          counter++;
          slug = `${baseSlug}-${counter}`;
          const recheck = await db
            .select()
            .from(posts)
            .where(eq(posts.slug, slug));
          if (recheck.length === 0) break;
        }
      }

      // Create post
      const newPost = await db
        .insert(posts)
        .values({
          title,
          slug,
          excerpt: excerpt || null,
          author: author || null,
        })
        .returning();

      // Create sections if provided
      if (sectionsData && Array.isArray(sectionsData) && sectionsData.length > 0) {
        const sectionsToInsert = sectionsData.map((section: any, index: number) => ({
          postId: newPost[0].id,
          type: section.type,
          title: section.title || null,
          content: section.content,
          metadata: section.metadata ? JSON.stringify(section.metadata) : null,
          order: section.order !== undefined ? section.order : index,
        }));

        await db.insert(sections).values(sectionsToInsert);
      }

      // Fetch post with sections
      const postWithSections = await db
        .select()
        .from(posts)
        .where(eq(posts.id, newPost[0].id))
        .limit(1);

      const postSections = await db
        .select()
        .from(sections)
        .where(eq(sections.postId, newPost[0].id))
        .orderBy(asc(sections.order));

      return res.status(201).json({
        data: {
          ...postWithSections[0],
          sections: postSections.map((s) => ({
            ...s,
            metadata: s.metadata ? JSON.parse(s.metadata) : null,
          })),
        },
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

