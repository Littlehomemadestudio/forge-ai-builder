import type { EditorComponent, EditorComponentCategory } from './types'

export const EDITOR_COMPONENT_CATEGORIES: EditorComponentCategory[] = [
  {
    id: 'navigation',
    name: 'Navigation',
    icon: 'Layout',
    components: [
      {
        id: 'nav-simple',
        name: 'Simple Nav',
        category: 'navigation',
        description: 'Clean minimal navigation bar',
        icon: 'Layout',
        html: `<nav style="display:flex;justify-content:space-between;align-items:center;padding:1rem 2rem;background:#111;color:#fff;"><div style="font-weight:700;font-size:1.2rem;">Brand</div><div style="display:flex;gap:1.5rem;"><a href="#" style="color:#fff;text-decoration:none;">Home</a><a href="#" style="color:#fff;text-decoration:none;">About</a><a href="#" style="color:#fff;text-decoration:none;">Contact</a></div></nav>`
      },
      {
        id: 'nav-hero',
        name: 'Nav with CTA',
        category: 'navigation',
        description: 'Navigation with call-to-action button',
        icon: 'Layout',
        html: `<nav style="display:flex;justify-content:space-between;align-items:center;padding:1rem 2rem;background:#111;color:#fff;"><div style="font-weight:700;font-size:1.2rem;">Brand</div><div style="display:flex;gap:1.5rem;align-items:center;"><a href="#" style="color:#fff;text-decoration:none;">Home</a><a href="#" style="color:#fff;text-decoration:none;">About</a><a href="#" style="color:#fff;text-decoration:none;">Contact</a><button style="background:#7c3aed;color:#fff;padding:0.5rem 1rem;border:none;border-radius:0.375rem;cursor:pointer;font-weight:600;">Get Started</button></div></nav>`
      },
      {
        id: 'nav-centered',
        name: 'Centered Nav',
        category: 'navigation',
        description: 'Logo centered with links on both sides',
        icon: 'Layout',
        html: `<nav style="display:flex;justify-content:center;align-items:center;padding:1rem 2rem;background:#111;color:#fff;gap:2rem;"><a href="#" style="color:#fff;text-decoration:none;">Home</a><a href="#" style="color:#fff;text-decoration:none;">Features</a><div style="font-weight:700;font-size:1.5rem;padding:0.5rem 1.5rem;border:2px solid #7c3aed;border-radius:0.5rem;">BRAND</div><a href="#" style="color:#fff;text-decoration:none;">About</a><a href="#" style="color:#fff;text-decoration:none;">Contact</a></nav>`
      },
    ]
  },
  {
    id: 'hero',
    name: 'Hero',
    icon: 'Maximize2',
    components: [
      {
        id: 'hero-centered',
        name: 'Centered Hero',
        category: 'hero',
        description: 'Classic centered hero section',
        icon: 'Maximize2',
        html: `<section style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4rem 2rem;background:linear-gradient(135deg,#0a0a0a,#1a1a2e);color:#fff;min-height:60vh;"><h1 style="font-size:3rem;font-weight:800;margin-bottom:1rem;text-align:center;">Build something amazing</h1><p style="font-size:1.2rem;color:#aaa;margin-bottom:2rem;text-align:center;max-width:600px;">The modern platform for creating beautiful websites with AI</p><div style="display:flex;gap:1rem;"><button style="background:#7c3aed;color:#fff;padding:0.75rem 2rem;border:none;border-radius:0.5rem;cursor:pointer;font-weight:600;font-size:1rem;">Start Building</button><button style="background:transparent;color:#fff;padding:0.75rem 2rem;border:1px solid #444;border-radius:0.5rem;cursor:pointer;font-size:1rem;">Learn More</button></div></section>`
      },
      {
        id: 'hero-split',
        name: 'Split Hero',
        category: 'hero',
        description: 'Side-by-side hero with text and visual',
        icon: 'Maximize2',
        html: `<section style="display:flex;align-items:center;padding:4rem 2rem;background:#0a0a0a;color:#fff;gap:3rem;"><div style="flex:1;"><h1 style="font-size:2.8rem;font-weight:800;margin-bottom:1rem;">Transform your workflow</h1><p style="font-size:1.1rem;color:#888;margin-bottom:2rem;">Powerful tools that help you build, deploy, and scale with ease.</p><button style="background:#7c3aed;color:#fff;padding:0.75rem 2rem;border:none;border-radius:0.5rem;cursor:pointer;font-weight:600;">Get Started</button></div><div style="flex:1;display:flex;align-items:center;justify-content:center;"><div style="width:300px;height:200px;background:linear-gradient(135deg,#7c3aed,#2dd4bf);border-radius:1rem;display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:600;">Preview</div></div></section>`
      },
      {
        id: 'hero-gradient',
        name: 'Gradient Hero',
        category: 'hero',
        description: 'Full-width gradient hero',
        icon: 'Maximize2',
        html: `<section style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6rem 2rem;background:linear-gradient(135deg,#7c3aed 0%,#2dd4bf 100%);color:#fff;min-height:70vh;"><h1 style="font-size:3.5rem;font-weight:900;margin-bottom:1.5rem;text-align:center;">The future is here</h1><p style="font-size:1.3rem;color:rgba(255,255,255,0.85);margin-bottom:2.5rem;text-align:center;max-width:600px;">Experience the next generation of web building technology</p><button style="background:#fff;color:#7c3aed;padding:1rem 3rem;border:none;border-radius:0.5rem;cursor:pointer;font-weight:700;font-size:1.1rem;">Start Free Trial</button></section>`
      },
    ]
  },
  {
    id: 'content',
    name: 'Content',
    icon: 'Type',
    components: [
      {
        id: 'text-block',
        name: 'Text Block',
        category: 'content',
        description: 'Rich text content section',
        icon: 'Type',
        html: `<section style="padding:3rem 2rem;background:#111;color:#fff;max-width:800px;"><h2 style="font-size:2rem;font-weight:700;margin-bottom:1rem;">Section Title</h2><p style="color:#888;line-height:1.8;">This is a content section where you can write detailed descriptions about your product, service, or feature. Use it to communicate value and build trust with your audience. Make every word count.</p></section>`
      },
      {
        id: 'two-column',
        name: 'Two Column',
        category: 'content',
        description: 'Two-column content layout',
        icon: 'Type',
        html: `<section style="display:flex;gap:3rem;padding:3rem 2rem;background:#111;color:#fff;"><div style="flex:1;"><h3 style="font-size:1.5rem;font-weight:700;margin-bottom:0.75rem;">Left Column</h3><p style="color:#888;line-height:1.7;">Content for the left column. This layout works well for comparing features or showing details side by side.</p></div><div style="flex:1;"><h3 style="font-size:1.5rem;font-weight:700;margin-bottom:0.75rem;">Right Column</h3><p style="color:#888;line-height:1.7;">Content for the right column. Each column can have its own heading and description.</p></div></section>`
      },
      {
        id: 'feature-list',
        name: 'Feature List',
        category: 'content',
        description: 'Bulleted feature highlights',
        icon: 'Type',
        html: `<section style="padding:3rem 2rem;background:#111;color:#fff;"><h2 style="font-size:2rem;font-weight:700;margin-bottom:2rem;">Key Features</h2><ul style="list-style:none;display:flex;flex-direction:column;gap:1rem;"><li style="display:flex;align-items:start;gap:0.75rem;"><span style="color:#7c3aed;font-weight:700;">✦</span><div><strong>Feature One</strong><p style="color:#888;margin-top:0.25rem;">Description of the first key feature.</p></div></li><li style="display:flex;align-items:start;gap:0.75rem;"><span style="color:#2dd4bf;font-weight:700;">✦</span><div><strong>Feature Two</strong><p style="color:#888;margin-top:0.25rem;">Description of the second key feature.</p></div></li><li style="display:flex;align-items:start;gap:0.75rem;"><span style="color:#f472b6;font-weight:700;">✦</span><div><strong>Feature Three</strong><p style="color:#888;margin-top:0.25rem;">Description of the third key feature.</p></div></li></ul></section>`
      },
    ]
  },
  {
    id: 'cards',
    name: 'Cards',
    icon: 'Square',
    components: [
      {
        id: 'card-basic',
        name: 'Basic Card',
        category: 'cards',
        description: 'Simple content card',
        icon: 'Square',
        html: `<div style="background:#1a1a2e;border-radius:0.75rem;padding:1.5rem;border:1px solid #2a2a3e;color:#fff;"><h3 style="font-size:1.2rem;font-weight:600;margin-bottom:0.5rem;">Card Title</h3><p style="color:#888;line-height:1.6;">This is a basic card component with a title and description. Perfect for displaying bite-sized information.</p></div>`
      },
      {
        id: 'card-pricing',
        name: 'Pricing Card',
        category: 'cards',
        description: 'Pricing tier card',
        icon: 'Square',
        html: `<div style="background:#1a1a2e;border-radius:0.75rem;padding:2rem;border:1px solid #2a2a3e;color:#fff;text-align:center;"><h3 style="font-size:1.2rem;font-weight:600;margin-bottom:0.5rem;color:#7c3aed;">Pro Plan</h3><div style="font-size:2.5rem;font-weight:800;margin:1rem 0;">$19<span style="font-size:1rem;color:#888;">/mo</span></div><ul style="list-style:none;display:flex;flex-direction:column;gap:0.5rem;margin:1.5rem 0;color:#888;"><li>✓ 500 AI Credits</li><li>✓ All Export Formats</li><li>✓ Custom Domains</li></ul><button style="background:#7c3aed;color:#fff;padding:0.75rem 2rem;border:none;border-radius:0.5rem;cursor:pointer;font-weight:600;width:100%;">Choose Plan</button></div>`
      },
      {
        id: 'card-feature',
        name: 'Feature Card',
        category: 'cards',
        description: 'Feature showcase card',
        icon: 'Square',
        html: `<div style="background:#1a1a2e;border-radius:0.75rem;padding:1.5rem;border:1px solid #2a2a3e;color:#fff;"><div style="width:2.5rem;height:2.5rem;background:#7c3aed;border-radius:0.5rem;display:flex;align-items:center;justify-content:center;margin-bottom:1rem;color:#fff;font-size:1.2rem;">⚡</div><h3 style="font-size:1.2rem;font-weight:600;margin-bottom:0.5rem;">Feature Name</h3><p style="color:#888;line-height:1.6;">Brief description of this feature and what it enables users to accomplish.</p></div>`
      },
      {
        id: 'card-stats',
        name: 'Stats Card',
        category: 'cards',
        description: 'Statistics display card',
        icon: 'Square',
        html: `<div style="background:#1a1a2e;border-radius:0.75rem;padding:2rem;border:1px solid #2a2a3e;color:#fff;text-align:center;"><div style="font-size:3rem;font-weight:800;color:#2dd4bf;">10K+</div><div style="font-size:1rem;color:#888;margin-top:0.5rem;">Active Users</div></div>`
      },
      {
        id: 'card-team',
        name: 'Team Card',
        category: 'cards',
        description: 'Team member profile',
        icon: 'Square',
        html: `<div style="background:#1a1a2e;border-radius:0.75rem;padding:1.5rem;border:1px solid #2a2a3e;color:#fff;text-align:center;"><div style="width:4rem;height:4rem;background:linear-gradient(135deg,#7c3aed,#2dd4bf);border-radius:50%;margin:0 auto 1rem;display:flex;align-items:center;justify-content:center;font-size:1.5rem;">😊</div><h3 style="font-size:1.1rem;font-weight:600;">Jane Doe</h3><p style="color:#7c3aed;font-size:0.9rem;">CEO & Founder</p></div>`
      },
    ]
  },
  {
    id: 'forms',
    name: 'Forms',
    icon: 'FileText',
    components: [
      {
        id: 'form-contact',
        name: 'Contact Form',
        category: 'forms',
        description: 'Contact form with validation',
        icon: 'FileText',
        html: `<form style="display:flex;flex-direction:column;gap:1rem;padding:2rem;background:#1a1a2e;border-radius:0.75rem;border:1px solid #2a2a3e;color:#fff;max-width:500px;"><label style="font-weight:600;">Name</label><input type="text" placeholder="Your name" style="background:#111;border:1px solid #2a2a3e;border-radius:0.5rem;padding:0.75rem;color:#fff;font-size:1rem;" /><label style="font-weight:600;">Email</label><input type="email" placeholder="you@example.com" style="background:#111;border:1px solid #2a2a3e;border-radius:0.5rem;padding:0.75rem;color:#fff;font-size:1rem;" /><label style="font-weight:600;">Message</label><textarea placeholder="Your message" rows="4" style="background:#111;border:1px solid #2a2a3e;border-radius:0.5rem;padding:0.75rem;color:#fff;font-size:1rem;resize:vertical;"></textarea><button type="submit" style="background:#7c3aed;color:#fff;padding:0.75rem;border:none;border-radius:0.5rem;cursor:pointer;font-weight:600;font-size:1rem;">Send Message</button></form>`
      },
      {
        id: 'form-signup',
        name: 'Signup Form',
        category: 'forms',
        description: 'Registration/signup form',
        icon: 'FileText',
        html: `<form style="display:flex;flex-direction:column;gap:1rem;padding:2rem;background:#1a1a2e;border-radius:0.75rem;border:1px solid #2a2a3e;color:#fff;max-width:400px;"><h3 style="font-size:1.5rem;font-weight:700;text-align:center;">Create Account</h3><input type="text" placeholder="Full Name" style="background:#111;border:1px solid #2a2a3e;border-radius:0.5rem;padding:0.75rem;color:#fff;font-size:1rem;" /><input type="email" placeholder="Email Address" style="background:#111;border:1px solid #2a2a3e;border-radius:0.5rem;padding:0.75rem;color:#fff;font-size:1rem;" /><input type="password" placeholder="Password" style="background:#111;border:1px solid #2a2a3e;border-radius:0.5rem;padding:0.75rem;color:#fff;font-size:1rem;" /><button type="submit" style="background:#7c3aed;color:#fff;padding:0.75rem;border:none;border-radius:0.5rem;cursor:pointer;font-weight:600;font-size:1rem;">Sign Up</button></form>`
      },
      {
        id: 'newsletter',
        name: 'Newsletter',
        category: 'forms',
        description: 'Email signup bar',
        icon: 'FileText',
        html: `<section style="display:flex;align-items:center;justify-content:center;gap:1rem;padding:2rem;background:#111;color:#fff;"><p style="font-weight:600;font-size:1.1rem;">Subscribe to our newsletter</p><div style="display:flex;gap:0.5rem;"><input type="email" placeholder="Enter your email" style="background:#1a1a2e;border:1px solid #2a2a3e;border-radius:0.5rem;padding:0.75rem;color:#fff;font-size:0.9rem;width:250px;" /><button style="background:#7c3aed;color:#fff;padding:0.75rem 1.5rem;border:none;border-radius:0.5rem;cursor:pointer;font-weight:600;">Subscribe</button></div></section>`
      },
    ]
  },
  {
    id: 'footer',
    name: 'Footer',
    icon: 'Globe',
    components: [
      {
        id: 'footer-simple',
        name: 'Simple Footer',
        category: 'footer',
        description: 'Minimal centered footer',
        icon: 'Globe',
        html: `<footer style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;background:#0a0a0a;color:#888;"><div style="font-weight:700;font-size:1.2rem;color:#fff;margin-bottom:1rem;">Brand</div><p style="font-size:0.9rem;">© 2025 Brand. All rights reserved.</p></footer>`
      },
      {
        id: 'footer-full',
        name: 'Full Footer',
        category: 'footer',
        description: 'Multi-column footer with links',
        icon: 'Globe',
        html: `<footer style="display:flex;justify-content:space-between;padding:3rem 2rem;background:#0a0a0a;color:#fff;gap:3rem;"><div style="flex:1;"><div style="font-weight:700;font-size:1.2rem;margin-bottom:1rem;">Brand</div><p style="color:#888;font-size:0.9rem;line-height:1.6;">Building the future of web creation.</p></div><div style="flex:1;"><h4 style="font-weight:600;margin-bottom:0.75rem;">Product</h4><a href="#" style="color:#888;text-decoration:none;display:block;margin-bottom:0.5rem;">Features</a><a href="#" style="color:#888;text-decoration:none;display:block;margin-bottom:0.5rem;">Pricing</a><a href="#" style="color:#888;text-decoration:none;display:block;">Docs</a></div><div style="flex:1;"><h4 style="font-weight:600;margin-bottom:0.75rem;">Company</h4><a href="#" style="color:#888;text-decoration:none;display:block;margin-bottom:0.5rem;">About</a><a href="#" style="color:#888;text-decoration:none;display:block;margin-bottom:0.5rem;">Blog</a><a href="#" style="color:#888;text-decoration:none;display:block;">Careers</a></div><div style="flex:1;"><h4 style="font-weight:600;margin-bottom:0.75rem;">Legal</h4><a href="#" style="color:#888;text-decoration:none;display:block;margin-bottom:0.5rem;">Privacy</a><a href="#" style="color:#888;text-decoration:none;display:block;margin-bottom:0.5rem;">Terms</a><a href="#" style="color:#888;text-decoration:none;display:block;">Security</a></div></footer>`
      },
    ]
  },
  {
    id: 'media',
    name: 'Media',
    icon: 'Image',
    components: [
      {
        id: 'gallery-grid',
        name: 'Gallery Grid',
        category: 'media',
        description: 'Image gallery grid layout',
        icon: 'Image',
        html: `<section style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;padding:2rem;background:#111;"><div style="background:linear-gradient(135deg,#7c3aed,#2dd4bf);border-radius:0.75rem;min-height:200px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600;">Image 1</div><div style="background:linear-gradient(135deg,#f472b6,#fb923c);border-radius:0.75rem;min-height:200px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600;">Image 2</div><div style="background:linear-gradient(135deg,#2dd4bf,#7c3aed);border-radius:0.75rem;min-height:200px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600;">Image 3</div></section>`
      },
      {
        id: 'video-embed',
        name: 'Video Embed',
        category: 'media',
        description: 'Embedded video placeholder',
        icon: 'Image',
        html: `<section style="padding:2rem;background:#111;display:flex;justify-content:center;"><div style="width:100%;max-width:800px;background:#1a1a2e;border-radius:0.75rem;min-height:400px;display:flex;align-items:center;justify-content:center;color:#fff;border:1px solid #2a2a3e;"><div style="text-align:center;"><div style="font-size:3rem;margin-bottom:1rem;">▶</div><p>Video Placeholder</p></div></div></section>`
      },
    ]
  },
  {
    id: 'social',
    name: 'Social',
    icon: 'MessageSquare',
    components: [
      {
        id: 'testimonials',
        name: 'Testimonials',
        category: 'social',
        description: 'Customer testimonial section',
        icon: 'MessageSquare',
        html: `<section style="padding:3rem 2rem;background:#111;color:#fff;"><h2 style="font-size:2rem;font-weight:700;margin-bottom:2rem;text-align:center;">What people say</h2><div style="display:flex;gap:1.5rem;justify-content:center;flex-wrap:wrap;"><div style="background:#1a1a2e;border-radius:0.75rem;padding:1.5rem;border:1px solid #2a2a3e;max-width:300px;"><p style="color:#888;line-height:1.7;margin-bottom:1rem;">"This product changed how I build websites. It's incredibly fast."</p><div style="font-weight:600;">Alex M.</div><div style="color:#7c3aed;font-size:0.9rem;">Designer</div></div><div style="background:#1a1a2e;border-radius:0.75rem;padding:1.5rem;border:1px solid #2a2a3e;max-width:300px;"><p style="color:#888;line-height:1.7;margin-bottom:1rem;">"The export quality is remarkable. Clean, semantic code."</p><div style="font-weight:600;">Sarah K.</div><div style="color:#2dd4bf;font-size:0.9rem;">Developer</div></div></div></section>`
      },
    ]
  },
  {
    id: 'dividers',
    name: 'Dividers',
    icon: 'Separator',
    components: [
      {
        id: 'divider-line',
        name: 'Line Divider',
        category: 'dividers',
        description: 'Simple horizontal line',
        icon: 'Separator',
        html: `<div style="padding:1rem 2rem;"><hr style="border:none;border-top:1px solid #2a2a3e;" /></div>`
      },
      {
        id: 'divider-spacer',
        name: 'Spacer',
        category: 'dividers',
        description: 'Empty spacing block',
        icon: 'Separator',
        html: `<div style="height:3rem;background:transparent;"></div>`
      },
    ]
  },
]

export function getAllComponents(): EditorComponent[] {
  return EDITOR_COMPONENT_CATEGORIES.flatMap(c => c.components)
}

export function getComponentById(id: string): EditorComponent | undefined {
  return getAllComponents().find(c => c.id === id)
}
