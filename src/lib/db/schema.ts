import { pgTable, serial, text, varchar, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const sectionTypeEnum = pgEnum('section_type', ['text', 'html', 'code', 'image', 'video']);

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  excerpt: text('excerpt'),
  author: varchar('author', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sections = pgTable('sections', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  type: sectionTypeEnum('type').notNull(),
  title: varchar('title', { length: 255 }), // Optional title for section
  content: text('content').notNull(),
  metadata: text('metadata'), // JSON string for additional data (caption, language, alt text, etc)
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const postsRelations = relations(posts, ({ many }) => ({
  sections: many(sections),
}));

export const sectionsRelations = relations(sections, ({ one }) => ({
  post: one(posts, {
    fields: [sections.postId],
    references: [posts.id],
  }),
}));

