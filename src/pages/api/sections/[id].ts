import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { sections } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type Data = {
  message?: string;
  data?: any;
  error?: string;
};

// GET, PUT, DELETE section
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const section = await db
        .select()
        .from(sections)
        .where(eq(sections.id, Number(id)))
        .limit(1);

      if (section.length === 0) {
        return res.status(404).json({ error: "Section not found" });
      }

      return res.status(200).json({
        data: {
          ...section[0],
          metadata: section[0].metadata ? JSON.parse(section[0].metadata) : null,
        },
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "PUT") {
    try {
      const { type, content, metadata, order } = req.body;

      if (!type || !content) {
        return res.status(400).json({ error: "Type and content are required" });
      }

      const updatedSection = await db
        .update(sections)
        .set({
          type,
          content,
          metadata: metadata ? JSON.stringify(metadata) : null,
          order: order !== undefined ? order : 0,
          updatedAt: new Date(),
        })
        .where(eq(sections.id, Number(id)))
        .returning();

      if (updatedSection.length === 0) {
        return res.status(404).json({ error: "Section not found" });
      }

      return res.status(200).json({
        data: {
          ...updatedSection[0],
          metadata: updatedSection[0].metadata ? JSON.parse(updatedSection[0].metadata) : null,
        },
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      const deletedSection = await db
        .delete(sections)
        .where(eq(sections.id, Number(id)))
        .returning();

      if (deletedSection.length === 0) {
        return res.status(404).json({ error: "Section not found" });
      }

      return res.status(200).json({ message: "Section deleted successfully" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

