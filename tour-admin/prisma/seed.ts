import { PrismaClient, UserStatus, OrderStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Rozpoczynanie zasilania bazy danych (seeding)...');

  // 1. Czyszczenie starych danych (zachowanie kolejności ze względu na klucze obce)
  await prisma.routePoint.deleteMany();
  await prisma.plannerItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('1qwerty', 10);

  // Tworzenie konta administratora
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@admin.pl' },
    update: {
      password: hashedPassword,
      name: 'Łukasz Admin',
      status: UserStatus.ADMIN,
    },
    create: {
      email: 'admin@admin.pl',
      password: hashedPassword,
      name: 'Łukasz Admin',
      status: UserStatus.ADMIN,
    },
  });

  // Tworzenie standardowych użytkowników do zamówień
  const userJan = await prisma.user.create({
    data: {
      email: 'jan.kowalski@example.com',
      password: hashedPassword,
      name: 'Jan Kowalski',
      status: UserStatus.USER,
    },
  });

  const userAnna = await prisma.user.create({
    data: {
      email: 'anna.nowak@example.com',
      password: hashedPassword,
      name: 'Anna Nowak',
      status: UserStatus.USER,
    },
  });

  const userPiotr = await prisma.user.create({
    data: {
      email: 'piotr.wisniewski@example.com',
      password: hashedPassword,
      name: 'Piotr Wiśniewski',
      status: UserStatus.USER,
    },
  });

  console.log(`Stworzono konto administratora: ${adminUser.email}`);
  console.log('Stworzono konta testowych użytkowników.');

  // 2. Tworzenie Kategorii
  const catWestCoast = await prisma.category.create({
    data: {
      name: 'Zachodnie Wybrzeże & Parki Narodowe',
      description:
        'Klasyczne trasy przez Amerykę Zachodnią, parki narodowe i tętniące życiem metropolie.',
    },
  });

  const catEastCoast = await prisma.category.create({
    data: {
      name: 'Wschodnie Wybrzeże & Kultura',
      description:
        'Zabytki historii, wieżowce Nowego Jorku i słoneczna Floryda.',
    },
  });

  const catNature = await prisma.category.create({
    data: {
      name: 'Dzika Przyroda & Alaska',
      description:
        'Wyprawy dla miłośników natury, lodowców i surowego krajobrazu.',
    },
  });

  // 3. Tworzenie Produktów (Wycieczek) wraz z Punktami Trasy (RoutePoints)

  // PRODUKT 1: Wielki Kanion i Parki Narodowe USA
  const prod1 = await prisma.product.create({
    data: {
      name: 'Wielki Kanion i Dziki Zachód',
      slug: 'wielki-kanion-i-dziki-zachod',
      description:
        'Odkryj najpiękniejsze cuda natury Zachodniego Wybrzeża USA. Przejazd historyczną Route 66, zachód słońca nad Wielkim Kanionem, surrealistyczne skały w Parku Narodowym Bryce Canyon oraz unikalny widok na Horseshoe Bend. Wyprawa obejmuje opiekę polskiego przewodnika i zakwaterowanie w klimatycznych motelach.',
      price: 12999.0,
      imageUrl:
        'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=1200&q=80',
      location: 'Arizona & Utah, USA',
      latitude: 36.1069,
      longitude: -112.1129,
      categoryId: catWestCoast.id,
      routePoints: {
        create: [
          {
            stopOrder: 1,
            title: 'Las Vegas - Start wyprawy',
            latitude: 36.1699,
            longitude: -115.1398,
          },
          {
            stopOrder: 2,
            title: 'Zapora Hoovera',
            latitude: 36.0161,
            longitude: -114.7377,
          },
          {
            stopOrder: 3,
            title: 'Wielki Kanion (South Rim)',
            latitude: 36.1069,
            longitude: -112.1129,
          },
          {
            stopOrder: 4,
            title: 'Horseshoe Bend & Page',
            latitude: 36.879,
            longitude: -111.5105,
          },
          {
            stopOrder: 5,
            title: 'Bryce Canyon National Park',
            latitude: 37.593,
            longitude: -112.1871,
          },
        ],
      },
    },
  });

  // PRODUKT 2: Kalifornia i Pacyfik
  const prod2 = await prisma.product.create({
    data: {
      name: 'Słoneczna Kalifornia i Pacific Coast Highway',
      slug: 'sloneczna-kalifornia-i-pacific-coast-highway',
      description:
        'Niezapomniana podróż wzdłuż malowniczego wybrzeża Pacyfiku. Od ikonicznego mostu Golden Gate w San Francisco, przez urokliwe Carmel-by-the-Sea i klify Big Sur, aż po tętniące życiem Los Angeles i plaże Santa Monica.',
      price: 14500.0,
      imageUrl:
        'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=1200&q=80',
      location: 'Kalifornia, USA',
      latitude: 37.7749,
      longitude: -122.4194,
      categoryId: catWestCoast.id,
      routePoints: {
        create: [
          {
            stopOrder: 1,
            title: 'San Francisco & Golden Gate',
            latitude: 37.7749,
            longitude: -122.4194,
          },
          {
            stopOrder: 2,
            title: 'Monterey & 17-Mile Drive',
            latitude: 36.6002,
            longitude: -121.8947,
          },
          {
            stopOrder: 3,
            title: 'Big Sur Highway',
            latitude: 36.2704,
            longitude: -121.8081,
          },
          {
            stopOrder: 4,
            title: 'Santa Barbara',
            latitude: 34.4208,
            longitude: -119.6982,
          },
          {
            stopOrder: 5,
            title: 'Los Angeles & Santa Monica',
            latitude: 34.0522,
            longitude: -118.2437,
          },
        ],
      },
    },
  });

  // PRODUKT 3: Nowy Jork i Wschodnie Wybrzeże
  const prod3 = await prisma.product.create({
    data: {
      name: 'Nowy Jork i Metropolie Wschodniego Wybrzeża',
      slug: 'nowy-jork-i-metropolie-wschodniego-wybrzeza',
      description:
        'Poczuj rytm największych amerykańskich miast. Zwiedzanie Nowego Jorku (Manhattan, Central Park, Statua Wolności), historycznej Filadelfii oraz stolicy kraju - Waszyngtonu z Białym Domem i Kapitolem.',
      price: 11200.0,
      imageUrl:
        'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
      location: 'New York, Pennsylvania & DC, USA',
      latitude: 40.7128,
      longitude: -74.006,
      categoryId: catEastCoast.id,
      routePoints: {
        create: [
          {
            stopOrder: 1,
            title: 'Nowy Jork - Times Square & Central Park',
            latitude: 40.7128,
            longitude: -74.006,
          },
          {
            stopOrder: 2,
            title: 'Filadelfia - Dzwon Wolności',
            latitude: 39.9526,
            longitude: -75.1652,
          },
          {
            stopOrder: 3,
            title: 'Waszyngton - Kapitol i Biały Dom',
            latitude: 38.9072,
            longitude: -77.0369,
          },
        ],
      },
    },
  });

  // PRODUKT 4: Alaska i Dzika Przyroda
  const prod4 = await prisma.product.create({
    data: {
      name: 'Dzika Alaska - Kraina Lodowców i Niedźwiedzi',
      slug: 'dzika-alaska-kraina-lodowcow-i-niedzwiedzi',
      description:
        'Przygoda życia na północy kontynentu. Rejs wokół lodowców w Parku Narodowym Kenai Fjords, obserwacja niedźwiedzi brunatnych w Denali oraz podróż widokową koleją Alaskan Railroad.',
      price: 18900.0,
      imageUrl:
        'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80',
      location: 'Alaska, USA',
      latitude: 61.2181,
      longitude: -149.9003,
      categoryId: catNature.id,
      routePoints: {
        create: [
          {
            stopOrder: 1,
            title: 'Anchorage',
            latitude: 61.2181,
            longitude: -149.9003,
          },
          {
            stopOrder: 2,
            title: 'Park Narodowy Kenai Fjords',
            latitude: 59.9252,
            longitude: -149.65,
          },
          {
            stopOrder: 3,
            title: 'Park Narodowy Denali',
            latitude: 63.1148,
            longitude: -151.1926,
          },
        ],
      },
    },
  });

  // PRODUKT 5 (NOWY): Yellowstone i Góry Skaliste (Kategoria: Dzika Przyroda)
  const prod5 = await prisma.product.create({
    data: {
      name: 'Magia Yellowstone i Kanadyjskich Gór Skalistych',
      slug: 'magia-yellowstone-i-gory-skaliste',
      description:
        'Wyprawa śladami gejzerów, gorących źródeł oraz dzikiej zwierzyny. Zwiedzanie pierwszego na świecie Parku Narodowego Yellowstone, spektakularnych szczytów Grand Teton oraz przejazd przez malownicze drogi Wyoming.',
      price: 16800.0,
      imageUrl:
        'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
      location: 'Wyoming & Montana, USA',
      latitude: 44.428,
      longitude: -110.5885,
      categoryId: catNature.id,
      routePoints: {
        create: [
          {
            stopOrder: 1,
            title: 'Jackson Hole & Grand Teton',
            latitude: 43.4799,
            longitude: -110.7624,
          },
          {
            stopOrder: 2,
            title: 'Gejzer Old Faithful (Yellowstone)',
            latitude: 44.4605,
            longitude: -110.8281,
          },
          {
            stopOrder: 3,
            title: 'Grand Prismatic Spring',
            latitude: 44.525,
            longitude: -110.8381,
          },
        ],
      },
    },
  });

  // PRODUKT 6 (NOWY): Floryda i Ocean Atlantycki (Kategoria: Wschodnie Wybrzeże)
  const prod6 = await prisma.product.create({
    data: {
      name: 'Słoneczna Floryda & Key West Roadtrip',
      slug: 'sloneczna-floryda-and-key-west-roadtrip',
      description:
        "Połączenie wypoczynku i ekscytującego roadtripu. Od kosmicznego Centrum Keneddy'ego na Cape Canaveral, przez tętniące życiem Miami South Beach, bagna Everglades pełne aligatorów, aż po słynny drogowy most Overseas Highway prowadzący na Key West.",
      price: 13400.0,
      imageUrl:
        'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&w=1200&q=80',
      location: 'Floryda, USA',
      latitude: 25.7617,
      longitude: -80.1918,
      categoryId: catEastCoast.id,
      routePoints: {
        create: [
          {
            stopOrder: 1,
            title: 'Miami Beach & Ocean Drive',
            latitude: 25.7826,
            longitude: -80.134,
          },
          {
            stopOrder: 2,
            title: 'Park Narodowy Everglades',
            latitude: 25.2866,
            longitude: -80.8987,
          },
          {
            stopOrder: 3,
            title: 'Key West - Najdalej na południe wysunięty punkt USA',
            latitude: 24.5551,
            longitude: -81.78,
          },
        ],
      },
    },
  });

  // PRODUKT 7 (NOWY): Route 66 i Droga do Kalifornii (Kategoria: Zachodnie Wybrzeże)
  const prod7 = await prisma.product.create({
    data: {
      name: 'Legenda Route 66 - Od Chicago do Los Angeles',
      slug: 'legenda-route-66-od-chicago-do-los-angeles',
      description:
        'Mityczna Droga-Matka. Ponad 3900 km przez serce Ameryki. Stare stacje benzynowe, neony, klasyczne dinary i niepowtarzalny klimat minionej epoki motorowej Ameryki.',
      price: 17500.0,
      imageUrl:
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
      location: 'Illinois do Kalifornia, USA',
      latitude: 41.8781,
      longitude: -87.6298,
      categoryId: catWestCoast.id,
      routePoints: {
        create: [
          {
            stopOrder: 1,
            title: 'Chicago - Punkt początkowy',
            latitude: 41.8781,
            longitude: -87.6298,
          },
          {
            stopOrder: 2,
            title: 'St. Louis & Gateway Arch',
            latitude: 38.627,
            longitude: -90.1994,
          },
          {
            stopOrder: 3,
            title: 'Cadillac Ranch (Amarillo)',
            latitude: 35.1872,
            longitude: -101.987,
          },
          {
            stopOrder: 4,
            title: 'Santa Monica Pier - Koniec Route 66',
            latitude: 34.01,
            longitude: -118.496,
          },
        ],
      },
    },
  });

  console.log('Stworzono wycieczki i punkty tras.');

  // 4. Tworzenie Zamówień (Order) oraz Pozycji Zamówienia (OrderItem)

  const ordersData = [
    {
      userId: userJan.id,
      customerName: 'Jan Kowalski',
      customerEmail: 'jan.kowalski@example.com',
      customerPhone: 601234567,
      status: OrderStatus.PAID,
      totalAmount: 25998.0,
      createdAt: new Date('2026-01-15T10:30:00Z'),
      items: [{ productId: prod1.id, quantity: 2, price: 12999.0 }],
    },
    {
      userId: userAnna.id,
      customerName: 'Anna Nowak',
      customerEmail: 'anna.nowak@example.com',
      customerPhone: 502345678,
      status: OrderStatus.CONFIRMED,
      totalAmount: 14500.0,
      createdAt: new Date('2026-02-01T14:20:00Z'),
      items: [{ productId: prod2.id, quantity: 1, price: 14500.0 }],
    },
    {
      userId: userPiotr.id,
      customerName: 'Piotr Wiśniewski',
      customerEmail: 'piotr.wisniewski@example.com',
      customerPhone: 703456789,
      status: OrderStatus.PENDING,
      totalAmount: 37800.0,
      createdAt: new Date('2026-02-10T09:15:00Z'),
      items: [{ productId: prod4.id, quantity: 2, price: 18900.0 }],
    },
    {
      userId: null, // Gość
      customerName: 'Marek Zieliński',
      customerEmail: 'marek.zielinski@guest.com',
      customerPhone: 699888777,
      status: OrderStatus.PAID,
      totalAmount: 11200.0,
      createdAt: new Date('2026-02-12T16:45:00Z'),
      items: [{ productId: prod3.id, quantity: 1, price: 11200.0 }],
    },
    {
      userId: userJan.id,
      customerName: 'Jan Kowalski',
      customerEmail: 'jan.kowalski@example.com',
      customerPhone: 601234567,
      status: OrderStatus.CANCELLED,
      totalAmount: 16800.0,
      createdAt: new Date('2026-02-14T11:00:00Z'),
      items: [{ productId: prod5.id, quantity: 1, price: 16800.0 }],
    },
    {
      userId: null, // Gość
      customerName: 'Katarzyna Wójcik',
      customerEmail: 'katarzyna.wojcik@test.pl',
      customerPhone: 511222333,
      status: OrderStatus.PAID,
      totalAmount: 26800.0,
      createdAt: new Date('2026-02-18T18:00:00Z'),
      items: [{ productId: prod6.id, quantity: 2, price: 13400.0 }],
    },
    {
      userId: userAnna.id,
      customerName: 'Anna Nowak',
      customerEmail: 'anna.nowak@example.com',
      customerPhone: 502345678,
      status: OrderStatus.PENDING,
      totalAmount: 35000.0,
      createdAt: new Date('2026-02-20T12:30:00Z'),
      items: [{ productId: prod7.id, quantity: 2, price: 17500.0 }],
    },
    {
      userId: userPiotr.id,
      customerName: 'Piotr Wiśniewski',
      customerEmail: 'piotr.wisniewski@example.com',
      customerPhone: 703456789,
      status: OrderStatus.CONFIRMED,
      totalAmount: 24199.0,
      createdAt: new Date('2026-02-22T08:50:00Z'),
      items: [
        { productId: prod1.id, quantity: 1, price: 12999.0 },
        { productId: prod3.id, quantity: 1, price: 11200.0 },
      ],
    },
    {
      userId: null, // Gość
      customerName: 'Tomasz Kamiński',
      customerEmail: 'tomasz.kaminski@domain.com',
      customerPhone: 666555444,
      status: OrderStatus.PAID,
      totalAmount: 18900.0,
      createdAt: new Date('2026-02-24T15:10:00Z'),
      items: [{ productId: prod4.id, quantity: 1, price: 18900.0 }],
    },
    {
      userId: userJan.id,
      customerName: 'Jan Kowalski',
      customerEmail: 'jan.kowalski@example.com',
      customerPhone: 601234567,
      status: OrderStatus.CONFIRMED,
      totalAmount: 14500.0,
      createdAt: new Date('2026-02-25T19:40:00Z'),
      items: [{ productId: prod2.id, quantity: 1, price: 14500.0 }],
    },
    {
      userId: null, // Gość
      customerName: 'Magdalena Lewandowska',
      customerEmail: 'm.lewandowska@gmail.com',
      customerPhone: 788999000,
      status: OrderStatus.CANCELLED,
      totalAmount: 13400.0,
      createdAt: new Date('2026-02-26T13:05:00Z'),
      items: [{ productId: prod6.id, quantity: 1, price: 13400.0 }],
    },
    {
      userId: userAnna.id,
      customerName: 'Anna Nowak',
      customerEmail: 'anna.nowak@example.com',
      customerPhone: 502345678,
      status: OrderStatus.PAID,
      totalAmount: 33600.0,
      createdAt: new Date('2026-02-28T09:00:00Z'),
      items: [{ productId: prod5.id, quantity: 2, price: 16800.0 }],
    },
  ];

  for (const orderData of ordersData) {
    const { items, ...orderInfo } = orderData;
    await prisma.order.create({
      data: {
        ...orderInfo,
        items: {
          create: items,
        },
      },
    });
  }

  console.log(`Stworzono ${ordersData.length} zamówień w bazie danych.`);
  console.log('Seeding zakończony sukcesem!');
}

main()
  .catch((e) => {
    console.error('Błąd podczas wykonywania seeda:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
