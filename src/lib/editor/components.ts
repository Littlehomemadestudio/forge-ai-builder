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
      {
        id: 'hero-bg-image',
        name: 'Hero with BG Image',
        category: 'hero',
        description: 'Hero with background image overlay',
        icon: 'Maximize2',
        html: `<section style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6rem 2rem;background:linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)),linear-gradient(135deg,#1a1a2e,#0a0a0a);color:#fff;min-height:70vh;text-align:center;"><h1 style="font-size:3.5rem;font-weight:900;margin-bottom:1.5rem;">Explore the world</h1><p style="font-size:1.3rem;color:rgba(255,255,255,0.85);margin-bottom:2.5rem;max-width:600px;">Discover new horizons with our immersive experiences</p><button style="background:#7c3aed;color:#fff;padding:1rem 3rem;border:none;border-radius:0.5rem;cursor:pointer;font-weight:700;font-size:1.1rem;">Discover More</button></section>`
      },
      {
        id: 'hero-video',
        name: 'Hero with Video',
        category: 'hero',
        description: 'Hero section with video placeholder',
        icon: 'Maximize2',
        html: `<section style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:5rem 2rem;background:#0a0a0a;color:#fff;min-height:60vh;text-align:center;"><h1 style="font-size:3rem;font-weight:800;margin-bottom:1rem;">Watch our story</h1><p style="font-size:1.1rem;color:#888;margin-bottom:2rem;max-width:500px;">See how we are revolutionizing the way websites are built</p><div style="width:80%;max-width:800px;background:#1a1a2e;border-radius:1rem;padding:3rem;border:1px solid #2a2a3e;display:flex;align-items:center;justify-content:center;"><div style="text-align:center;"><div style="width:80px;height:80px;background:#7c3aed;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2rem;margin:0 auto 1rem;">▶</div><p style="color:#888;font-size:0.9rem;">Video Placeholder</p></div></div></section>`
      },
      {
        id: 'hero-gradient-anim',
        name: 'Gradient Animation Hero',
        category: 'hero',
        description: 'Hero with animated gradient background',
        icon: 'Maximize2',
        html: `<section style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6rem 2rem;background:linear-gradient(-45deg,#0a0a0a,#1a1a2e,#7c3aed,#2dd4bf);background-size:400% 400%;animation:gradientBG 8s ease infinite;color:#fff;min-height:70vh;text-align:center;"><style>@keyframes gradientBG{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}</style><h1 style="font-size:3.5rem;font-weight:900;margin-bottom:1.5rem;">Dynamic Experience</h1><p style="font-size:1.3rem;color:rgba(255,255,255,0.85);margin-bottom:2.5rem;max-width:600px;">Watch the background come alive as you explore our platform</p><button style="background:#fff;color:#7c3aed;padding:1rem 3rem;border:none;border-radius:0.5rem;cursor:pointer;font-weight:700;font-size:1.1rem;">Get Started</button></section>`
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
    id: 'cta',
    name: 'Call-to-Action',
    icon: 'Rocket',
    components: [
      {
        id: 'cta-banner',
        name: 'Banner CTA',
        category: 'cta',
        description: 'Full-width call-to-action banner',
        icon: 'Rocket',
        html: `<section style="display:flex;flex-direction:column;align-items:center;padding:4rem 2rem;background:linear-gradient(135deg,#7c3aed,#2dd4bf);color:#fff;text-align:center;"><h2 style="font-size:2.5rem;font-weight:800;margin-bottom:1rem;">Ready to get started?</h2><p style="font-size:1.1rem;color:rgba(255,255,255,0.85);margin-bottom:2rem;max-width:500px;">Join thousands of creators building amazing websites with Forge.</p><button style="background:#fff;color:#7c3aed;padding:1rem 3rem;border:none;border-radius:0.5rem;font-weight:700;font-size:1.1rem;">Start Free Trial</button></section>`
      },
      {
        id: 'cta-popup',
        name: 'Popup CTA',
        category: 'cta',
        description: 'Floating popup call-to-action',
        icon: 'Rocket',
        html: `<div style="position:fixed;bottom:2rem;right:2rem;background:#1a1a2e;border-radius:1rem;padding:1.5rem;border:2px solid #7c3aed;color:#fff;max-width:320px;box-shadow:0 8px 32px rgba(0,0,0,0.4);z-index:100;"><h3 style="font-size:1.1rem;font-weight:700;margin-bottom:0.5rem;color:#7c3aed;">🎉 Special Offer!</h3><p style="font-size:0.9rem;color:#888;margin-bottom:1rem;">Get 50% off your first month. Limited time offer.</p><button style="background:#7c3aed;color:#fff;padding:0.5rem 1.5rem;border:none;border-radius:0.5rem;font-weight:600;cursor:pointer;width:100%;">Claim Offer</button></div>`
      },
      {
        id: 'cta-floating',
        name: 'Floating CTA',
        category: 'cta',
        description: 'Minimal floating action button',
        icon: 'Rocket',
        html: `<div style="position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%);background:#7c3aed;color:#fff;padding:0.75rem 2rem;border-radius:2rem;font-weight:600;font-size:0.9rem;box-shadow:0 4px 16px rgba(124,58,237,0.4);cursor:pointer;z-index:100;">Start Building Now →</div>`
      },
    ]
  },
  {
    id: 'stats',
    name: 'Stats',
    icon: 'Hash',
    components: [
      {
        id: 'stats-counter',
        name: 'Counter Section',
        category: 'stats',
        description: 'Animated counter statistics',
        icon: 'Hash',
        html: `<section style="display:flex;justify-content:center;gap:3rem;padding:3rem 2rem;background:#0a0a0a;color:#fff;flex-wrap:wrap;"><div style="text-align:center;"><div style="font-size:3rem;font-weight:900;color:#7c3aed;">1M+</div><div style="color:#888;font-size:0.9rem;margin-top:0.5rem;">Downloads</div></div><div style="text-align:center;"><div style="font-size:3rem;font-weight:900;color:#2dd4bf;">500+</div><div style="color:#888;font-size:0.9rem;margin-top:0.5rem;">Projects</div></div><div style="text-align:center;"><div style="font-size:3rem;font-weight:900;color:#f472b6;">99%</div><div style="color:#888;font-size:0.9rem;margin-top:0.5rem;">Satisfaction</div></div><div style="text-align:center;"><div style="font-size:3rem;font-weight:900;color:#fb923c;">24/7</div><div style="color:#888;font-size:0.9rem;margin-top:0.5rem;">Support</div></div></section>`
      },
      {
        id: 'stats-progress',
        name: 'Progress Bars',
        category: 'stats',
        description: 'Visual progress indicators',
        icon: 'Hash',
        html: `<section style="padding:3rem 2rem;background:#111;color:#fff;max-width:600px;"><h2 style="font-size:1.5rem;font-weight:700;margin-bottom:2rem;">Our Progress</h2><div style="display:flex;flex-direction:column;gap:1.5rem;"><div><div style="display:flex;justify-content:space-between;font-size:0.9rem;margin-bottom:0.5rem;"><span>Design</span><span style="color:#7c3aed;">95%</span></div><div style="background:#2a2a3e;border-radius:0.5rem;height:8px;"><div style="background:#7c3aed;height:8px;border-radius:0.5rem;width:95%;"></div></div></div><div><div style="display:flex;justify-content:space-between;font-size:0.9rem;margin-bottom:0.5rem;"><span>Development</span><span style="color:#2dd4bf;">88%</span></div><div style="background:#2a2a3e;border-radius:0.5rem;height:8px;"><div style="background:#2dd4bf;height:8px;border-radius:0.5rem;width:88%;"></div></div></div><div><div style="display:flex;justify-content:space-between;font-size:0.9rem;margin-bottom:0.5rem;"><span>Marketing</span><span style="color:#f472b6;">72%</span></div><div style="background:#2a2a3e;border-radius:0.5rem;height:8px;"><div style="background:#f472b6;height:8px;border-radius:0.5rem;width:72%;"></div></div></div></div></section>`
      },
      {
        id: 'stats-achievement',
        name: 'Achievement Cards',
        category: 'stats',
        description: 'Achievement milestone cards',
        icon: 'Hash',
        html: `<section style="display:flex;gap:1.5rem;padding:3rem 2rem;background:#0a0a0a;color:#fff;flex-wrap:wrap;justify-content:center;"><div style="background:#1a1a2e;border-radius:0.75rem;padding:1.5rem;border:1px solid #7c3aed/30;text-align:center;width:160px;"><div style="font-size:2rem;margin-bottom:0.5rem;">🏆</div><div style="font-weight:700;font-size:1rem;">Award Winner</div><div style="color:#888;font-size:0.8rem;margin-top:0.25rem;">Best SaaS 2024</div></div><div style="background:#1a1a2e;border-radius:0.75rem;padding:1.5rem;border:1px solid #2dd4bf/30;text-align:center;width:160px;"><div style="font-size:2rem;margin-bottom:0.5rem;">🚀</div><div style="font-weight:700;font-size:1rem;">Fast Growth</div><div style="color:#888;font-size:0.8rem;margin-top:0.25rem;">300% YoY</div></div><div style="background:#1a1a2e;border-radius:0.75rem;padding:1.5rem;border:1px solid #f472b6/30;text-align:center;width:160px;"><div style="font-size:2rem;margin-bottom:0.5rem;">🌍</div><div style="font-weight:700;font-size:1rem;">Global Reach</div><div style="color:#888;font-size:0.8rem;margin-top:0.25rem;">50+ Countries</div></div></section>`
      },
    ]
  },
  {
    id: 'timeline',
    name: 'Timeline',
    icon: 'Clock',
    components: [
      {
        id: 'timeline-vertical',
        name: 'Vertical Timeline',
        category: 'timeline',
        description: 'Vertical chronological timeline',
        icon: 'Clock',
        html: `<section style="padding:3rem 2rem;background:#0a0a0a;color:#fff;"><h2 style="font-size:2rem;font-weight:700;margin-bottom:2rem;text-align:center;">Our Journey</h2><div style="display:flex;flex-direction:column;gap:2rem;max-width:500px;margin:0 auto;"><div style="display:flex;gap:1rem;align-items:start;"><div style="width:3px;background:#7c3aed;min-height:60px;border-radius:2px;"></div><div><div style="font-size:0.8rem;color:#7c3aed;margin-bottom:0.25rem;">2020</div><div style="font-weight:600;">Founded</div><div style="color:#888;font-size:0.9rem;">Started with a vision to democratize web creation.</div></div></div><div style="display:flex;gap:1rem;align-items:start;"><div style="width:3px;background:#2dd4bf;min-height:60px;border-radius:2px;"></div><div><div style="font-size:0.8rem;color:#2dd4bf;margin-bottom:0.25rem;">2022</div><div style="font-weight:600;">AI Integration</div><div style="color:#888;font-size:0.9rem;">Launched our AI-powered generation engine.</div></div></div><div style="display:flex;gap:1rem;align-items:start;"><div style="width:3px;background:#f472b6;min-height:60px;border-radius:2px;"></div><div><div style="font-size:0.8rem;color:#f472b6;margin-bottom:0.25rem;">2024</div><div style="font-weight:600;">Global Scale</div><div style="color:#888;font-size:0.9rem;">Now serving over 1 million users worldwide.</div></div></div></div></section>`
      },
      {
        id: 'timeline-horizontal',
        name: 'Horizontal Timeline',
        category: 'timeline',
        description: 'Horizontal timeline with milestones',
        icon: 'Clock',
        html: `<section style="padding:3rem 2rem;background:#111;color:#fff;"><h2 style="font-size:1.5rem;font-weight:700;margin-bottom:2rem;text-align:center;">Milestones</h2><div style="display:flex;gap:2rem;justify-content:center;flex-wrap:wrap;"><div style="background:#1a1a2e;border-radius:0.75rem;padding:1.5rem;border:1px solid #7c3aed;text-align:center;min-width:150px;"><div style="font-size:1.5rem;font-weight:800;color:#7c3aed;">Q1</div><div style="font-weight:600;margin-top:0.5rem;">Launch</div></div><div style="background:#1a1a2e;border-radius:0.75rem;padding:1.5rem;border:1px solid #2dd4bf;text-align:center;min-width:150px;"><div style="font-size:1.5rem;font-weight:800;color:#2dd4bf;">Q2</div><div style="font-weight:600;margin-top:0.5rem;">Growth</div></div><div style="background:#1a1a2e;border-radius:0.75rem;padding:1.5rem;border:1px solid #f472b6;text-align:center;min-width:150px;"><div style="font-size:1.5rem;font-weight:800;color:#f472b6;">Q3</div><div style="font-weight:600;margin-top:0.5rem;">Scale</div></div><div style="background:#1a1a2e;border-radius:0.75rem;padding:1.5rem;border:1px solid #fb923c;text-align:center;min-width:150px;"><div style="font-size:1.5rem;font-weight:800;color:#fb923c;">Q4</div><div style="font-weight:600;margin-top:0.5rem;">Expand</div></div></div></section>`
      },
    ]
  },
  {
    id: 'accordion',
    name: 'Accordion',
    icon: 'ChevronDown',
    components: [
      {
        id: 'accordion-faq',
        name: 'FAQ Accordion',
        category: 'accordion',
        description: 'Frequently asked questions',
        icon: 'ChevronDown',
        html: `<section style="padding:3rem 2rem;background:#0a0a0a;color:#fff;max-width:700px;"><h2 style="font-size:2rem;font-weight:700;margin-bottom:2rem;">Frequently Asked Questions</h2><div style="display:flex;flex-direction:column;gap:1rem;"><div style="background:#1a1a2e;border-radius:0.75rem;padding:1.25rem;border:1px solid #2a2a3e;"><div style="font-weight:600;margin-bottom:0.5rem;">How does AI generation work?</div><div style="color:#888;font-size:0.9rem;line-height:1.6;">Our AI analyzes your prompt and generates complete, responsive websites with real content, proper styling, and semantic structure.</div></div><div style="background:#1a1a2e;border-radius:0.75rem;padding:1.25rem;border:1px solid #2a2a3e;"><div style="font-weight:600;margin-bottom:0.5rem;">Can I edit after generation?</div><div style="color:#888;font-size:0.9rem;line-height:1.6;">Yes! Our visual editor lets you modify every element, style, and content on the generated pages.</div></div><div style="background:#1a1a2e;border-radius:0.75rem;padding:1.25rem;border:1px solid #2a2a3e;"><div style="font-weight:600;margin-bottom:0.5rem;">What export formats are available?</div><div style="color:#888;font-size:0.9rem;line-height:1.6;">Export to HTML, React, Next.js, Vue, and more. All exports produce clean, production-ready code.</div></div></div></section>`
      },
      {
        id: 'accordion-features',
        name: 'Features Accordion',
        category: 'accordion',
        description: 'Expandable feature descriptions',
        icon: 'ChevronDown',
        html: `<section style="padding:3rem 2rem;background:#111;color:#fff;max-width:700px;"><h2 style="font-size:2rem;font-weight:700;margin-bottom:2rem;">Explore Features</h2><div style="display:flex;flex-direction:column;gap:0.75rem;"><div style="background:#1a1a2e;border-radius:0.75rem;padding:1.25rem;border-left:3px solid #7c3aed;"><div style="font-weight:600;color:#7c3aed;margin-bottom:0.5rem;">⚡ AI Generation</div><div style="color:#888;font-size:0.9rem;line-height:1.6;">Describe your vision and watch it materialize in seconds with our advanced AI engine.</div></div><div style="background:#1a1a2e;border-radius:0.75rem;padding:1.25rem;border-left:3px solid #2dd4bf;"><div style="font-weight:600;color:#2dd4bf;margin-bottom:0.5rem;">✏️ Visual Editor</div><div style="color:#888;font-size:0.9rem;line-height:1.6;">Click, drag, and refine every detail with our intuitive Canva-like editor.</div></div><div style="background:#1a1a2e;border-radius:0.75rem;padding:1.25rem;border-left:3px solid #f472b6;"><div style="font-weight:600;color:#f472b6;margin-bottom:0.5rem;">📦 Export Freedom</div><div style="color:#888;font-size:0.9rem;line-height:1.6;">Download clean code in any format. Your website, your rules, no vendor lock-in.</div></div></div></section>`
      },
    ]
  },
  {
    id: 'tabs',
    name: 'Tabs',
    icon: 'Columns2',
    components: [
      {
        id: 'tabs-horizontal',
        name: 'Horizontal Tabs',
        category: 'tabs',
        description: 'Classic horizontal tab navigation',
        icon: 'Columns2',
        html: `<section style="padding:3rem 2rem;background:#0a0a0a;color:#fff;max-width:700px;"><div style="display:flex;gap:0;background:#1a1a2e;border-radius:0.75rem;padding:0.5rem;border:1px solid #2a2a3e;margin-bottom:1.5rem;"><button style="background:#7c3aed;color:#fff;padding:0.5rem 1.5rem;border:none;border-radius:0.5rem;font-weight:600;font-size:0.9rem;">Overview</button><button style="background:transparent;color:#888;padding:0.5rem 1.5rem;border:none;font-size:0.9rem;">Features</button><button style="background:transparent;color:#888;padding:0.5rem 1.5rem;border:none;font-size:0.9rem;">Pricing</button></div><div style="background:#1a1a2e;border-radius:0.75rem;padding:2rem;border:1px solid #2a2a3e;"><h3 style="font-size:1.3rem;font-weight:700;margin-bottom:0.75rem;">Overview</h3><p style="color:#888;line-height:1.7;">Get a comprehensive view of our platform and what makes it unique in the market.</p></div></section>`
      },
      {
        id: 'tabs-vertical',
        name: 'Vertical Tabs',
        category: 'tabs',
        description: 'Sidebar tab navigation',
        icon: 'Columns2',
        html: `<section style="display:flex;gap:1.5rem;padding:3rem 2rem;background:#111;color:#fff;"><div style="display:flex;flex-direction:column;gap:0.5rem;min-width:140px;"><button style="background:#7c3aed;color:#fff;padding:0.75rem 1rem;border:none;border-radius:0.5rem;font-weight:600;font-size:0.9rem;text-align:left;">Design</button><button style="background:#1a1a2e;color:#888;padding:0.75rem 1rem;border:none;border-radius:0.5rem;font-size:0.9rem;text-align:left;border:1px solid #2a2a3e;">Develop</button><button style="background:#1a1a2e;color:#888;padding:0.75rem 1rem;border:none;border-radius:0.5rem;font-size:0.9rem;text-align:left;border:1px solid #2a2a3e;">Deploy</button></div><div style="flex:1;background:#1a1a2e;border-radius:0.75rem;padding:2rem;border:1px solid #2a2a3e;"><h3 style="font-size:1.3rem;font-weight:700;margin-bottom:0.75rem;">Design Tools</h3><p style="color:#888;line-height:1.7;">Create stunning layouts with our intuitive design tools. From wireframes to polished pages.</p></div></section>`
      },
    ]
  },
  {
    id: 'marquee',
    name: 'Marquee',
    icon: 'LayoutList',
    components: [
      {
        id: 'marquee-logo',
        name: 'Logo Marquee',
        category: 'marquee',
        description: 'Scrolling logo/partner showcase',
        icon: 'LayoutList',
        html: `<section style="padding:2rem;background:#0a0a0a;color:#fff;overflow:hidden;"><h2 style="font-size:1rem;font-weight:600;text-align:center;color:#888;margin-bottom:1.5rem;">TRUSTED BY LEADING COMPANIES</h2><div style="display:flex;gap:3rem;animation:marqueeScroll 20s linear infinite;white-space:nowrap;"><style>@keyframes marqueeScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}</style><div style="background:#1a1a2e;padding:1rem 2rem;border-radius:0.5rem;border:1px solid #2a2a3e;font-weight:700;font-size:1.1rem;">Brand 1</div><div style="background:#1a1a2e;padding:1rem 2rem;border-radius:0.5rem;border:1px solid #2a2a3e;font-weight:700;font-size:1.1rem;">Brand 2</div><div style="background:#1a1a2e;padding:1rem 2rem;border-radius:0.5rem;border:1px solid #2a2a3e;font-weight:700;font-size:1.1rem;">Brand 3</div><div style="background:#1a1a2e;padding:1rem 2rem;border-radius:0.5rem;border:1px solid #2a2a3e;font-weight:700;font-size:1.1rem;">Brand 4</div><div style="background:#1a1a2e;padding:1rem 2rem;border-radius:0.5rem;border:1px solid #2a2a3e;font-weight:700;font-size:1.1rem;">Brand 5</div><div style="background:#1a1a2e;padding:1rem 2rem;border-radius:0.5rem;border:1px solid #2a2a3e;font-weight:700;font-size:1.1rem;">Brand 1</div><div style="background:#1a1a2e;padding:1rem 2rem;border-radius:0.5rem;border:1px solid #2a2a3e;font-weight:700;font-size:1.1rem;">Brand 2</div><div style="background:#1a1a2e;padding:1rem 2rem;border-radius:0.5rem;border:1px solid #2a2a3e;font-weight:700;font-size:1.1rem;">Brand 3</div><div style="background:#1a1a2e;padding:1rem 2rem;border-radius:0.5rem;border:1px solid #2a2a3e;font-weight:700;font-size:1.1rem;">Brand 4</div><div style="background:#1a1a2e;padding:1rem 2rem;border-radius:0.5rem;border:1px solid #2a2a3e;font-weight:700;font-size:1.1rem;">Brand 5</div></div></section>`
      },
    ]
  },
  {
    id: 'cookie-banner',
    name: 'Cookie Banner',
    icon: 'Shield',
    components: [
      {
        id: 'cookie-banner-default',
        name: 'Cookie Banner',
        category: 'cookie-banner',
        description: 'Standard cookie consent banner',
        icon: 'Shield',
        html: `<div style="position:fixed;bottom:0;left:0;right:0;background:#1a1a2e;color:#fff;padding:1rem 2rem;border-top:1px solid #2a2a3e;display:flex;justify-content:space-between;align-items:center;z-index:100;"><p style="font-size:0.9rem;color:#888;max-width:600px;">We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p><div style="display:flex;gap:0.5rem;"><button style="background:#2a2a3e;color:#888;padding:0.5rem 1rem;border:none;border-radius:0.5rem;font-size:0.9rem;">Decline</button><button style="background:#7c3aed;color:#fff;padding:0.5rem 1rem;border:none;border-radius:0.5rem;font-size:0.9rem;font-weight:600;">Accept All</button></div></div>`
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
    id: 'cta',
    name: 'Call to Action',
    icon: 'Megaphone',
    components: [
      {
        id: 'cta-banner',
        name: 'Banner CTA',
        category: 'cta',
        description: 'Full-width call-to-action banner',
        icon: 'Megaphone',
        html: `<section style="display:flex;flex-direction:column;align-items:center;padding:4rem 2rem;background:linear-gradient(135deg,#7c3aed,#2dd4bf);color:#fff;text-align:center;"><h2 style="font-size:2.5rem;font-weight:800;margin-bottom:1rem;">Ready to start building?</h2><p style="font-size:1.1rem;color:rgba(255,255,255,0.85);margin-bottom:2rem;max-width:500px;">Join thousands of creators who build with Forge.</p><button style="background:#fff;color:#7c3aed;padding:1rem 3rem;border:none;border-radius:0.5rem;cursor:pointer;font-weight:700;font-size:1.1rem;">Start Free Trial</button></section>`
      },
      {
        id: 'cta-popup',
        name: 'Popup CTA',
        category: 'cta',
        description: 'Floating call-to-action overlay',
        icon: 'Megaphone',
        html: `<div style="position:fixed;bottom:2rem;right:2rem;background:#1a1a2e;border:1px solid #2a2a3e;border-radius:1rem;padding:1.5rem;max-width:320px;color:#fff;z-index:50;box-shadow:0 20px 40px rgba(0,0,0,0.3);"><h3 style="font-size:1.2rem;font-weight:700;margin-bottom:0.5rem;">✨ Special Offer</h3><p style="color:#888;font-size:0.9rem;margin-bottom:1rem;">Get 50% off your first month. Limited time offer.</p><button style="background:#7c3aed;color:#fff;padding:0.5rem 1.5rem;border:none;border-radius:0.5rem;cursor:pointer;font-weight:600;width:100%;">Claim Offer</button></div>`
      },
      {
        id: 'cta-minimal',
        name: 'Minimal CTA',
        category: 'cta',
        description: 'Simple text-based call-to-action',
        icon: 'Megaphone',
        html: `<section style="display:flex;align-items:center;justify-content:center;gap:1.5rem;padding:2rem;background:#0a0a0a;color:#fff;"><p style="font-size:1.2rem;font-weight:600;">Start building today</p><a href="#" style="color:#7c3aed;font-weight:600;text-decoration:underline;">Get started →</a></section>`
      },
    ]
  },
  {
    id: 'stats',
    name: 'Stats',
    icon: 'BarChart3',
    components: [
      {
        id: 'stats-counter',
        name: 'Counter Section',
        category: 'stats',
        description: 'Animated number counters',
        icon: 'BarChart3',
        html: `<section style="display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem;padding:3rem 2rem;background:#0a0a0a;color:#fff;"><div style="text-align:center;"><div style="font-size:2.5rem;font-weight:800;color:#7c3aed;">10K+</div><div style="color:#888;font-size:0.9rem;margin-top:0.5rem;">Active Users</div></div><div style="text-align:center;"><div style="font-size:2.5rem;font-weight:800;color:#2dd4bf;">99.9%</div><div style="color:#888;font-size:0.9rem;margin-top:0.5rem;">Uptime</div></div><div style="text-align:center;"><div style="font-size:2.5rem;font-weight:800;color:#f472b6;">500+</div><div style="color:#888;font-size:0.9rem;margin-top:0.5rem;">Templates</div></div><div style="text-align:center;"><div style="font-size:2.5rem;font-weight:800;color:#fb923c;">24/7</div><div style="color:#888;font-size:0.9rem;margin-top:0.5rem;">Support</div></div></section>`
      },
      {
        id: 'stats-progress',
        name: 'Progress Bars',
        category: 'stats',
        description: 'Progress bar showcase',
        icon: 'BarChart3',
        html: `<section style="padding:3rem 2rem;background:#0a0a0a;color:#fff;max-width:600px;"><h3 style="font-size:1.5rem;font-weight:700;margin-bottom:2rem;">Our Progress</h3><div style="display:flex;flex-direction:column;gap:1.5rem;"><div><div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;"><span style="font-size:0.9rem;">Design</span><span style="color:#7c3aed;font-size:0.9rem;">95%</span></div><div style="background:#1a1a2e;border-radius:0.5rem;height:0.5rem;"><div style="background:#7c3aed;border-radius:0.5rem;height:100%;width:95%;"></div></div></div><div><div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;"><span style="font-size:0.9rem;">Development</span><span style="color:#2dd4bf;font-size:0.9rem;">88%</span></div><div style="background:#1a1a2e;border-radius:0.5rem;height:0.5rem;"><div style="background:#2dd4bf;border-radius:0.5rem;height:100%;width:88%;"></div></div></div><div><div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;"><span style="font-size:0.9rem;">Marketing</span><span style="color:#f472b6;font-size:0.9rem;">72%</span></div><div style="background:#1a1a2e;border-radius:0.5rem;height:0.5rem;"><div style="background:#f472b6;border-radius:0.5rem;height:100%;width:72%;"></div></div></div></div></section>`
      },
      {
        id: 'stats-achievements',
        name: 'Achievement Cards',
        category: 'stats',
        description: 'Milestone achievement display',
        icon: 'BarChart3',
        html: `<section style="display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;padding:3rem 2rem;background:#0a0a0a;color:#fff;max-width:500px;"><div style="background:#1a1a2e;border-radius:0.75rem;padding:1.5rem;border:1px solid #2a2a3e;text-align:center;"><div style="font-size:2rem;margin-bottom:0.5rem;">🏆</div><div style="font-weight:700;">Best Design Tool 2025</div><div style="color:#888;font-size:0.8rem;">Product Hunt Awards</div></div><div style="background:#1a1a2e;border-radius:0.75rem;padding:1.5rem;border:1px solid #2a2a3e;text-align:center;"><div style="font-size:2rem;margin-bottom:0.5rem;">⭐</div><div style="font-weight:700;">4.9/5 Rating</div><div style="color:#888;font-size:0.8rem;">10,000+ Reviews</div></div><div style="background:#1a1a2e;border-radius:0.75rem;padding:1.5rem;border:1px solid #2a2a3e;text-align:center;"><div style="font-size:2rem;margin-bottom:0.5rem;">🚀</div><div style="font-weight:700;">#1 on App Store</div><div style="color:#888;font-size:0.8rem;">Developer Tools</div></div><div style="background:#1a1a2e;border-radius:0.75rem;padding:1.5rem;border:1px solid #2a2a3e;text-align:center;"><div style="font-size:2rem;margin-bottom:0.5rem;">🌍</div><div style="font-weight:700;">50+ Countries</div><div style="color:#888;font-size:0.8rem;">Global Reach</div></div></section>`
      },
    ]
  },
  {
    id: 'timeline',
    name: 'Timeline',
    icon: 'GitBranch',
    components: [
      {
        id: 'timeline-vertical',
        name: 'Vertical Timeline',
        category: 'timeline',
        description: 'Vertical event timeline',
        icon: 'GitBranch',
        html: `<section style="padding:3rem 2rem;background:#0a0a0a;color:#fff;max-width:600px;"><h2 style="font-size:2rem;font-weight:700;margin-bottom:2rem;">Our Journey</h2><div style="display:flex;flex-direction:column;gap:2rem;"><div style="display:flex;gap:1rem;"><div style="width:3px;background:#7c3aed;flex-shrink:0;"></div><div><div style="font-size:0.8rem;color:#7c3aed;font-weight:600;margin-bottom:0.25rem;">2023</div><div style="font-weight:700;margin-bottom:0.5rem;">Founded</div><div style="color:#888;font-size:0.9rem;line-height:1.6;">Started with a vision to democratize web creation.</div></div></div><div style="display:flex;gap:1rem;"><div style="width:3px;background:#2dd4bf;flex-shrink:0;"></div><div><div style="font-size:0.8rem;color:#2dd4bf;font-weight:600;margin-bottom:0.25rem;">2024</div><div style="font-weight:700;margin-bottom:0.5rem;">AI Integration</div><div style="color:#888;font-size:0.9rem;line-height:1.6;">Launched AI-powered generation, serving 10K+ users.</div></div></div><div style="display:flex;gap:1rem;"><div style="width:3px;background:#f472b6;flex-shrink:0;"></div><div><div style="font-size:0.8rem;color:#f472b6;font-weight:600;margin-bottom:0.25rem;">2025</div><div style="font-weight:700;margin-bottom:0.5rem;">Global Expansion</div><div style="color:#888;font-size:0.9rem;line-height:1.6;">Now available in 50+ countries with full export support.</div></div></div></div></section>`
      },
      {
        id: 'timeline-horizontal',
        name: 'Horizontal Timeline',
        category: 'timeline',
        description: 'Horizontal process timeline',
        icon: 'GitBranch',
        html: `<section style="padding:3rem 2rem;background:#0a0a0a;color:#fff;"><h2 style="font-size:2rem;font-weight:700;margin-bottom:2rem;text-align:center;">How it Works</h2><div style="display:flex;justify-content:center;gap:2rem;position:relative;"><div style="text-align:center;max-width:180px;"><div style="width:3rem;height:3rem;background:#7c3aed;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;font-weight:700;color:#fff;">1</div><div style="font-weight:700;margin-bottom:0.5rem;">Describe</div><div style="color:#888;font-size:0.85rem;">Tell us about your project and vision.</div></div><div style="text-align:center;max-width:180px;"><div style="width:3rem;height:3rem;background:#2dd4bf;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;font-weight:700;color:#fff;">2</div><div style="font-weight:700;margin-bottom:0.5rem;">Generate</div><div style="color:#888;font-size:0.85rem;">AI creates your complete website.</div></div><div style="text-align:center;max-width:180px;"><div style="width:3rem;height:3rem;background:#f472b6;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;font-weight:700;color:#fff;">3</div><div style="font-weight:700;margin-bottom:0.5rem;">Edit</div><div style="color:#888;font-size:0.85rem;">Customize every detail visually.</div></div><div style="text-align:center;max-width:180px;"><div style="width:3rem;height:3rem;background:#fb923c;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;font-weight:700;color:#fff;">4</div><div style="font-weight:700;margin-bottom:0.5rem;">Deploy</div><div style="color:#888;font-size:0.85rem;">Export and launch your site.</div></div></div></section>`
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
