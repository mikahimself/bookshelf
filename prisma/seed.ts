// prisma/seed.ts
import { BookStatus, BookFormat } from '@prisma/client';
import { prisma } from '@/lib/prisma';

const userId = process.env.SEED_USER

async function main() {
  // --- Authors ---
  const douglasAdams = await prisma.author.upsert({
    where: { name: 'Douglas Adams' },
    update: {},
    create: { name: 'Douglas Adams' },
  });

  const edouardLouis = await prisma.author.upsert({
    where: { name: 'Édouad Louis' },
    update: {},
    create: { name: 'Édouad Louis' },
  });

  const turpeinen = await prisma.author.upsert({
    where: { name: "Iida Turpeinen"},
    update: {},
    create: {
      name: "Iida Turpeinen"
    }
  })

  // --- Genres ---
  const fiction = await prisma.genre.upsert({
    where: { name: 'Fiction' },
    update: {},
    create: { name: 'Fiction' },
  });
  
  const autoFiction = await prisma.genre.upsert({
    where: { name: 'Autofiction' },
    update: {},
    create: { name: 'Autofiction' },
  });

  const scifi = await prisma.genre.upsert({
    where: { name: 'Science Fiction' },
    update: {},
    create: { name: 'Science Fiction' },
  });
  
  const humour = await prisma.genre.upsert({
    where: { name: 'Humour' },
    update: {},
    create: { name: 'humour' },
  });

  // --- Publishers ---
  const tammi = await prisma.publisher.upsert({
    where: { name: 'Tammi' },
    update: {},
    create: { name: 'Tammi' },
  });

  const panBooks = await prisma.publisher.upsert({
    where: { name: 'Pan Books' },
    update: {},
    create: { name: 'Pan Books' },
  });

  // --- Series ---
  const hitchhiker = await prisma.series.upsert({
    where: { name: "The Hitchhiker's Guide to the Galaxy" },
    update: {},
    create: {
      name: "The Hitchhiker's Guide to the Galaxy",
      description: 'Comic fantasy series set on a flat world carried by four elephants on a giant turtle.',
    },
  });

  // --- Books ---
  const hitchhikerBook = await prisma.book.upsert({
    where: { isbn: '0330258648' },
    update: {},
    create: {
      title: "The Hitchhiker's Guide to the Galaxy",
      isbn: '0330258648',
      releaseYear: 1979,
      description: "Comic science fiction novel about Arthur Dent, whose home and then planet are demolished, leading him to hitchhike across the galaxy with his friend Ford Prefect and a cast of deeply unhelpful beings.",
      publisher: { connect: { id: panBooks.id } },
      series: { connect: { id: hitchhiker.id } },
      seriesIndex: 1,
      authors: {
        create: [
          {
            author: { connect: { id: douglasAdams.id } },
            sortOrder: 0,
          },
        ],
      },
      genres: {
        create: [
          {
            genre: { connect: { id: scifi.id } },
          },
          {
            genre: { connect: { id: humour.id } },
          },
        ],
      },
    },
  });

  const eiEnaaEddy = await prisma.book.upsert({
    where: { isbn: '9789520408053' },
    update: {},
    create: {
      title: 'Ei enää Eddy',
      originalTitle: "En finir avec Eddy Bellegueule",
      isbn: '9789520408053',
      releaseYear: 2019,

      description: "Semi-autobiographical novel about Eddy Bellegueule growing up gay and poor in a violent, working-class village in northern France, depicting poverty, masculinity, shame and escape.",
      publisher: { connect: { id: tammi.id } },
      authors: {
        create: [
          {
            author: { connect: { id: edouardLouis.id } },
            sortOrder: 0,
          },
        ],
      },
      genres: {
        create: [
          {
            genre: { connect: { id: fiction.id } },
          },
          {
            genre: { connect: { id: autoFiction.id }}
          }
        ],
      },
    },
  });

  const elolliset = await prisma.book.create({
    data: {
      title: "Elolliset",
      authors: {
        create: [
          {
            author: { connect: { id: turpeinen.id }},
            sortOrder: 0
          }
        ]
      }
    }  
    }
)
  


  await prisma.userBook.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {
      userId: userId!,
      bookId: hitchhiker.id,
      status: BookStatus.OWNED,
      rating: 5
    }
  })

  await prisma.userBook.upsert({
    where: {
      id: 2,
    },
    update: {},
    create: {
      userId: userId!,
      bookId: eiEnaaEddy.id,
      status: BookStatus.OWNED,
      rating: 5
    }
  })

  await prisma.userBook.upsert({
    where: {
      id: 3,
    },
    update: {},
    create: {
      userId: userId!,
      bookId: elolliset.id,
      status: BookStatus.WANTED,
    }
  })


  // --- Copies (physical books you own) ---
  await prisma.copy.upsert({
    where: { id: 1 }, // arbitrary; upsert makes it safe to re-run
    update: {},
    create: {
      bookId: hitchhikerBook.id,
      format: BookFormat.PAPERBACK,
      location: 'Tampere',
      ownerId: userId!
    },
  });

  await prisma.copy.upsert({
    where: { id: 2,  },
    update: {},
    create: {
      bookId: eiEnaaEddy.id,
      format: BookFormat.HARDCOVER,
      label: 'First edition',
      location: 'Tampere',
      ownerId: userId!
    },
  });

  // --- Example wishlist + items ---
  const myWishlist = await prisma.wishlist.upsert({
    where: { ownerId_name: { ownerId: userId!, name: "Toivelista"} },
    update: {},
    create: {
      name: 'My wishlist',
      description: 'Books I want to buy for myself.',
      ownerId: userId!
    },
  });

  

  await prisma.wishlistItem.upsert({
    where: {
      wishlistId_bookId: {
        wishlistId: myWishlist.id,
        bookId: elolliset.id,
      },
    },
    update: {},
    create: {
      wishlistId: myWishlist.id,
      bookId: elolliset.id,
      priority: 5,
      notes: 'Would also be a good gift edition.',
    },
  });

  console.log('Seed completed');
}

if (userId === undefined) {
  console.error("No user ID provided through process.env.SEED_USER");
} else {
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

}
