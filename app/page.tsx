import { prisma } from "@/lib/prisma";
import Image from "next/image";

export default async function Home() {
  const books = await prisma.book.findMany({
    include: {
      authors: {
        include: {
          author: true,
        },
      },
    },
  });

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {books.map((book) => (
          <div
            key={book.id}
            className="aspect-[2/3] max-h-80 flex-1 rounded-xs bg-neutral-50 p-5 shadow-sm transition-transform duration-150 hover:scale-102"
          >
            <div className="flex justify-center">
              <Image
                src="/no-cover.png"
                height={130}
                width={80}
                alt={`Cover image of ${book.title}`}
              />
            </div>
            <h2 className="font-sans text-sm font-semibold">{book.title}</h2>
            <h5 className="font-sans text-xs font-light">
              {book.authors[0].author.name}
            </h5>
          </div>
        ))}
      </div>
    </div>
  );
}
