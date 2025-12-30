import { auth } from "@/auth";
import ClickBait from "@/components/click";
import SignIn from "@/components/sign-in";
import { SignOut } from "@/components/sign-out";
import { prisma } from "@/lib/prisma";
import Image from "next/image";


export default async function Home() {
  const session = await auth()
  const books = await prisma.book.findMany({
    include: {
      authors: {
        include: {
          author: true
        }
      }
    }
  });

  return (
    <div className="flex flex-col min-h-screen">
      <header className="min-h-full bg-blue-900">
        {session?.user ? <SignOut /> : <SignIn/>}
      </header>
      <div className="flex grow flex-row min-h-full">
        <nav className="w-40 bg-blue-200 text-black">
          Hello {session?.user?.name}
        </nav>
        <main className="bg-stone-100 grow text-black">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-5">
          {books.map((book) => (
            <div key={book.id} className="flex-1 bg-neutral-50 rounded-xs shadow-sm p-5 aspect-[2/3] max-h-80 transition-transform hover:scale-102 duration-150">
              <div className="flex justify-center">
              <Image src="/no-cover.png" height={130} width={80} alt={`Cover image of ${book.title}`}/>
              </div>
              <h2 className="text-sm font-sans font-semibold">{book.title}</h2>
              <h5 className="text-xs font-sans font-light">{book.authors[0].author.name}</h5>
            </div>
          ))}
          </div>
          <ClickBait></ClickBait>
        </main>
      </div>
        <footer className="bg-blue-900">footer</footer>
    </div>
  );
}
