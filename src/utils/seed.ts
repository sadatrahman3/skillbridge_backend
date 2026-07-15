import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../config/db';
import { User } from '../models/User';
import { Item } from '../models/Item';

const categories = [
  'Development',
  'Design',
  'Marketing',
  'Writing',
  'Consulting',
  'Photography',
  'Music',
  'Other',
];

const demoItems = [
  {
    title: 'Full-Stack Web Development',
    shortDescription: 'End-to-end web application development using modern frameworks and best practices.',
    fullDescription:
      'I build scalable, production-ready web applications using React, Next.js, Node.js, and Express. Services include API design, database modeling, authentication, responsive UI implementation, and deployment. Every project follows clean architecture, strong security practices, and performance optimization.',
    price: 450,
    category: 'Development',
    location: 'Remote',
    rating: 4.9,
    reviewCount: 28,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'UI/UX Design System',
    shortDescription: 'Complete design systems, wireframes, and high-fidelity prototypes for web apps.',
    fullDescription:
      'I create cohesive design systems with reusable components, consistent typography, color palettes, and accessibility-first patterns. Deliverables include Figma files, interactive prototypes, component libraries, and design tokens ready for developer handoff.',
    price: 320,
    category: 'Design',
    location: 'Dhaka, Bangladesh',
    rating: 4.8,
    reviewCount: 19,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Social Media Marketing',
    shortDescription: 'Strategic content planning, ad campaigns, and analytics reporting for growth.',
    fullDescription:
      'Grow your brand with tailored social media strategies. I handle content calendars, audience research, paid ad management, performance tracking, and monthly reporting across Instagram, Facebook, LinkedIn, and TikTok.',
    price: 200,
    category: 'Marketing',
    location: 'Remote',
    rating: 4.6,
    reviewCount: 14,
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Technical Writing & Docs',
    shortDescription: 'Clear API documentation, product guides, and technical blog posts.',
    fullDescription:
      'I turn complex technical concepts into clear, user-friendly documentation. Services include API reference docs, developer onboarding guides, READMEs, technical blog posts, and product knowledge bases.',
    price: 150,
    category: 'Writing',
    location: 'Remote',
    rating: 4.7,
    reviewCount: 22,
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Business Strategy Consulting',
    shortDescription: 'Data-driven consulting for startups and small businesses.',
    fullDescription:
      'Get expert guidance on business model design, market positioning, pricing strategy, and operational efficiency. I work with founders and teams to identify growth opportunities and build actionable roadmaps.',
    price: 500,
    category: 'Consulting',
    location: 'New York, USA',
    rating: 4.9,
    reviewCount: 11,
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Professional Photography',
    shortDescription: 'High-quality product, portrait, and event photography sessions.',
    fullDescription:
      'I provide professional photography services for products, portraits, and events. Each session includes edited high-resolution images, color correction, and quick turnaround times.',
    price: 280,
    category: 'Photography',
    location: 'Los Angeles, USA',
    rating: 4.8,
    reviewCount: 16,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Music Production & Mixing',
    shortDescription: 'Professional music production, mixing, and mastering services.',
    fullDescription:
      'From beatmaking and arrangement to final mixing and mastering, I help artists bring their sound to life. I work across genres including pop, hip-hop, electronic, and acoustic.',
    price: 350,
    category: 'Music',
    location: 'London, UK',
    rating: 4.7,
    reviewCount: 9,
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Brand Identity Design',
    shortDescription: 'Logo design, color palettes, typography, and brand guidelines.',
    fullDescription:
      'I create memorable brand identities that communicate your values. Deliverables include logo variations, color systems, typography pairings, and comprehensive brand guidelines.',
    price: 240,
    category: 'Design',
    location: 'Remote',
    rating: 4.5,
    reviewCount: 13,
    image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'SEO & Content Strategy',
    shortDescription: 'Search engine optimization, keyword research, and content planning.',
    fullDescription:
      'Improve your organic visibility with technical SEO audits, keyword research, on-page optimization, and content strategy. I deliver measurable results with monthly tracking reports.',
    price: 180,
    category: 'Marketing',
    location: 'Remote',
    rating: 4.6,
    reviewCount: 17,
    image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Mobile App Development',
    shortDescription: 'Cross-platform mobile applications built with React Native.',
    fullDescription:
      'I build cross-platform mobile apps with React Native, delivering native-like performance on both iOS and Android. Services include app architecture, UI implementation, API integration, and app store deployment support.',
    price: 600,
    category: 'Development',
    location: 'Remote',
    rating: 4.8,
    reviewCount: 20,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await Item.deleteMany({});
    await User.deleteMany({});

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@skillbridge.com',
      password: 'Admin123!',
      role: 'admin',
    });

    const user = await User.create({
      name: 'Demo User',
      email: 'user@skillbridge.com',
      password: 'User123!',
      role: 'user',
    });

    const itemsWithOwners = demoItems.map((item, index) => ({
      ...item,
      createdBy: index % 2 === 0 ? admin._id : user._id,
    }));

    await Item.insertMany(itemsWithOwners);

    console.log('Database seeded successfully');
    console.log('Admin: admin@skillbridge.com / Admin123!');
    console.log('User: user@skillbridge.com / User123!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
