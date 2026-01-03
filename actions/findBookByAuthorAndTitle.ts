"use server"

import { gBooksApiResponseSchema, GoogleBookSearchItem } from "@/lib/validations"

type findBookByFilledInfoProps = {
  title?: string,
  author?: string,
  isbn?: string
}

export async function findBookByAuthorAndTitle({ title, author, isbn}: findBookByFilledInfoProps): Promise<GoogleBookSearchItem[]> {
  try {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const q = encodeURIComponent(`${author}${title ? `+intitle:${title}` : ""}${isbn ? `+isbn:${isbn}` : ""}`)
    const url = `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=10&key=${apiKey}`
    console.log(url)

    const response = await fetch(url)
    if (!response.ok) return [];

    const rawData = await response.json()
    const parsed = gBooksApiResponseSchema.safeParse(rawData)

    if (!parsed.success) {
      console.error("Google API Schema Mismatch", parsed.error);
      return [];
    }

    if (!parsed.data.items) return []

    const books = parsed.data.items.map((item) => {
      const volume = item.volumeInfo;

      const isbn = volume.industryIdentifiers?.find(i => i.type === "ISBN_13")?.identifier || volume.industryIdentifiers?.find(i => i.type === "ISBN_10")?.identifier;
      const coverUrl = volume.imageLinks?.thumbnail?.replace(/^http:\/\//i, "https://");

      return {
        id: item.etag,
        googleBookId: item.id,
        title: volume.title || "Tuntematon",
        authors: volume.authors,
        description: volume.description,
        publisher: volume.publisher,
        publishedDate: volume.publishedDate,
        pageCount: volume.pageCount,
        categories: volume.categories,
        coverUrl: coverUrl || "/no-cover.png",
        isbn
      }
    })
  
  const uniqueBooks = new Map(books.map((book) => [book.googleBookId, book])).values().toArray()

  return uniqueBooks;

  } catch (error) {
    console.error("Search failed:", error);
    return []
  }

}