import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { posts, sections } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

type Data = {
  message?: string;
  data?: any;
  error?: string;
};

// GET post by slug
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    try {
      const { slug } = req.query;

      const post = await db
        .select()
        .from(posts)
        .where(eq(posts.slug, slug as string))
        .limit(1);

      if (post.length === 0) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Get sections
      const postSections = await db
        .select()
        .from(sections)
        .where(eq(sections.postId, post[0].id))
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

  return res.status(405).json({ error: "Method not allowed" });
}

