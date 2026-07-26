import { NextResponse } from 'next/server';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  framework: string;
  isPremium: boolean;
  tags: string[];
  previewUrl: string;
}

const templates: Template[] = [
  {
    id: 'landing-modern',
    name: 'Modern Landing Page',
    description: 'A clean, modern landing page with hero section, features grid, testimonials, and CTA. Perfect for SaaS products and startups.',
    category: 'Landing Page',
    thumbnail: '/templates/landing-modern.png',
    framework: 'html',
    isPremium: false,
    tags: ['landing', 'saas', 'startup', 'modern'],
    previewUrl: '/templates/landing-modern',
  },
  {
    id: 'portfolio-creative',
    name: 'Creative Portfolio',
    description: 'An artistic portfolio template with gallery layout, project showcase, skills section, and contact form. Great for designers and freelancers.',
    category: 'Portfolio',
    thumbnail: '/templates/portfolio-creative.png',
    framework: 'html',
    isPremium: false,
    tags: ['portfolio', 'creative', 'designer', 'freelancer'],
    previewUrl: '/templates/portfolio-creative',
  },
  {
    id: 'ecommerce-store',
    name: 'E-Commerce Store',
    description: 'A full e-commerce template with product grid, shopping cart, checkout flow, and category navigation. Ideal for online stores.',
    category: 'E-Commerce',
    thumbnail: '/templates/ecommerce-store.png',
    framework: 'html',
    isPremium: true,
    tags: ['ecommerce', 'store', 'shop', 'products'],
    previewUrl: '/templates/ecommerce-store',
  },
  {
    id: 'blog-minimal',
    name: 'Minimal Blog',
    description: 'A minimalist blog template with article list, reading view, sidebar categories, and newsletter signup. Clean and focused on content.',
    category: 'Blog',
    thumbnail: '/templates/blog-minimal.png',
    framework: 'html',
    isPremium: false,
    tags: ['blog', 'minimal', 'content', 'writing'],
    previewUrl: '/templates/blog-minimal',
  },
  {
    id: 'restaurant-menu',
    name: 'Restaurant & Menu',
    description: 'A beautiful restaurant template with menu display, reservation form, gallery, and location map. Perfect for food businesses.',
    category: 'Business',
    thumbnail: '/templates/restaurant-menu.png',
    framework: 'html',
    isPremium: false,
    tags: ['restaurant', 'food', 'menu', 'business'],
    previewUrl: '/templates/restaurant-menu',
  },
  {
    id: 'agency-bold',
    name: 'Bold Agency',
    description: 'A bold, impactful agency template with large hero, services section, team showcase, and case studies. Makes a strong impression.',
    category: 'Agency',
    thumbnail: '/templates/agency-bold.png',
    framework: 'html',
    isPremium: true,
    tags: ['agency', 'bold', 'services', 'corporate'],
    previewUrl: '/templates/agency-bold',
  },
  {
    id: 'event-conference',
    name: 'Event & Conference',
    description: 'An event template with schedule, speaker profiles, venue info, and registration form. Great for conferences and meetups.',
    category: 'Event',
    thumbnail: '/templates/event-conference.png',
    framework: 'html',
    isPremium: false,
    tags: ['event', 'conference', 'schedule', 'registration'],
    previewUrl: '/templates/event-conference',
  },
  {
    id: 'dashboard-admin',
    name: 'Admin Dashboard',
    description: 'A comprehensive admin dashboard with data tables, charts, sidebar navigation, and user management. Built for web applications.',
    category: 'Dashboard',
    thumbnail: '/templates/dashboard-admin.png',
    framework: 'html',
    isPremium: true,
    tags: ['dashboard', 'admin', 'analytics', 'management'],
    previewUrl: '/templates/dashboard-admin',
  },
  {
    id: 'education-course',
    name: 'Online Course',
    description: 'An education template with course listing, lesson layout, progress tracking, and instructor profiles. Designed for learning platforms.',
    category: 'Education',
    thumbnail: '/templates/education-course.png',
    framework: 'html',
    isPremium: false,
    tags: ['education', 'course', 'learning', 'online'],
    previewUrl: '/templates/education-course',
  },
  {
    id: 'startup-hero',
    name: 'Startup Hero',
    description: 'A dynamic startup template with animated hero, pricing table, FAQ section, and investor info. Optimized for conversions.',
    category: 'Landing Page',
    thumbnail: '/templates/startup-hero.png',
    framework: 'html',
    isPremium: false,
    tags: ['startup', 'hero', 'pricing', 'conversion'],
    previewUrl: '/templates/startup-hero',
  },
];

const categories = [
  'Landing Page',
  'Portfolio',
  'E-Commerce',
  'Blog',
  'Business',
  'Agency',
  'Event',
  'Dashboard',
  'Education',
];

export async function GET() {
  try {
    return NextResponse.json({
      templates,
      categories,
      total: templates.length,
      premiumCount: templates.filter(t => t.isPremium).length,
      freeCount: templates.filter(t => !t.isPremium).length,
    });
  } catch (error) {
    console.error('Templates GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
