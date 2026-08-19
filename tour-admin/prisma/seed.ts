import { PrismaClient, UserStatus } from '@prisma/client';
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

  const hashedPassword = await bcrypt.hash('1qwerty', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@admin.pl' },
    update: {
      password: hashedPassword,
      name: 'Łukasz',
      status: UserStatus.ADMIN,
    },
    create: {
      email: 'admin@admin.pl',
      password: hashedPassword,
      name: 'Łukasz',
      status: UserStatus.ADMIN,
    },
  });

  console.log(`Stworzono konto administratora: ${adminUser.email}`);

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
  await prisma.product.create({
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
  await prisma.product.create({
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
  await prisma.product.create({
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
  await prisma.product.create({
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
