import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { posts, sections } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { generateSlug } from "@/lib/utils/slug";

type Data = {
  message?: string;
  data?: any;
  error?: string;
};

// GET single post, PUT, DELETE
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const post = await db
        .select()
        .from(posts)
        .where(eq(posts.id, Number(id)))
        .limit(1);

      if (post.length === 0) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Get sections
      const postSections = await db
        .select()
        .from(sections)
        .where(eq(sections.postId, Number(id)))
        .orderBy(asc(sections.order));

      return res.status(200).json({
        data: {
          ...post[0],
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

  if (req.method === "PUT") {
    try {
      const { title, excerpt, author, sections: sectionsData } = req.body;

      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      // Generate slug from title
      const baseSlug = generateSlug(title);

      // Check if slug exists for other posts
      let slug = baseSlug;
      const existingPost = await db
        .select()
        .from(posts)
        .where(eq(posts.slug, slug))
        .limit(1);

      if (existingPost.length > 0 && existingPost[0].id !== Number(id)) {
        let counter = 1;
        slug = `${baseSlug}-${counter}`;
        const checkSlug = await db
          .select()
          .from(posts)
          .where(eq(posts.slug, slug))
          .limit(1);
        while (checkSlug.length > 0 && checkSlug[0].id !== Number(id)) {
          counter++;
          slug = `${baseSlug}-${counter}`;
          const recheck = await db
            .select()
            .from(posts)
            .where(eq(posts.slug, slug))
            .limit(1);
          if (recheck.length === 0 || recheck[0].id === Number(id)) break;
        }
      }

      // Update post
      const updatedPost = await db
        .update(posts)
        .set({
          title,
          slug,
          excerpt: excerpt || null,
          author: author || null,
          updatedAt: new Date(),
        })
        .where(eq(posts.id, Number(id)))
        .returning();

      if (updatedPost.length === 0) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Delete existing sections and create new ones
      if (sectionsData && Array.isArray(sectionsData)) {
        await db.delete(sections).where(eq(sections.postId, Number(id)));

        if (sectionsData.length > 0) {
          const sectionsToInsert = sectionsData.map((section: any) => ({
            postId: Number(id),
            type: section.type,
            title: section.title || null,
            content: section.content,
            metadata: section.metadata ? JSON.stringify(section.metadata) : null,
            order: section.order !== undefined ? section.order : 0,
          }));

          await db.insert(sections).values(sectionsToInsert);
        }
      }

      // Fetch updated post with sections
      const postSections = await db
        .select()
        .from(sections)
        .where(eq(sections.postId, Number(id)))
        .orderBy(asc(sections.order));

      return res.status(200).json({
        data: {
          ...updatedPost[0],
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

  if (req.method === "DELETE") {
    try {
      // Delete sections first (cascade should handle this, but being explicit)
      await db.delete(sections).where(eq(sections.postId, Number(id)));

      const deletedPost = await db
        .delete(posts)
        .where(eq(posts.id, Number(id)))
        .returning();

      if (deletedPost.length === 0) {
        return res.status(404).json({ error: "Post not found" });
      }

      return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

