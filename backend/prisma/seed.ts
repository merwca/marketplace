import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.report.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const hashedAdminPassword = await bcryptjs.hash("admin123", 10);
  const hashedUserPassword = await bcryptjs.hash("user123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: hashedAdminPassword,
      name: "Admin User",
      role: "ADMIN",
    },
  });

  const user1 = await prisma.user.create({
    data: {
      email: "user1@example.com",
      password: hashedUserPassword,
      name: "Alice Johnson",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "user2@example.com",
      password: hashedUserPassword,
      name: "Bob Smith",
    },
  });

  // Create sample listings
  const listings = [
    {
      title: "Mountain Bike - Good Condition",
      description: "Giant mountain bike, 21-speed, minor scratches but runs great",
      price: "150.00",
      category: "FOR_SALE" as const,
      city: "San Francisco",
      contactEmail: "user1@example.com",
      userId: user1.id,
    },
    {
      title: "1-Bedroom Apartment Downtown",
      description: "Furnished, utilities included, available immediately",
      price: "2500.00",
      category: "HOUSING" as const,
      city: "San Francisco",
      contactEmail: "user1@example.com",
      userId: user1.id,
    },
    {
      title: "iPhone 14 Pro Max",
      description: "256GB, Space Black, AppleCare+, minimal use",
      price: "900.00",
      category: "ELECTRONICS" as const,
      city: "Oakland",
      contactEmail: "user1@example.com",
      userId: user1.id,
    },
    {
      title: "Software Engineer Wanted",
      description: "Looking for experienced Node.js developer, remote OK, competitive salary",
      price: null,
      category: "JOBS" as const,
      city: "San Francisco",
      contactEmail: "user2@example.com",
      userId: user2.id,
    },
    {
      title: "2008 Honda Civic",
      description: "Silver, 120k miles, regular maintenance, reliable",
      price: "5500.00",
      category: "VEHICLES" as const,
      city: "Berkeley",
      contactEmail: "user2@example.com",
      userId: user2.id,
    },
    {
      title: "Web Design Services",
      description: "Custom websites, responsive design, SEO optimization. 10+ years experience",
      price: null,
      category: "SERVICES" as const,
      city: "San Francisco",
      contactEmail: "user2@example.com",
      userId: user2.id,
    },
    {
      title: "Coffee Table - IKEA",
      description: "Light oak, 2 years old, must sell due to moving",
      price: "35.00",
      category: "FOR_SALE" as const,
      city: "San Francisco",
      contactEmail: "user1@example.com",
      userId: user1.id,
    },
    {
      title: "Laptop - Dell XPS 15",
      description: "RTX 3070, 16GB RAM, 512GB SSD, 2 years old",
      price: "1200.00",
      category: "ELECTRONICS" as const,
      city: "San Francisco",
      contactEmail: "user2@example.com",
      userId: user2.id,
    },
    {
      title: "2-Bedroom House with Backyard",
      description: "Newly renovated kitchen, off-street parking, pet-friendly",
      price: "3200.00",
      category: "HOUSING" as const,
      city: "Oakland",
      contactEmail: "user1@example.com",
      userId: user1.id,
    },
    {
      title: "Tutoring - Math & Physics",
      description: "College prep, SAT/ACT, one-on-one or small groups",
      price: null,
      category: "SERVICES" as const,
      city: "Berkeley",
      contactEmail: "user2@example.com",
      userId: user2.id,
    },
    {
      title: "2015 Toyota Prius",
      description: "Excellent fuel economy, well maintained, newer tires",
      price: "10500.00",
      category: "VEHICLES" as const,
      city: "San Francisco",
      contactEmail: "user1@example.com",
      userId: user1.id,
    },
    {
      title: "Graphic Design Freelance",
      description: "Logo design, social media graphics, brand identity packages",
      price: null,
      category: "SERVICES" as const,
      city: "Oakland",
      contactEmail: "user1@example.com",
      userId: user1.id,
    },
  ];

  for (const listingData of listings) {
    await prisma.listing.create({
      data: {
        ...listingData,
        price: listingData.price ? parseFloat(listingData.price) : null,
      },
    });
  }

  console.log("✓ Database seeded successfully");
  console.log(`Created ${listings.length} listings and 3 users (1 admin, 2 regular)`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
