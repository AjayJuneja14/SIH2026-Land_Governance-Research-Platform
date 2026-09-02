import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting KisanConnect database seeding...');

  // Clean existing data
  await prisma.order.deleteMany({});
  await prisma.produce.deleteMany({});
  await prisma.hub.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPassword = await bcrypt.hash('password123', 10);

  // 1. Create Hubs
  console.log('Creating aggregation hubs...');
  const hub1 = await prisma.hub.create({
    data: {
      name: 'Nashik Agro Central Hub',
      location: 'Pimpalgaon Baswant, Nashik, Maharashtra',
      lat: 20.1742,
      lng: 73.9856,
      contactNumber: '+91 98230 11223',
    },
  });

  const hub2 = await prisma.hub.create({
    data: {
      name: 'Pune Krishi Aggregation Center',
      location: 'Hadapsar Mandi Road, Pune, Maharashtra',
      lat: 18.5089,
      lng: 73.9260,
      contactNumber: '+91 98230 44556',
    },
  });

  const hub3 = await prisma.hub.create({
    data: {
      name: 'North Delhi Kisan Logistic Point',
      location: 'Azadpur Terminal, New Delhi',
      lat: 28.7159,
      lng: 77.1772,
      contactNumber: '+91 98110 77889',
    },
  });

  // 2. Create Farmers (5 sample farmers)
  console.log('Creating 5 sample farmers...');
  const farmer1 = await prisma.user.create({
    data: {
      name: 'Ramesh Kumar Patil',
      phone: '9820011111',
      email: 'ramesh.patil@kisan.in',
      password: defaultPassword,
      role: 'FARMER',
      location: 'Pimpalgaon, Nashik, Maharashtra',
      language: 'mr',
    },
  });

  const farmer2 = await prisma.user.create({
    data: {
      name: 'Gurpreet Singh',
      phone: '9820022222',
      email: 'gurpreet.singh@kisan.in',
      password: defaultPassword,
      role: 'FARMER',
      location: 'Karnal, Haryana',
      language: 'pa',
    },
  });

  const farmer3 = await prisma.user.create({
    data: {
      name: 'Suresh Chandra Sharma',
      phone: '9820033333',
      email: 'suresh.sharma@kisan.in',
      password: defaultPassword,
      role: 'FARMER',
      location: 'Shimla, Himachal Pradesh',
      language: 'hi',
    },
  });

  const farmer4 = await prisma.user.create({
    data: {
      name: 'Lakshmi Devi',
      phone: '9820044444',
      email: 'lakshmi.devi@kisan.in',
      password: defaultPassword,
      role: 'FARMER',
      location: 'Guntur, Andhra Pradesh',
      language: 'te',
    },
  });

  const farmer5 = await prisma.user.create({
    data: {
      name: 'Rajesh Verma',
      phone: '9820055555',
      email: 'rajesh.verma@kisan.in',
      password: defaultPassword,
      role: 'FARMER',
      location: 'Ratnagiri, Maharashtra',
      language: 'mr',
    },
  });

  // 3. Create Buyers (3 sample buyers)
  console.log('Creating 3 sample buyers...');
  const buyer1 = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      phone: '9810011111',
      email: 'priya.sharma@gmail.com',
      password: defaultPassword,
      role: 'BUYER',
      location: 'Kothrud, Pune, Maharashtra',
      language: 'en',
    },
  });

  const buyer2 = await prisma.user.create({
    data: {
      name: 'Anita Rao (FreshOrganics Co)',
      phone: '9810022222',
      email: 'anita.rao@freshorganics.com',
      password: defaultPassword,
      role: 'BUYER',
      location: 'Bandra West, Mumbai',
      language: 'en',
    },
  });

  const buyer3 = await prisma.user.create({
    data: {
      name: 'Vikas Mehta',
      phone: '9810033333',
      email: 'vikas.mehta@outlook.com',
      password: defaultPassword,
      role: 'BUYER',
      location: 'Sector 62, Noida, NCR',
      language: 'hi',
    },
  });

  // 4. Create Admin
  console.log('Creating Admin...');
  await prisma.user.create({
    data: {
      name: 'KisanConnect Admin',
      phone: '9999999999',
      email: 'admin@kisanconnect.in',
      password: defaultPassword,
      role: 'ADMIN',
      location: 'Central Headquarters, New Delhi',
      language: 'en',
    },
  });

  // 5. Create Produce (10 listings)
  console.log('Creating 10 produce listings...');
  const now = new Date();

  const produceList = [
    {
      farmerId: farmer1.id,
      name: 'Organic Red Tomatoes (Farm Fresh)',
      category: 'Vegetables',
      quantity: 450,
      unit: 'kg',
      pricePerUnit: 28,
      qualityGrade: 'Grade A',
      harvestDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
      status: 'AVAILABLE',
      hubId: hub1.id,
      description: 'Naturally ripened, pesticide-free red tomatoes freshly plucked from Nashik soil.',
    },
    {
      farmerId: farmer1.id,
      name: 'Nashik Special Red Onions',
      category: 'Vegetables',
      quantity: 1200,
      unit: 'kg',
      pricePerUnit: 32,
      qualityGrade: 'Grade A',
      harvestDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80',
      status: 'AVAILABLE',
      hubId: hub1.id,
      description: 'Cured, medium-large size red onions with high pungency and long shelf-life.',
    },
    {
      farmerId: farmer2.id,
      name: 'Traditional Basmati Rice (1121 Steam)',
      category: 'Grains',
      quantity: 800,
      unit: 'kg',
      pricePerUnit: 85,
      qualityGrade: 'Premium Aged',
      harvestDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
      status: 'AVAILABLE',
      hubId: hub3.id,
      description: 'Extra long grain aromatic 1121 Steam Basmati rice from the fertile plains of Karnal.',
    },
    {
      farmerId: farmer2.id,
      name: 'Sharbati Golden Wheat Grains',
      category: 'Grains',
      quantity: 1500,
      unit: 'kg',
      pricePerUnit: 42,
      qualityGrade: 'Grade A',
      harvestDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80',
      status: 'AVAILABLE',
      hubId: hub3.id,
      description: 'Heavy lustre golden wheat grains, ideal for soft chapatis with high dietary fiber.',
    },
    {
      farmerId: farmer3.id,
      name: 'Royal Shimla Red Delicious Apples',
      category: 'Fruits',
      quantity: 600,
      unit: 'kg',
      pricePerUnit: 110,
      qualityGrade: 'Grade A',
      harvestDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80',
      status: 'AVAILABLE',
      hubId: hub3.id,
      description: 'Crisp, sweet, hand-picked Shimla orchard apples without artificial wax coating.',
    },
    {
      farmerId: farmer3.id,
      name: 'Fresh Tender Green Spinach (Palak)',
      category: 'Vegetables',
      quantity: 180,
      unit: 'kg',
      pricePerUnit: 22,
      qualityGrade: 'Organic Certified',
      harvestDate: new Date(now.getTime() - 12 * 60 * 60 * 1000),
      imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop&q=80',
      status: 'AVAILABLE',
      hubId: hub2.id,
      description: 'Harvested early morning, crunchy nutrient-rich organic spinach bundles.',
    },
    {
      farmerId: farmer4.id,
      name: 'Spicy Guntur S4 Red & Green Chillies',
      category: 'Spices',
      quantity: 350,
      unit: 'kg',
      pricePerUnit: 65,
      qualityGrade: 'Grade A',
      harvestDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop&q=80',
      status: 'AVAILABLE',
      hubId: hub2.id,
      description: 'Famous Guntur high-pungency green chillies, sun-dried varieties also available on request.',
    },
    {
      farmerId: farmer4.id,
      name: 'Yellow Mustard Seeds (Sarson)',
      category: 'Spices',
      quantity: 250,
      unit: 'kg',
      pricePerUnit: 95,
      qualityGrade: 'Grade A',
      harvestDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
      imageUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format&fit=crop&q=80',
      status: 'AVAILABLE',
      hubId: hub2.id,
      description: 'Pure, unadulterated high-oil-content mustard seeds directly from Andhra farmsteads.',
    },
    {
      farmerId: farmer5.id,
      name: 'GI-Tagged Ratnagiri Alphonso Mangoes',
      category: 'Fruits',
      quantity: 120,
      unit: 'dozen',
      pricePerUnit: 650,
      qualityGrade: 'Premium Export Grade',
      harvestDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80',
      status: 'AVAILABLE',
      hubId: hub2.id,
      description: 'Authentic GI-tagged Ratnagiri Hapus (Alphonso), naturally hay-ripened with unmatched aroma.',
    },
    {
      farmerId: farmer5.id,
      name: 'Farm Fresh Jyoti Potatoes',
      category: 'Vegetables',
      quantity: 900,
      unit: 'kg',
      pricePerUnit: 24,
      qualityGrade: 'Grade B',
      harvestDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80',
      status: 'AVAILABLE',
      hubId: hub1.id,
      description: 'Clean, firm Jyoti potatoes with smooth skin, ideal for cooking and storage.',
    },
  ];

  const createdProduces = [];
  for (const item of produceList) {
    const p = await prisma.produce.create({ data: item });
    createdProduces.push(p);
  }

  // 6. Create Sample Orders
  console.log('Creating sample orders...');
  await prisma.order.create({
    data: {
      buyerId: buyer1.id,
      produceId: createdProduces[0].id, // Tomatoes
      quantity: 15,
      unitPrice: 28,
      totalPrice: 420,
      status: 'CONFIRMED',
      deliveryAddress: 'Flat 402, Green Acre Heights, Kothrud, Pune - 411038',
      hubId: hub2.id,
      paymentStatus: 'PAID',
      notes: 'Please ensure careful handling during transit.',
    },
  });

  await prisma.order.create({
    data: {
      buyerId: buyer2.id,
      produceId: createdProduces[8].id, // Alphonso Mangoes
      quantity: 5,
      unitPrice: 650,
      totalPrice: 3250,
      status: 'PENDING',
      deliveryAddress: 'FreshOrganics Warehouse, Bandra Kurla Complex, Mumbai',
      hubId: hub2.id,
      paymentStatus: 'PENDING',
      notes: 'Bulk trial order for retail organic shelf.',
    },
  });

  await prisma.order.create({
    data: {
      buyerId: buyer3.id,
      produceId: createdProduces[2].id, // Basmati Rice
      quantity: 40,
      unitPrice: 85,
      totalPrice: 3400,
      status: 'DELIVERED',
      deliveryAddress: 'House #12, Block C, Sector 62, Noida, UP',
      hubId: hub3.id,
      paymentStatus: 'PAID',
      notes: 'Delivered directly to consumer door.',
    },
  });

  console.log('✅ KisanConnect database seeded successfully!');
  console.log('Summary:');
  console.log(`- 3 Hubs`);
  console.log(`- 5 Farmers (Password: password123)`);
  console.log(`- 3 Buyers (Password: password123)`);
  console.log(`- 1 Admin: admin@kisanconnect.in / 9999999999 (Password: password123)`);
  console.log(`- 10 Produce listings across 4 categories`);
  console.log(`- 3 Sample orders`);
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
