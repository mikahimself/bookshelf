import { z } from "zod";

const gBookSearchImageLinkSchema = z.object({
  smallThumbnail: z.string().optional(),
  thumbnail: z.string().optional()
});

const gBookSearchIndustryIdSchema = z.array(z.object({
  type: z.string(),
  identifier: z.string()
}));

const volumeInfoSchema = z.object({
  title: z.string(),
  authors: z.array(z.string()).optional().default([]),
  description: z.string().optional(),
  pageCount: z.number().optional(),
  categories: z.array(z.string()).optional(),
  imageLinks: gBookSearchImageLinkSchema.optional(),
  industryIdentifiers: gBookSearchIndustryIdSchema.optional(),
  publishedDate: z.string().optional(),
  publisher: z.string().optional()
});

export const gBookSearchItemSchema = z.object({
  kind: z.string(),
  id: z.string(),
  etag: z.string(),
  selfLink: z.string().optional(),
  volumeInfo: volumeInfoSchema
})

export const gBooksApiResponseSchema = z.object({
  kind: z.string(),
  totalItems: z.number(),
  items: z.array(gBookSearchItemSchema)
})

const gBookSearchResultItem = z.object({
  id: z.string(),
  googleBookId: z.string(),
  title: z.string(),
  authors: z.array(z.string()),
  description: z.string().optional(),
  publisher: z.string().optional(),
  publishedData: z.string().optional(),
  pageCount: z.number().optional(),
  categories: z.array(z.string()).optional(),
  coverUrl: z.string(),
  isbn: z.string().optional()
})


export type GoogleBookSearchResult = z.infer<typeof gBookSearchItemSchema>;
export type GoogleBookSearchItem = z.infer<typeof gBookSearchResultItem>;