'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, type BuilderPhase } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { toast } from '@/hooks/use-toast'
import {
  Sparkles, Wand2, Monitor, Smartphone, Tablet, Code2, Rocket,
  Download, Eye, ArrowLeft, ArrowRight, RefreshCw, Save, X,
  ChevronRight, Zap, Layers, Palette, Type, Layout, Grid3X3,
  Loader2
} from 'lucide-react'

// ─── Template Generators ───────────────────────────────────────────────────

function generateCoffeeShopHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ember & Roast — Craft Coffee</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --brown-900: #1a0e07;
    --brown-800: #2d1810;
    --brown-700: #4a2c1a;
    --brown-600: #6b3d24;
    --brown-500: #8b5e3c;
    --brown-400: #a67c52;
    --brown-300: #c4a06a;
    --brown-200: #dbc4a0;
    --brown-100: #f0e6d3;
    --brown-50: #faf5ed;
    --cream: #fff8f0;
    --gold: #d4a853;
    --gold-light: #e8c97a;
    --espresso: #3c2415;
  }

  body {
    font-family: 'Inter', sans-serif;
    background: var(--cream);
    color: var(--brown-800);
    overflow-x: hidden;
  }

  .fade-in {
    animation: fadeIn 0.8s ease-out forwards;
    opacity: 0;
  }

  .slide-up {
    animation: slideUp 0.6s ease-out forwards;
    opacity: 0;
    transform: translateY(30px);
  }

  @keyframes fadeIn { to { opacity: 1; } }
  @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
  @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px rgba(212,168,83,0.3); } 50% { box-shadow: 0 0 40px rgba(212,168,83,0.6); } }

  /* Navigation */
  .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: rgba(26,14,7,0.95);
    backdrop-filter: blur(20px);
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.3s ease;
  }

  .nav-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--gold);
    letter-spacing: 0.02em;
  }

  .nav-links { display: flex; gap: 2rem; list-style: none; }
  .nav-links a {
    color: var(--brown-200);
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    transition: color 0.3s;
    position: relative;
  }
  .nav-links a::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--gold);
    transition: width 0.3s;
  }
  .nav-links a:hover { color: var(--gold); }
  .nav-links a:hover::after { width: 100%; }

  /* Hero */
  .hero {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--brown-900) 0%, var(--espresso) 40%, var(--brown-700) 100%);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
  }

  .hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(ellipse at 30% 50%, rgba(212,168,83,0.15) 0%, transparent 70%);
  }

  .hero-particles {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }

  .particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: var(--gold);
    border-radius: 50%;
    opacity: 0.3;
    animation: float 3s ease-in-out infinite;
  }

  .hero-content { position: relative; z-index: 2; max-width: 800px; padding: 2rem; }

  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 4.5rem;
    font-weight: 700;
    color: var(--cream);
    line-height: 1.1;
    margin-bottom: 1.5rem;
  }

  .hero-subtitle {
    font-size: 1.25rem;
    color: var(--brown-200);
    line-height: 1.6;
    margin-bottom: 2rem;
    font-weight: 300;
  }

  .hero-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2.5rem;
    background: linear-gradient(135deg, var(--gold), var(--gold-light));
    color: var(--brown-900);
    font-weight: 600;
    font-size: 1rem;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s;
    animation: pulse-glow 2s ease-in-out infinite;
  }

  .hero-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(212,168,83,0.4);
  }

  /* Section styles */
  .section {
    padding: 6rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--brown-800);
    margin-bottom: 0.5rem;
  }

  .section-subtitle {
    color: var(--brown-400);
    font-size: 1rem;
    margin-bottom: 3rem;
    font-weight: 400;
  }

  /* Menu */
  .menu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
  }

  .menu-item {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
  }

  .menu-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 40px rgba(0,0,0,0.12);
  }

  .menu-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--gold), var(--brown-400));
  }

  .menu-category {
    font-size: 0.75rem;
    color: var(--gold);
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  .menu-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--brown-800);
    margin-bottom: 0.5rem;
  }

  .menu-desc {
    font-size: 0.85rem;
    color: var(--brown-400);
    line-height: 1.5;
    margin-bottom: 1rem;
  }

  .menu-price {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--gold);
  }

  /* About */
  .about-section {
    background: var(--brown-900);
    color: var(--cream);
    padding: 6rem 2rem;
  }

  .about-grid {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }

  .about-image-placeholder {
    background: linear-gradient(135deg, var(--brown-700), var(--brown-600));
    border-radius: 20px;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    color: var(--gold);
    animation: float 4s ease-in-out infinite;
  }

  .about-text h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    color: var(--gold);
  }

  .about-text p {
    color: var(--brown-200);
    line-height: 1.8;
    margin-bottom: 1rem;
    font-weight: 300;
  }

  /* Hours & Location */
  .info-section {
    background: var(--brown-50);
    padding: 6rem 2rem;
  }

  .info-grid {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }

  .info-card {
    background: white;
    border-radius: 20px;
    padding: 2.5rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  }

  .info-card h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    color: var(--brown-800);
    margin-bottom: 1rem;
  }

  .hours-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .hours-list li {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    color: var(--brown-500);
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--brown-100);
  }

  .hours-list li span:first-child { font-weight: 500; color: var(--brown-800); }

  .contact-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .contact-item {
    font-size: 0.9rem;
    color: var(--brown-500);
    line-height: 1.6;
  }

  .contact-item strong {
    color: var(--brown-800);
    font-weight: 600;
  }

  /* Footer */
  .footer {
    background: var(--brown-900);
    color: var(--brown-200);
    padding: 3rem 2rem;
    text-align: center;
  }

  .footer-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    color: var(--gold);
    margin-bottom: 1rem;
  }

  .footer-links {
    display: flex;
    gap: 2rem;
    justify-content: center;
    list-style: none;
    margin-bottom: 2rem;
  }

  .footer-links a {
    color: var(--brown-300);
    text-decoration: none;
    font-size: 0.85rem;
    transition: color 0.3s;
  }

  .footer-links a:hover { color: var(--gold); }

  .footer-copy {
    font-size: 0.75rem;
    color: var(--brown-400);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .nav-links { display: none; }
    .hero-title { font-size: 2.5rem; }
    .hero-subtitle { font-size: 1rem; }
    .about-grid { grid-template-columns: 1fr; }
    .info-grid { grid-template-columns: 1fr; }
    .menu-grid { grid-template-columns: 1fr; }
    .section-title { font-size: 2rem; }
  }

  @media (max-width: 480px) {
    .hero-title { font-size: 2rem; }
    .section { padding: 3rem 1rem; }
  }
</style>
</head>
<body>

<!-- Navigation -->
<nav class="nav">
  <div class="nav-logo">Ember & Roast</div>
  <ul class="nav-links">
    <li><a href="#menu">Menu</a></li>
    <li><a href="#about">Our Story</a></li>
    <li><a href="#hours">Hours</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>

<!-- Hero -->
<section class="hero">
  <div class="hero-particles">
    <div class="particle" style="top:20%;left:10%;animation-delay:0s;"></div>
    <div class="particle" style="top:40%;left:80%;animation-delay:1s;"></div>
    <div class="particle" style="top:70%;left:30%;animation-delay:2s;"></div>
    <div class="particle" style="top:30%;left:60%;animation-delay:0.5s;width:6px;height:6px;"></div>
    <div class="particle" style="top:60%;left:50%;animation-delay:1.5s;"></div>
  </div>
  <div class="hero-content slide-up">
    <h1 class="hero-title">Craft Coffee,<br>Warm Moments</h1>
    <p class="hero-subtitle">Every cup tells a story. From single-origin beans sourced across three continents to the gentle pour of our master baristas — experience coffee the way it was meant to be.</p>
    <button class="hero-cta">Visit Us Today &#10140;</button>
  </div>
</section>

<!-- Menu -->
<section class="section" id="menu">
  <h2 class="section-title slide-up">Our Menu</h2>
  <p class="section-subtitle slide-up">Handcrafted beverages and pastries made with love</p>
  <div class="menu-grid">
    <div class="menu-item slide-up" style="animation-delay:0.1s">
      <div class="menu-category">Espresso</div>
      <div class="menu-name">Classic Espresso</div>
      <div class="menu-desc">Rich, full-bodied shot pulled from our La Marzocca. The foundation of everything we craft.</div>
      <div class="menu-price">$3.50</div>
    </div>
    <div class="menu-item slide-up" style="animation-delay:0.2s">
      <div class="menu-category">Espresso</div>
      <div class="menu-name">Caramel Macchiato</div>
      <div class="menu-desc">Vanilla-infused steamed milk marked with espresso and drizzled with housemade caramel sauce.</div>
      <div class="menu-price">$5.75</div>
    </div>
    <div class="menu-item slide-up" style="animation-delay:0.3s">
      <div class="menu-category">Specialty</div>
      <div class="menu-name">Ember Latte</div>
      <div class="menu-desc">Our signature — smoky brown sugar, oat milk, espresso, and a whisper of cardamom.</div>
      <div class="menu-price">$6.25</div>
    </div>
    <div class="menu-item slide-up" style="animation-delay:0.4s">
      <div class="menu-category">Cold Brew</div>
      <div class="menu-name">Nitro Cold Brew</div>
      <div class="menu-desc">20-hour steeped cold brew infused with nitrogen for a velvety, cascading pour.</div>
      <div class="menu-price">$5.00</div>
    </div>
    <div class="menu-item slide-up" style="animation-delay:0.5s">
      <div class="menu-category">Pastry</div>
      <div class="menu-name">Almond Croissant</div>
      <div class="menu-desc">Twice-baked golden croissant filled with almond cream and dusted with powdered sugar.</div>
      <div class="menu-price">$4.50</div>
    </div>
    <div class="menu-item slide-up" style="animation-delay:0.6s">
      <div class="menu-category">Pastry</div>
      <div class="menu-name">Cinnamon Swirl</div>
      <div class="menu-desc">House-baked cinnamon roll with brown sugar glaze — warm from the oven every morning.</div>
      <div class="menu-price">$3.75</div>
    </div>
  </div>
</section>

<!-- About -->
<section class="about-section" id="about">
  <div class="about-grid">
    <div class="about-image-placeholder slide-up">Est. 2018</div>
    <div class="about-text slide-up">
      <h2>Our Story</h2>
      <p>Ember & Roast began as a dream shared by two friends who believed coffee could be more than a morning ritual — it could be an art form. We source beans directly from farmers in Colombia, Ethiopia, and Sumatra, ensuring every harvest is treated with the respect it deserves.</p>
      <p>Our roastery operates just behind the café, so the aroma of freshly roasted beans drifts through the space from dawn to dusk. We believe transparency, sustainability, and craftsmanship make every cup worth savoring.</p>
    </div>
  </div>
</section>

<!-- Hours & Contact -->
<section class="info-section" id="hours">
  <div class="info-grid">
    <div class="info-card slide-up">
      <h3>Opening Hours</h3>
      <ul class="hours-list">
        <li><span>Monday — Friday</span><span>6:30 AM — 8:00 PM</span></li>
        <li><span>Saturday</span><span>7:00 AM — 9:00 PM</span></li>
        <li><span>Sunday</span><span>8:00 AM — 6:00 PM</span></li>
      </ul>
    </div>
    <div class="info-card slide-up" id="contact">
      <h3>Get in Touch</h3>
      <div class="contact-info">
        <div class="contact-item"><strong>Address</strong><br>247 Oak Street, Portland, OR 97201</div>
        <div class="contact-item"><strong>Phone</strong><br>(503) 555-0147</div>
        <div class="contact-item"><strong>Email</strong><br>hello@emberandroast.com</div>
        <div class="contact-item"><strong>Follow Us</strong><br>@emberandroast on Instagram & Twitter</div>
      </div>
    </div>
  </div>
</section>

<!-- Footer -->
<footer class="footer">
  <div class="footer-logo">Ember & Roast</div>
  <ul class="footer-links">
    <li><a href="#menu">Menu</a></li>
    <li><a href="#about">Story</a></li>
    <li><a href="#hours">Hours</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
  <div class="footer-copy">&copy; 2025 Ember & Roast Craft Coffee. All rights reserved.</div>
</footer>

</body>
</html>`
}

function generatePortfolioHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mira Solano — Visual Storyteller</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --dark: #0a0a0a;
    --dark-2: #141414;
    --dark-3: #1e1e1e;
    --dark-4: #2a2a2a;
    --gray-1: #3a3a3a;
    --gray-2: #5a5a5a;
    --gray-3: #7a7a7a;
    --gray-4: #9a9a9a;
    --gray-5: #c0c0c0;
    --light: #f5f5f5;
    --white: #ffffff;
    --accent: #e85d75;
    --accent-light: #ff8fa3;
    --accent-dark: #c44058;
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--dark);
    color: var(--light);
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  @keyframes fadeIn { to { opacity: 1; } }
  @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
  @keyframes scaleIn { to { opacity: 1; transform: scale(1); } }
  @keyframes slideInLeft { to { opacity: 1; transform: translateX(0); } }
  @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }

  .slide-up {
    animation: slideUp 0.7s ease-out forwards;
    opacity: 0;
    transform: translateY(40px);
  }

  .scale-in {
    animation: scaleIn 0.5s ease-out forwards;
    opacity: 0;
    transform: scale(0.95);
  }

  /* Navigation */
  .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    padding: 1.5rem 3rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(10,10,10,0.8);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .nav-name {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--white);
    letter-spacing: 0.02em;
  }

  .nav-links { display: flex; gap: 2rem; list-style: none; }
  .nav-links a {
    color: var(--gray-4);
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    transition: color 0.3s;
  }
  .nav-links a:hover { color: var(--accent-light); }

  /* Hero */
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding: 8rem 3rem 4rem;
    position: relative;
  }

  .hero-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 80% 20%, rgba(232,93,117,0.08) 0%, transparent 50%),
                radial-gradient(circle at 20% 80%, rgba(232,93,117,0.04) 0%, transparent 50%);
  }

  .hero-inner {
    max-width: 900px;
    position: relative;
    z-index: 2;
  }

  .hero-label {
    font-size: 0.75rem;
    color: var(--accent);
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
  }

  .hero-heading {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 5rem;
    font-weight: 700;
    line-height: 1.05;
    color: var(--white);
    margin-bottom: 2rem;
  }

  .hero-heading span {
    color: var(--accent);
  }

  .hero-desc {
    font-size: 1.1rem;
    color: var(--gray-3);
    line-height: 1.7;
    max-width: 600px;
    margin-bottom: 3rem;
  }

  .hero-actions { display: flex; gap: 1rem; }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.85rem 2rem;
    background: var(--accent);
    color: var(--white);
    font-weight: 600;
    font-size: 0.9rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .btn-primary:hover {
    background: var(--accent-light);
    transform: translateY(-2px);
  }

  .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.85rem 2rem;
    background: transparent;
    color: var(--gray-4);
    font-weight: 500;
    font-size: 0.9rem;
    border: 1px solid var(--gray-1);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .btn-secondary:hover {
    border-color: var(--gray-3);
    color: var(--white);
  }

  /* Projects */
  .projects-section {
    padding: 6rem 3rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;
  }

  .section-header h2 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 2rem;
    font-weight: 700;
    color: var(--white);
  }

  .section-header .view-all {
    color: var(--accent);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.3s;
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  .project-card {
    background: var(--dark-2);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.4s;
    cursor: pointer;
    border: 1px solid var(--dark-4);
  }

  .project-card:hover {
    transform: translateY(-6px);
    border-color: var(--accent);
    box-shadow: 0 12px 40px rgba(232,93,117,0.15);
  }

  .project-thumb {
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .project-thumb-bg {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 3rem;
    font-weight: 700;
  }

  .project-info { padding: 1.5rem; }
  .project-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--white);
    margin-bottom: 0.5rem;
  }
  .project-tags {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  .project-tag {
    font-size: 0.7rem;
    padding: 0.25rem 0.75rem;
    background: var(--dark-4);
    color: var(--gray-4);
    border-radius: 4px;
    font-weight: 500;
  }

  /* Skills */
  .skills-section {
    padding: 4rem 3rem;
    max-width: 1200px;
    margin: 0 auto;
    border-top: 1px solid var(--dark-4);
  }

  .skills-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }

  .skill-item {
    text-align: center;
    padding: 2rem;
    background: var(--dark-2);
    border-radius: 12px;
    border: 1px solid var(--dark-4);
    transition: all 0.3s;
  }

  .skill-item:hover {
    border-color: var(--accent);
    background: var(--dark-3);
  }

  .skill-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .skill-name {
    font-weight: 600;
    color: var(--white);
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }

  .skill-desc {
    color: var(--gray-3);
    font-size: 0.75rem;
  }

  /* About */
  .about-section {
    padding: 6rem 3rem;
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 4rem;
    border-top: 1px solid var(--dark-4);
  }

  .about-avatar {
    background: linear-gradient(135deg, var(--accent-dark), var(--accent));
    border-radius: 20px;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 4rem;
    color: var(--white);
  }

  .about-content h2 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 2rem;
    color: var(--white);
    margin-bottom: 1.5rem;
  }

  .about-content p {
    color: var(--gray-3);
    line-height: 1.8;
    margin-bottom: 1rem;
  }

  .about-stats {
    display: flex;
    gap: 2rem;
    margin-top: 2rem;
  }

  .stat {
    text-align: center;
  }

  .stat-num {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 2rem;
    font-weight: 700;
    color: var(--accent);
  }

  .stat-label {
    font-size: 0.75rem;
    color: var(--gray-4);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  /* Contact */
  .contact-section {
    padding: 6rem 3rem;
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
    border-top: 1px solid var(--dark-4);
  }

  .contact-section h2 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 2.5rem;
    color: var(--white);
    margin-bottom: 1rem;
  }

  .contact-section p {
    color: var(--gray-3);
    margin-bottom: 3rem;
  }

  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 500px;
    margin: 0 auto;
  }

  .contact-input {
    padding: 1rem;
    background: var(--dark-3);
    border: 1px solid var(--dark-4);
    border-radius: 8px;
    color: var(--white);
    font-size: 0.9rem;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.3s;
  }

  .contact-input:focus {
    outline: none;
    border-color: var(--accent);
  }

  .contact-input::placeholder { color: var(--gray-2); }

  /* Footer */
  .footer {
    padding: 3rem;
    text-align: center;
    border-top: 1px solid var(--dark-4);
  }

  .footer-copy {
    color: var(--gray-2);
    font-size: 0.75rem;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .nav-links { display: none; }
    .hero-heading { font-size: 3rem; }
    .projects-grid { grid-template-columns: 1fr; }
    .skills-grid { grid-template-columns: repeat(2, 1fr); }
    .about-section { grid-template-columns: 1fr; }
    .nav { padding: 1rem; }
    .hero { padding: 6rem 1.5rem 3rem; }
    .section { padding: 3rem 1.5rem; }
  }
</style>
</head>
<body>

<!-- Navigation -->
<nav class="nav">
  <div class="nav-name">Mira Solano</div>
  <ul class="nav-links">
    <li><a href="#work">Work</a></li>
    <li><a href="#skills">Skills</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>

<!-- Hero -->
<section class="hero">
  <div class="hero-bg"></div>
  <div class="hero-inner slide-up">
    <div class="hero-label">Visual Storyteller &amp; Creative Director</div>
    <h1 class="hero-heading">I create worlds<br>that <span>captivate</span></h1>
    <p class="hero-desc">With over a decade of experience in visual storytelling, I craft immersive brand experiences through photography, design, and creative direction that resonate deeply with audiences.</p>
    <div class="hero-actions">
      <button class="btn-primary">View My Work &#10140;</button>
      <button class="btn-secondary">Get in Touch</button>
    </div>
  </div>
</section>

<!-- Projects -->
<section class="projects-section" id="work">
  <div class="section-header">
    <h2 class="slide-up">Selected Work</h2>
    <span class="view-all">View All Projects &#10140;</span>
  </div>
  <div class="projects-grid">
    <div class="project-card slide-up" style="animation-delay:0.1s">
      <div class="project-thumb">
        <div class="project-thumb-bg" style="background:linear-gradient(135deg,#1a1a2e,#16213e);color:#e85d75;">AE</div>
      </div>
      <div class="project-info">
        <div class="project-title">Aurora Entertainment</div>
        <div class="project-tags">
          <span class="project-tag">Brand Identity</span>
          <span class="project-tag">Photography</span>
        </div>
      </div>
    </div>
    <div class="project-card slide-up" style="animation-delay:0.2s">
      <div class="project-thumb">
        <div class="project-thumb-bg" style="background:linear-gradient(135deg,#0f3460,#533483);color:#f0c27f;">WL</div>
      </div>
      <div class="project-info">
        <div class="project-title">Wilderness Lodge</div>
        <div class="project-tags">
          <span class="project-tag">Campaign</span>
          <span class="project-tag">Art Direction</span>
        </div>
      </div>
    </div>
    <div class="project-card slide-up" style="animation-delay:0.3s">
      <div class="project-thumb">
        <div class="project-thumb-bg" style="background:linear-gradient(135deg,#2d1b69,#11998e);color:#fff;">NT</div>
      </div>
      <div class="project-info">
        <div class="project-title">Nexus Technologies</div>
        <div class="project-tags">
          <span class="project-tag">Web Design</span>
          <span class="project-tag">UI/UX</span>
        </div>
      </div>
    </div>
    <div class="project-card slide-up" style="animation-delay:0.4s">
      <div class="project-thumb">
        <div class="project-thumb-bg" style="background:linear-gradient(135deg,#e85d75,#c44058);color:#fff;">SK</div>
      </div>
      <div class="project-info">
        <div class="project-title">Sakura Fashion</div>
        <div class="project-tags">
          <span class="project-tag">Editorial</span>
          <span class="project-tag">Photography</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Skills -->
<section class="skills-section" id="skills">
  <div class="skills-grid">
    <div class="skill-item slide-up">
      <div class="skill-icon">&#127912;</div>
      <div class="skill-name">Creative Direction</div>
      <div class="skill-desc">Vision to execution</div>
    </div>
    <div class="skill-item slide-up" style="animation-delay:0.1s">
      <div class="skill-icon">&#128247;</div>
      <div class="skill-name">Photography</div>
      <div class="skill-desc">Editorial & commercial</div>
    </div>
    <div class="skill-item slide-up" style="animation-delay:0.2s">
      <div class="skill-icon">&#9999;&#65039;</div>
      <div class="skill-name">Brand Identity</div>
      <div class="skill-desc">Logos & systems</div>
    </div>
    <div class="skill-item slide-up" style="animation-delay:0.3s">
      <div class="skill-icon">&#127916;</div>
      <div class="skill-name">Motion Design</div>
      <div class="skill-desc">Animation & video</div>
    </div>
  </div>
</section>

<!-- About -->
<section class="about-section" id="about">
  <div class="about-avatar slide-up">MS</div>
  <div class="about-content slide-up">
    <h2>About Mira</h2>
    <p>I'm a visual storyteller based in New York City with 12 years of experience shaping how brands connect with people through imagery and design. My work spans editorial photography, brand identity systems, and creative campaign direction.</p>
    <p>I believe every brand has a story worth telling beautifully. Whether it's a startup finding its voice or an established company refreshing its presence, I approach each project with curiosity, craftsmanship, and strategic thinking.</p>
    <div class="about-stats">
      <div class="stat"><div class="stat-num">120+</div><div class="stat-label">Projects</div></div>
      <div class="stat"><div class="stat-num">12</div><div class="stat-label">Years</div></div>
      <div class="stat"><div class="stat-num">40+</div><div class="stat-label">Clients</div></div>
    </div>
  </div>
</section>

<!-- Contact -->
<section class="contact-section" id="contact">
  <h2 class="slide-up">Let's Create Together</h2>
  <p class="slide-up">Have a project in mind? I'd love to hear about it.</p>
  <div class="contact-form slide-up">
    <input class="contact-input" placeholder="Your name" type="text">
    <input class="contact-input" placeholder="Your email" type="email">
    <textarea class="contact-input" placeholder="Tell me about your project..." rows="5" style="resize:none;"></textarea>
    <button class="btn-primary" style="width:100%;justify-content:center;">Send Message &#10140;</button>
  </div>
</section>

<!-- Footer -->
<footer class="footer">
  <div class="footer-copy">&copy; 2025 Mira Solano. Crafted with passion.</div>
</footer>

</body>
</html>`
}

function generateSaaSHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NovaPulse — Intelligent Workflow Automation</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #060611;
    --bg-2: #0c0c1d;
    --bg-3: #121228;
    --bg-4: #1a1a3a;
    --border: rgba(255,255,255,0.06);
    --border-hover: rgba(255,255,255,0.12);
    --text: #f0f0f8;
    --text-2: #b8b8d0;
    --text-3: #8888a8;
    --text-4: #5a5a78;
    --accent: #6c5ce7;
    --accent-2: #a855f7;
    --accent-3: #06b6d4;
    --accent-4: #3b82f6;
    --gradient-1: linear-gradient(135deg, #6c5ce7, #a855f7);
    --gradient-2: linear-gradient(135deg, #06b6d4, #6c5ce7);
    --gradient-3: linear-gradient(135deg, #a855f7, #ec4899);
    --gradient-hero: linear-gradient(135deg, #6c5ce7 0%, #a855f7 30%, #06b6d4 70%, #3b82f6 100%);
  }

  body {
    font-family: 'Inter', sans-serif;
    background: var(--bg);
    color: var(--text);
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  @keyframes fadeIn { to { opacity: 1; } }
  @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
  @keyframes scaleUp { to { opacity: 1; transform: scale(1); } }
  @keyframes gradientMove { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
  @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
  @keyframes orbit { 0% { transform: rotate(0deg) translateX(120px) rotate(0deg); } 100% { transform: rotate(360deg) translateX(120px) rotate(-360deg); } }

  .slide-up { animation: slideUp 0.7s ease-out forwards; opacity: 0; transform: translateY(40px); }
  .fade-in { animation: fadeIn 0.6s ease-out forwards; opacity: 0; }

  /* Nav */
  .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(6,6,17,0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
  }

  .nav-brand {
    font-weight: 800;
    font-size: 1.2rem;
    background: var(--gradient-1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .nav-links { display: flex; gap: 2rem; list-style: none; align-items: center; }
  .nav-links a {
    color: var(--text-3);
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 500;
    transition: color 0.3s;
  }
  .nav-links a:hover { color: var(--text); }

  .nav-cta {
    padding: 0.5rem 1.25rem;
    background: var(--gradient-1);
    color: white;
    font-weight: 600;
    font-size: 0.85rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .nav-cta:hover { opacity: 0.9; transform: translateY(-1px); }

  /* Hero */
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
    padding: 4rem 2rem;
    overflow: hidden;
  }

  .hero-bg {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(ellipse at 50% 50%, rgba(108,92,231,0.12) 0%, transparent 50%);
    animation: pulse 4s ease-in-out infinite;
  }

  .hero-orbs {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
  }

  .orb {
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    filter: blur(80px);
    animation: orbit 20s linear infinite;
  }

  .orb-1 { background: rgba(108,92,231,0.15); animation-delay: 0s; }
  .orb-2 { background: rgba(168,85,247,0.12); animation-delay: -7s; }
  .orb-3 { background: rgba(6,182,212,0.10); animation-delay: -14s; }

  .hero-inner {
    position: relative;
    z-index: 2;
    max-width: 900px;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--bg-3);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-size: 0.75rem;
    color: var(--accent-2);
    font-weight: 500;
    margin-bottom: 2rem;
  }

  .hero-badge-dot {
    width: 6px;
    height: 6px;
    background: var(--accent-2);
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }

  .hero-title {
    font-size: 4rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 1.5rem;
  }

  .hero-title-gradient {
    background: var(--gradient-hero);
    background-size: 200% 200%;
    animation: gradientMove 4s ease infinite;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-desc {
    font-size: 1.15rem;
    color: var(--text-3);
    line-height: 1.7;
    max-width: 640px;
    margin: 0 auto 3rem;
  }

  .hero-ctas { display: flex; gap: 1rem; justify-content: center; }

  .btn-glow {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.9rem 2rem;
    background: var(--gradient-1);
    color: white;
    font-weight: 600;
    font-size: 0.95rem;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
  }

  .btn-glow::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: var(--gradient-1);
    border-radius: 12px;
    filter: blur(12px);
    opacity: 0.4;
    transition: opacity 0.3s;
    z-index: -1;
  }

  .btn-glow:hover::before { opacity: 0.6; }
  .btn-glow:hover { transform: translateY(-2px); }

  .btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.9rem 2rem;
    background: var(--bg-3);
    color: var(--text-2);
    font-weight: 500;
    font-size: 0.95rem;
    border: 1px solid var(--border);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .btn-ghost:hover { border-color: var(--border-hover); color: var(--text); }

  /* Features */
  .features {
    padding: 6rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .features-header { text-align: center; margin-bottom: 4rem; }

  .features-header h2 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .features-header p {
    color: var(--text-3);
    font-size: 1.05rem;
    max-width: 560px;
    margin: 0 auto;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  .feature-card {
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 2rem;
    transition: all 0.4s;
  }

  .feature-card:hover {
    border-color: var(--accent);
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(108,92,231,0.15);
  }

  .feature-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .feature-name {
    font-weight: 600;
    font-size: 1.05rem;
    color: var(--text);
    margin-bottom: 0.75rem;
  }

  .feature-desc {
    color: var(--text-3);
    font-size: 0.85rem;
    line-height: 1.6;
  }

  /* Stats */
  .stats-bar {
    padding: 4rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }

  .stat-item { text-align: center; }

  .stat-number {
    font-family: 'JetBrains Mono', monospace;
    font-size: 2.5rem;
    font-weight: 700;
    background: var(--gradient-1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .stat-label {
    color: var(--text-4);
    font-size: 0.85rem;
    font-weight: 500;
    margin-top: 0.5rem;
  }

  /* Pricing */
  .pricing {
    padding: 6rem 2rem;
    max-width: 1100px;
    margin: 0 auto;
  }

  .pricing-header { text-align: center; margin-bottom: 4rem; }

  .pricing-header h2 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
  }

  .pricing-header p {
    color: var(--text-3);
    font-size: 1rem;
  }

  .pricing-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  .pricing-card {
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 2.5rem;
    transition: all 0.4s;
    position: relative;
  }

  .pricing-card:hover { border-color: var(--border-hover); }

  .pricing-card.popular {
    border-color: var(--accent);
    background: var(--bg-3);
  }

  .pricing-card.popular::before {
    content: 'Most Popular';
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.25rem 1rem;
    background: var(--gradient-1);
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 100px;
  }

  .pricing-tier {
    font-size: 0.85rem;
    color: var(--text-4);
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 0.75rem;
  }

  .pricing-amount {
    font-family: 'JetBrains Mono', monospace;
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .pricing-period {
    font-size: 0.85rem;
    color: var(--text-4);
    margin-bottom: 2rem;
  }

  .pricing-features {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }

  .pricing-features li {
    font-size: 0.85rem;
    color: var(--text-2);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .pricing-features li::before {
    content: '&#10003;';
    color: var(--accent-2);
    font-weight: 600;
  }

  .pricing-btn {
    width: 100%;
    padding: 0.85rem;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s;
    background: var(--bg-4);
    color: var(--text-2);
  }

  .pricing-btn:hover { background: var(--bg-3); color: var(--text); }

  .pricing-card.popular .pricing-btn {
    background: var(--gradient-1);
    color: white;
  }

  /* CTA */
  .cta-section {
    padding: 8rem 2rem;
    text-align: center;
    position: relative;
  }

  .cta-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(ellipse at 50% 50%, rgba(108,92,231,0.15) 0%, transparent 60%);
  }

  .cta-inner {
    position: relative;
    z-index: 2;
    max-width: 700px;
    margin: 0 auto;
  }

  .cta-inner h2 {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 1rem;
  }

  .cta-inner p {
    color: var(--text-3);
    font-size: 1.1rem;
    margin-bottom: 3rem;
  }

  /* Footer */
  .footer {
    padding: 3rem 2rem;
    border-top: 1px solid var(--border);
    text-align: center;
  }

  .footer-brand {
    font-weight: 800;
    background: var(--gradient-1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }

  .footer-links {
    display: flex;
    gap: 2rem;
    justify-content: center;
    list-style: none;
    margin-bottom: 2rem;
  }

  .footer-links a {
    color: var(--text-4);
    text-decoration: none;
    font-size: 0.85rem;
    transition: color 0.3s;
  }

  .footer-links a:hover { color: var(--text-2); }

  .footer-copy {
    color: var(--text-4);
    font-size: 0.75rem;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .nav-links { display: none; }
    .hero-title { font-size: 2.5rem; }
    .features-grid { grid-template-columns: 1fr; }
    .pricing-grid { grid-template-columns: 1fr; }
    .stats-bar { grid-template-columns: repeat(2, 1fr); }
    .cta-inner h2 { font-size: 2rem; }
  }
</style>
</head>
<body>

<!-- Navigation -->
<nav class="nav">
  <div class="nav-brand">NovaPulse</div>
  <ul class="nav-links">
    <li><a href="#features">Features</a></li>
    <li><a href="#pricing">Pricing</a></li>
    <li><a href="#about">About</a></li>
    <li><button class="nav-cta">Start Free Trial</button></li>
  </ul>
</nav>

<!-- Hero -->
<section class="hero">
  <div class="hero-bg"></div>
  <div class="hero-orbs">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
  </div>
  <div class="hero-inner slide-up">
    <div class="hero-badge">
      <div class="hero-badge-dot"></div>
      Now in Beta &mdash; Join 2,400+ early adopters
    </div>
    <h1 class="hero-title">
      Automate your<br>
      <span class="hero-title-gradient">entire workflow</span>
    </h1>
    <p class="hero-desc">NovaPulse uses AI to eliminate repetitive tasks, streamline collaboration, and give your team superpowers. From code reviews to deployment &mdash; one intelligent platform.</p>
    <div class="hero-ctas">
      <button class="btn-glow">Start Free Trial &#10140;</button>
      <button class="btn-ghost">&#9655; Watch Demo</button>
    </div>
  </div>
</section>

<!-- Stats -->
<div class="stats-bar">
  <div class="stat-item slide-up">
    <div class="stat-number">2.4K+</div>
    <div class="stat-label">Beta Users</div>
  </div>
  <div class="stat-item slide-up" style="animation-delay:0.1s">
    <div class="stat-number">98%</div>
    <div class="stat-label">Satisfaction Rate</div>
  </div>
  <div class="stat-item slide-up" style="animation-delay:0.2s">
    <div class="stat-number">3.2x</div>
    <div class="stat-label">Faster Delivery</div>
  </div>
  <div class="stat-item slide-up" style="animation-delay:0.3s">
    <div class="stat-number">50M+</div>
    <div class="stat-label">Tasks Automated</div>
  </div>
</div>

<!-- Features -->
<section class="features" id="features">
  <div class="features-header slide-up">
    <h2>Intelligent by Design</h2>
    <p>Every feature is built to save time, reduce errors, and amplify your team's capabilities.</p>
  </div>
  <div class="features-grid">
    <div class="feature-card slide-up" style="animation-delay:0.1s">
      <div class="feature-icon" style="background:var(--gradient-1);">&#9889;</div>
      <div class="feature-name">AI-Powered Automation</div>
      <div class="feature-desc">Automate code reviews, testing, and deployments with context-aware AI that understands your project.</div>
    </div>
    <div class="feature-card slide-up" style="animation-delay:0.2s">
      <div class="feature-icon" style="background:var(--gradient-2);">&#128274;</div>
      <div class="feature-name">Smart Security</div>
      <div class="feature-desc">Real-time vulnerability detection and auto-patching. Sleep well knowing your codebase is protected.</div>
    </div>
    <div class="feature-card slide-up" style="animation-delay:0.3s">
      <div class="feature-icon" style="background:var(--gradient-3);">&#128202;</div>
      <div class="feature-name">Live Analytics</div>
      <div class="feature-desc">Understand team velocity, bottlenecks, and delivery patterns with beautiful real-time dashboards.</div>
    </div>
    <div class="feature-card slide-up" style="animation-delay:0.4s">
      <div class="feature-icon" style="background:var(--gradient-2);">&#128640;</div>
      <div class="feature-name">Instant Deploy</div>
      <div class="feature-desc">Push to production in seconds. Zero-config deployments with rollback and canary release support.</div>
    </div>
    <div class="feature-card slide-up" style="animation-delay:0.5s">
      <div class="feature-icon" style="background:var(--gradient-1);">&#128101;</div>
      <div class="feature-name">Team Collaboration</div>
      <div class="feature-desc">Built-in reviews, comments, and async communication. Works where your team works.</div>
    </div>
    <div class="feature-card slide-up" style="animation-delay:0.6s">
      <div class="feature-icon" style="background:var(--gradient-3);">&#127793;</div>
      <div class="feature-name">Eco-Friendly CI</div>
      <div class="feature-desc">Optimized build pipelines that reduce compute waste. Green computing for a sustainable future.</div>
    </div>
  </div>
</section>

<!-- Pricing -->
<section class="pricing" id="pricing">
  <div class="pricing-header slide-up">
    <h2>Simple, Transparent Pricing</h2>
    <p>Start free. Scale when you need to. No surprises.</p>
  </div>
  <div class="pricing-grid">
    <div class="pricing-card slide-up" style="animation-delay:0.1s">
      <div class="pricing-tier">Starter</div>
      <div class="pricing-amount">$0</div>
      <div class="pricing-period">Free forever</div>
      <ul class="pricing-features">
        <li>5 team members</li>
        <li>Basic automation</li>
        <li>Community support</li>
        <li>1 project</li>
      </ul>
      <button class="pricing-btn">Get Started</button>
    </div>
    <div class="pricing-card popular slide-up" style="animation-delay:0.2s">
      <div class="pricing-tier">Professional</div>
      <div class="pricing-amount">$29</div>
      <div class="pricing-period">per user/month</div>
      <ul class="pricing-features">
        <li>Unlimited members</li>
        <li>Full AI automation</li>
        <li>Priority support</li>
        <li>Unlimited projects</li>
        <li>Custom integrations</li>
        <li>Analytics dashboard</li>
      </ul>
      <button class="pricing-btn">Start 14-Day Trial</button>
    </div>
    <div class="pricing-card slide-up" style="animation-delay:0.3s">
      <div class="pricing-tier">Enterprise</div>
      <div class="pricing-amount">Custom</div>
      <div class="pricing-period">Talk to sales</div>
      <ul class="pricing-features">
        <li>Everything in Pro</li>
        <li>Dedicated support</li>
        <li>SLA guarantees</li>
        <li>SSO & SAML</li>
        <li>Custom training</li>
        <li>On-premise option</li>
      </ul>
      <button class="pricing-btn">Contact Sales</button>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta-section">
  <div class="cta-bg"></div>
  <div class="cta-inner slide-up">
    <h2>Ready to<br><span class="hero-title-gradient">supercharge</span> your team?</h2>
    <p>Join thousands of teams already shipping faster with NovaPulse. No credit card required.</p>
    <button class="btn-glow" style="font-size:1.1rem;padding:1rem 2.5rem;">Start Free Trial &#10140;</button>
  </div>
</section>

<!-- Footer -->
<footer class="footer">
  <div class="footer-brand">NovaPulse</div>
  <ul class="footer-links">
    <li><a href="#">Privacy</a></li>
    <li><a href="#">Terms</a></li>
    <li><a href="#">Docs</a></li>
    <li><a href="#">Blog</a></li>
    <li><a href="#">Status</a></li>
  </ul>
  <div class="footer-copy">&copy; 2025 NovaPulse Inc. Built for builders.</div>
</footer>

</body>
</html>`
}

function generateEcommerceHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Luxe Market — Premium Lifestyle Store</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Crimson+Pro:wght@400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #fafaf8;
    --bg-2: #f0efe8;
    --dark: #1a1a18;
    --dark-2: #2d2d28;
    --dark-3: #404038;
    --text: #1a1a18;
    --text-2: #5a5a50;
    --text-3: #8a8a78;
    --accent: #c8553d;
    --accent-2: #e07060;
    --accent-dark: #a04030;
    --gold: #c9a84c;
    --gold-2: #dfc06a;
    --border: rgba(0,0,0,0.08);
    --border-2: rgba(0,0,0,0.04);
  }

  body {
    font-family: 'Outfit', sans-serif;
    background: var(--bg);
    color: var(--text);
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  @keyframes fadeIn { to { opacity: 1; } }
  @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
  @keyframes slideIn { to { opacity: 1; transform: translateX(0); } }

  .slide-up { animation: slideUp 0.7s ease-out forwards; opacity: 0; transform: translateY(30px); }

  /* Nav */
  .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    padding: 1.25rem 3rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(250,250,248,0.9);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
  }

  .nav-brand {
    font-family: 'Crimson Pro', serif;
    font-weight: 700;
    font-size: 1.4rem;
    color: var(--dark);
    letter-spacing: 0.02em;
  }

  .nav-center { display: flex; gap: 2rem; list-style: none; }
  .nav-center a {
    color: var(--text-2);
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    transition: color 0.3s;
  }
  .nav-center a:hover { color: var(--accent); }

  .nav-actions { display: flex; gap: 1rem; align-items: center; }
  .nav-cart {
    padding: 0.5rem 1rem;
    background: var(--dark);
    color: white;
    font-size: 0.8rem;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
  }
  .nav-cart:hover { background: var(--accent); }

  /* Hero Banner */
  .hero-banner {
    height: 70vh;
    background: linear-gradient(135deg, var(--dark) 0%, var(--dark-2) 50%, var(--dark-3) 100%);
    position: relative;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .hero-banner::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: radial-gradient(ellipse at 70% 30%, rgba(200,85,61,0.15) 0%, transparent 60%);
  }

  .hero-content {
    position: relative;
    z-index: 2;
    padding: 4rem 3rem;
    max-width: 600px;
  }

  .hero-label {
    font-size: 0.75rem;
    color: var(--gold);
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  .hero-title {
    font-family: 'Crimson Pro', serif;
    font-size: 3.5rem;
    font-weight: 700;
    color: #f8f8f0;
    line-height: 1.1;
    margin-bottom: 1rem;
  }

  .hero-sub {
    color: rgba(255,255,255,0.5);
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  .hero-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.9rem 2rem;
    background: var(--accent);
    color: white;
    font-weight: 600;
    font-size: 0.9rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .hero-btn:hover { background: var(--accent-2); transform: translateY(-2px); }

  /* Categories */
  .categories {
    padding: 3rem 3rem;
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }

  .cat-card {
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
  }

  .cat-card:hover {
    border-color: var(--accent);
    transform: translateY(-4px);
  }

  .cat-icon { font-size: 2rem; margin-bottom: 1rem; }
  .cat-name { font-weight: 600; font-size: 1rem; margin-bottom: 0.25rem; }
  .cat-count { color: var(--text-3); font-size: 0.75rem; }

  /* Products */
  .products-section {
    padding: 4rem 3rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .products-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .products-header h2 {
    font-family: 'Crimson Pro', serif;
    font-size: 2rem;
    font-weight: 700;
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  .product-card {
    background: white;
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.4s;
    cursor: pointer;
  }

  .product-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.08);
  }

  .product-thumb {
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Crimson Pro', serif;
    font-size: 2rem;
    font-weight: 700;
  }

  .product-info { padding: 1.5rem; }
  .product-name { font-weight: 600; margin-bottom: 0.5rem; }
  .product-price {
    font-family: 'Crimson Pro', serif;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--accent);
  }
  .product-tag {
    display: inline-block;
    font-size: 0.7rem;
    padding: 0.2rem 0.6rem;
    background: var(--bg-2);
    color: var(--text-2);
    border-radius: 4px;
    margin-top: 0.5rem;
  }

  /* Testimonial */
  .testimonial {
    padding: 6rem 3rem;
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }

  .testimonial-quote {
    font-family: 'Crimson Pro', serif;
    font-size: 1.75rem;
    font-weight: 500;
    color: var(--dark);
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  .testimonial-author {
    font-weight: 600;
    color: var(--text);
    font-size: 0.9rem;
  }

  .testimonial-role {
    color: var(--text-3);
    font-size: 0.8rem;
  }

  /* Newsletter */
  .newsletter {
    padding: 4rem 3rem;
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
  }

  .newsletter h3 {
    font-family: 'Crimson Pro', serif;
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }

  .newsletter p {
    color: var(--text-3);
    margin-bottom: 2rem;
  }

  .newsletter-form {
    display: flex;
    gap: 0.75rem;
  }

  .newsletter-input {
    flex: 1;
    padding: 0.85rem 1rem;
    background: white;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 0.9rem;
  }

  .newsletter-input:focus { outline: none; border-color: var(--accent); }

  .newsletter-btn {
    padding: 0.85rem 1.5rem;
    background: var(--dark);
    color: white;
    font-weight: 600;
    font-size: 0.85rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .newsletter-btn:hover { background: var(--accent); }

  /* Footer */
  .footer {
    background: var(--dark);
    color: rgba(255,255,255,0.7);
    padding: 3rem;
  }

  .footer-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 3rem;
  }

  .footer-brand {
    font-family: 'Crimson Pro', serif;
    font-size: 1.5rem;
    color: white;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .footer-desc {
    font-size: 0.85rem;
    line-height: 1.6;
    color: rgba(255,255,255,0.4);
  }

  .footer-col h4 {
    color: white;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .footer-col ul { list-style: none; }
  .footer-col li { margin-bottom: 0.5rem; }
  .footer-col a {
    color: rgba(255,255,255,0.4);
    text-decoration: none;
    font-size: 0.85rem;
    transition: color 0.3s;
  }
  .footer-col a:hover { color: white; }

  .footer-bottom {
    max-width: 1200px;
    margin: 0 auto;
    padding-top: 2rem;
    border-top: 1px solid rgba(255,255,255,0.08);
    margin-top: 2rem;
    text-align: center;
    font-size: 0.75rem;
    color: rgba(255,255,255,0.3);
  }

  @media (max-width: 768px) {
    .nav-center { display: none; }
    .hero-title { font-size: 2.5rem; }
    .categories { grid-template-columns: repeat(2, 1fr); }
    .products-grid { grid-template-columns: 1fr; }
    .footer-inner { grid-template-columns: 1fr 1fr; }
    .hero-banner { height: 60vh; }
  }
</style>
</head>
<body>

<nav class="nav">
  <div class="nav-brand">Luxe Market</div>
  <ul class="nav-center">
    <li><a href="#new">New Arrivals</a></li>
    <li><a href="#shop">Shop</a></li>
    <li><a href="#collections">Collections</a></li>
    <li><a href="#about">About</a></li>
  </ul>
  <div class="nav-actions">
    <button class="nav-cart">Cart (0)</button>
  </div>
</nav>

<section class="hero-banner">
  <div class="hero-content slide-up">
    <div class="hero-label">Spring Collection 2025</div>
    <h1 class="hero-title">Curated for<br>the discerning</h1>
    <p class="hero-sub">Discover handpicked pieces from artisan makers worldwide. Each item tells a story of craftsmanship and intention.</p>
    <button class="hero-btn">Explore Collection &#10140;</button>
  </div>
</section>

<div class="categories">
  <div class="cat-card slide-up">
    <div class="cat-icon">&#128188;</div>
    <div class="cat-name">Accessories</div>
    <div class="cat-count">42 items</div>
  </div>
  <div class="cat-card slide-up" style="animation-delay:0.1s">
    <div class="cat-icon">&#127913;</div>
    <div class="cat-name">Home Decor</div>
    <div class="cat-count">68 items</div>
  </div>
  <div class="cat-card slide-up" style="animation-delay:0.2s">
    <div class="cat-icon">&#128090;</div>
    <div class="cat-name">Apparel</div>
    <div class="cat-count">55 items</div>
  </div>
  <div class="cat-card slide-up" style="animation-delay:0.3s">
    <div class="cat-icon">&#127873;</div>
    <div class="cat-name">Gift Sets</div>
    <div class="cat-count">24 items</div>
  </div>
</div>

<section class="products-section" id="new">
  <div class="products-header">
    <h2>New Arrivals</h2>
  </div>
  <div class="products-grid">
    <div class="product-card slide-up">
      <div class="product-thumb" style="background:linear-gradient(135deg,#f5f0e8,#e8dcc8);color:#c8553d;">LM</div>
      <div class="product-info">
        <div class="product-name">Artisan Leather Journal</div>
        <div class="product-price">$68</div>
        <span class="product-tag">Handcrafted</span>
      </div>
    </div>
    <div class="product-card slide-up" style="animation-delay:0.1s">
      <div class="product-thumb" style="background:linear-gradient(135deg,#e8e4dc,#d0ccc0);color:#5a5a50;">SC</div>
      <div class="product-info">
        <div class="product-name">Ceramic Pour-Over Set</div>
        <div class="product-price">$95</div>
        <span class="product-tag">Limited Edition</span>
      </div>
    </div>
    <div class="product-card slide-up" style="animation-delay:0.2s">
      <div class="product-thumb" style="background:linear-gradient(135deg,#dde0e4,#c0c4c8);color:#1a1a18;">TW</div>
      <div class="product-info">
        <div class="product-name">Merino Wool Throw</div>
        <div class="product-price">$145</div>
        <span class="product-tag">Sustainable</span>
      </div>
    </div>
    <div class="product-card slide-up" style="animation-delay:0.3s">
      <div class="product-thumb" style="background:linear-gradient(135deg,#f8e8d0,#e0d0b0);color:#c9a84c;">BW</div>
      <div class="product-info">
        <div class="product-name">Brass Watch Collection</div>
        <div class="product-price">$320</div>
        <span class="product-tag">Signature</span>
      </div>
    </div>
    <div class="product-card slide-up" style="animation-delay:0.4s">
      <div class="product-thumb" style="background:linear-gradient(135deg,#e0e8f0,#c8d4e0);color:#404038;">DP</div>
      <div class="product-info">
        <div class="product-name">Desk Organizer Set</div>
        <div class="product-price">$78</div>
        <span class="product-tag">Bestseller</span>
      </div>
    </div>
    <div class="product-card slide-up" style="animation-delay:0.5s">
      <div class="product-thumb" style="background:linear-gradient(135deg,#f0e8e0,#d8c8b0);color:#c8553d;">VG</div>
      <div class="product-info">
        <div class="product-name">Vanilla & Sand Candle</div>
        <div class="product-price">$42</div>
        <span class="product-tag">New</span>
      </div>
    </div>
  </div>
</section>

<section class="testimonial">
  <div class="slide-up">
    <div class="testimonial-quote">&ldquo;Luxe Market has completely changed how I think about everyday objects. Every piece I've purchased feels like it was made just for my home.&rdquo;</div>
    <div class="testimonial-author">Alexandra Chen</div>
    <div class="testimonial-role">Interior Designer, San Francisco</div>
  </div>
</section>

<section class="newsletter">
  <div class="slide-up">
    <h3>Stay in the Loop</h3>
    <p>New arrivals, exclusive offers, and stories from our makers &mdash; delivered weekly.</p>
    <div class="newsletter-form">
      <input class="newsletter-input" placeholder="Your email" type="email">
      <button class="newsletter-btn">Subscribe</button>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="footer-inner">
    <div>
      <div class="footer-brand">Luxe Market</div>
      <div class="footer-desc">Curated lifestyle goods from artisan makers worldwide. Quality over quantity, always.</div>
    </div>
    <div class="footer-col">
      <h4>Shop</h4>
      <ul>
        <li><a href="#">New Arrivals</a></li>
        <li><a href="#">Bestsellers</a></li>
        <li><a href="#">Collections</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Company</h4>
      <ul>
        <li><a href="#">About</a></li>
        <li><a href="#">Makers</a></li>
        <li><a href="#">Sustainability</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Support</h4>
      <ul>
        <li><a href="#">Shipping</a></li>
        <li><a href="#">Returns</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">&copy; 2025 Luxe Market. Crafted with care.</div>
</footer>

</body>
</html>`
}

function detectTemplateType(prompt: string): 'coffee' | 'portfolio' | 'saas' | 'ecommerce' {
  const lower = prompt.toLowerCase()
  if (lower.includes('coffee') || lower.includes('cafe') || lower.includes('restaurant') || lower.includes('bakery') || lower.includes('food') || lower.includes('dining')) {
    return 'coffee'
  }
  if (lower.includes('portfolio') || lower.includes('photographer') || lower.includes('creative') || lower.includes('artist') || lower.includes('designer')) {
    return 'portfolio'
  }
  if (lower.includes('saas') || lower.includes('software') || lower.includes('app') || lower.includes('platform') || lower.includes('tech') || lower.includes('startup')) {
    return 'saas'
  }
  if (lower.includes('ecommerce') || lower.includes('shop') || lower.includes('store') || lower.includes('landing page') || lower.includes('agency') || lower.includes('market')) {
    return 'ecommerce'
  }
  // Default based on common patterns
  if (lower.includes('website') || lower.includes('home page') || lower.includes('homepage')) {
    return 'saas'
  }
  return 'portfolio'
}

function generateWebsiteContent(prompt: string): { id: string; name: string; route: string; html: string; css: string; js?: string }[] {
  const templateType = detectTemplateType(prompt)
  const mainHTML = templateType === 'coffee' ? generateCoffeeShopHTML()
    : templateType === 'portfolio' ? generatePortfolioHTML()
    : templateType === 'ecommerce' ? generateEcommerceHTML()
    : generateSaaSHTML()

  const siteName = templateType === 'coffee' ? 'Ember & Roast'
    : templateType === 'portfolio' ? 'Mira Solano'
    : templateType === 'ecommerce' ? 'Luxe Market'
    : 'NovaPulse'

  return [
    {
      id: 'page-home',
      name: 'Home',
      route: '/',
      html: mainHTML,
      css: '',
    },
    {
      id: 'page-about',
      name: 'About',
      route: '/about',
      html: generateAboutPageHTML(templateType, siteName),
      css: '',
    },
    {
      id: 'page-contact',
      name: 'Contact',
      route: '/contact',
      html: generateContactPageHTML(templateType, siteName),
      css: '',
    },
  ]
}

function generateAboutPageHTML(type: string, name: string): string {
  const styles = type === 'coffee' ? `
    background:#1a0e07;color:#f0e6d3;font-family:'Inter',sans-serif;
    min-height:100vh;display:flex;align-items:center;justify-content:center;
    padding:4rem;` : type === 'portfolio' ? `
    background:#0a0a0a;color:#f5f5f5;font-family:'DM Sans',sans-serif;
    min-height:100vh;display:flex;align-items:center;justify-content:center;
    padding:4rem;` : type === 'ecommerce' ? `
    background:#fafaf8;color:#1a1a18;font-family:'Outfit',sans-serif;
    min-height:100vh;display:flex;align-items:center;justify-content:center;
    padding:4rem;` : `
    background:#060611;color:#f0f0f8;font-family:'Inter',sans-serif;
    min-height:100vh;display:flex;align-items:center;justify-content:center;
    padding:4rem;`

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${name} — About</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  body { ${styles} }
  .about-container { max-width:700px; text-align:center; }
  .about-title { font-size:3rem; font-weight:700; margin-bottom:2rem; }
  .about-text { font-size:1.1rem; line-height:1.8; opacity:0.7; margin-bottom:1.5rem; }
  .about-values { display:flex; gap:2rem; justify-content:center; margin-top:3rem; }
  .value-item { text-align:center; padding:1.5rem; }
  .value-icon { font-size:2rem; margin-bottom:0.5rem; }
  .value-name { font-weight:600; font-size:0.9rem; }
</style></head><body>
<div class="about-container">
  <h1 class="about-title">About ${name}</h1>
  <p class="about-text">We believe in crafting experiences that resonate. Every detail matters, from the first impression to the lasting memory. Our team of passionate creators works tirelessly to bring vision to reality.</p>
  <p class="about-text">Founded with a commitment to excellence, ${name} continues to push boundaries while honoring the traditions that make our work meaningful. We invite you to learn more about what drives us.</p>
  <div class="about-values">
    <div class="value-item"><div class="value-icon">&#9733;</div><div class="value-name">Quality</div></div>
    <div class="value-item"><div class="value-icon">&#9829;</div><div class="value-name">Passion</div></div>
    <div class="value-item"><div class="value-icon">&#9883;</div><div class="value-name">Innovation</div></div>
  </div>
</div>
</body></html>`
}

function generateContactPageHTML(type: string, name: string): string {
  const bg = type === 'coffee' ? '#1a0e07' : type === 'portfolio' ? '#0a0a0a' : type === 'ecommerce' ? '#fafaf8' : '#060611'
  const color = type === 'coffee' ? '#f0e6d3' : type === 'portfolio' ? '#f5f5f5' : type === 'ecommerce' ? '#1a1a18' : '#f0f0f8'
  const accent = type === 'coffee' ? '#d4a853' : type === 'portfolio' ? '#e85d75' : type === 'ecommerce' ? '#c8553d' : '#6c5ce7'

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${name} — Contact</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  body { background:${bg};color:${color};font-family:'Inter',sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:4rem; }
  .contact-container { max-width:600px; text-align:center; }
  .contact-title { font-size:3rem; font-weight:700; margin-bottom:1rem; }
  .contact-sub { opacity:0.6; font-size:1rem; margin-bottom:3rem; }
  .contact-form { display:flex; flex-direction:column; gap:1rem; }
  .contact-input { padding:1rem; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px; color:${color}; font-size:0.9rem; font-family:'Inter',sans-serif; }
  .contact-input:focus { outline:none; border-color:${accent}; }
  .contact-input::placeholder { opacity:0.4; }
  .contact-btn { padding:1rem; background:${accent}; color:white; font-weight:600; font-size:0.9rem; border:none; border-radius:8px; cursor:pointer; transition:opacity 0.3s; }
  .contact-btn:hover { opacity:0.9; }
  .contact-info { margin-top:3rem; opacity:0.5; font-size:0.85rem; }
</style></head><body>
<div class="contact-container">
  <h1 class="contact-title">Get in Touch</h1>
  <p class="contact-sub">We'd love to hear from you. Send us a message and we'll respond within 24 hours.</p>
  <div class="contact-form">
    <input class="contact-input" placeholder="Your name" type="text">
    <input class="contact-input" placeholder="Your email" type="email">
    <textarea class="contact-input" placeholder="Your message" rows="5" style="resize:none;"></textarea>
    <button class="contact-btn">Send Message</button>
  </div>
  <div class="contact-info">hello@${name.toLowerCase().replace(/[^a-z0]/g, '')}.com &bull; +1 (555) 000-0000</div>
</div>
</body></html>`
}

// ─── Generation Steps ──────────────────────────────────────────────────────

const GENERATION_STEPS = [
  { label: 'Analyzing prompt...', icon: Sparkles },
  { label: 'Generating layout...', icon: Layout },
  { label: 'Creating components...', icon: Layers },
  { label: 'Applying styling...', icon: Palette },
  { label: 'Adding animations...', icon: Zap },
  { label: 'Optimizing...', icon: Code2 },
  { label: 'Complete!', icon: Rocket },
]

// ─── Suggestion Cards ──────────────────────────────────────────────────────

const PROMPT_SUGGESTIONS = [
  { text: 'Build a coffee shop website', icon: '☕', tag: 'Business' },
  { text: 'Create a portfolio for a photographer', icon: '📷', tag: 'Creative' },
  { text: 'Generate an ecommerce landing page', icon: '🛍️', tag: 'Commerce' },
  { text: 'Design a SaaS homepage', icon: '⚡', tag: 'Tech' },
  { text: 'Build a restaurant website', icon: '🍽️', tag: 'Business' },
  { text: 'Create an agency landing page', icon: '🎨', tag: 'Creative' },
]

// ─── Recent Prompt History (mock) ──────────────────────────────────────────

const RECENT_PROMPTS = [
  'Modern fitness app landing page',
  'Real estate property showcase',
  'Non-profit organization website',
]

// ─── Template Quick Starts ─────────────────────────────────────────────────

const TEMPLATE_QUICK_STARTS = [
  { name: 'Starter', desc: 'Clean single-page', icon: Layout, prompt: 'Build a clean single-page website with hero, features, and contact' },
  { name: 'Business', desc: 'Full corporate site', icon: Grid3X3, prompt: 'Build a professional business website with services, team, and testimonials' },
  { name: 'Creative', desc: 'Portfolio showcase', icon: Palette, prompt: 'Create a creative portfolio website with project gallery and about section' },
]

// ─── Device Preview Sizes ──────────────────────────────────────────────────

const DEVICE_SIZES = {
  desktop: { width: '100%', label: 'Desktop', icon: Monitor },
  tablet: { width: '768px', label: 'Tablet', icon: Tablet },
  mobile: { width: '375px', label: 'Mobile', icon: Smartphone },
}

// ─── Phase Components ──────────────────────────────────────────────────────

function PromptPhase() {
  const { setBuilderPrompt, builderPrompt, startGeneration } = useAppStore()
  const [cursorVisible, setCursorVisible] = useState(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(v => !v), 530)
    return () => clearInterval(interval)
  }, [])

  const handleGenerate = () => {
    if (!builderPrompt.trim()) {
      toast({ title: 'Please enter a prompt', description: 'Describe the website you want to build' })
      return
    }
    startGeneration(builderPrompt)
  }

  const handleSuggestionClick = (text: string) => {
    setBuilderPrompt(text)
    textareaRef.current?.focus()
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Background floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 blur-3xl"
          animate={{ y: [0, -40, 0], x: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-gradient-to-br from-orange-500/8 to-amber-500/8 blur-3xl"
          animate={{ y: [0, 20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-3xl px-4 sm:px-6"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-white/60">AI-Powered Website Builder</span>
          </motion.div>

          <h1 className="mb-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Describe your vision
          </h1>
          <p className="text-lg text-white/40">
            Tell us what you want, and we&apos;ll craft it into reality
          </p>
        </div>

        {/* Prompt input area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative mb-6"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl shadow-black/20">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent" />
            <Textarea
              ref={textareaRef}
              value={builderPrompt}
              onChange={(e) => setBuilderPrompt(e.target.value)}
              placeholder="What kind of website would you like to build?"
              className="relative min-h-[140px] resize-none border-0 bg-transparent p-6 text-lg text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-scrollbar]:hidden"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleGenerate()
                }
              }}
            />
            {/* Animated cursor */}
            {builderPrompt.length === 0 && cursorVisible && (
              <div className="absolute left-6 top-[76px] h-6 w-0.5 animate-pulse bg-purple-400" />
            )}
          </div>
        </motion.div>

        {/* Generate button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <Button
            onClick={handleGenerate}
            disabled={!builderPrompt.trim()}
            className="group relative h-14 overflow-hidden rounded-xl border-0 px-8 text-base font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
            style={{ background: 'linear-gradient(135deg, #6c5ce7, #a855f7, #ec4899)' }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ backgroundSize: '200% 100%', animation: 'shimmer 2s linear infinite' }} />
            <Wand2 className="mr-2 h-5 w-5" />
            Generate Website
            <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </motion.div>

        {/* Suggestion cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <p className="mb-4 text-center text-sm text-white/30">Try a suggestion</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {PROMPT_SUGGESTIONS.map((suggestion, i) => (
              <motion.div
                key={suggestion.text}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.08 }}
              >
                <Card
                  className="cursor-pointer border-white/8 bg-white/[0.02] backdrop-blur-md transition-all duration-300 hover:border-purple-500/30 hover:bg-white/[0.05] hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10"
                  onClick={() => handleSuggestionClick(suggestion.text)}
                >
                  <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                    <span className="text-2xl">{suggestion.icon}</span>
                    <span className="text-sm font-medium text-white/70">{suggestion.text}</span>
                    <Badge variant="secondary" className="border-white/10 bg-white/5 text-xs text-white/40">
                      {suggestion.tag}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Template Quick Starts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mb-8"
        >
          <p className="mb-4 text-center text-sm text-white/30">Quick start templates</p>
          <div className="grid grid-cols-3 gap-3">
            {TEMPLATE_QUICK_STARTS.map((template, i) => (
              <motion.div
                key={template.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0 + i * 0.08 }}
              >
                <Card
                  className="cursor-pointer border-white/8 bg-white/[0.02] backdrop-blur-md transition-all duration-300 hover:border-emerald-500/30 hover:bg-white/[0.05] hover:-translate-y-1"
                  onClick={() => {
                    setBuilderPrompt(template.prompt)
                    textareaRef.current?.focus()
                  }}
                >
                  <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                    <template.icon className="h-5 w-5 text-emerald-400" />
                    <span className="text-sm font-semibold text-white/80">{template.name}</span>
                    <span className="text-xs text-white/40">{template.desc}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent prompts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <p className="mb-3 text-center text-sm text-white/30">Recent prompts</p>
          <div className="flex flex-wrap justify-center gap-2">
            {RECENT_PROMPTS.map((prompt, i) => (
              <motion.button
                key={prompt}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 + i * 0.05 }}
                onClick={() => {
                  setBuilderPrompt(prompt)
                  textareaRef.current?.focus()
                }}
                className="rounded-full border border-white/8 bg-white/[0.02] px-3 py-1.5 text-xs text-white/40 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.05] hover:text-white/60"
              >
                {prompt}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

function GeneratingPhase() {
  const {
    generationProgress,
    setGenerationProgress,
    setBuilderPhase,
    setIsGenerating,
    setGeneratedPages,
    setCurrentPreviewPage,
    builderPrompt,
  } = useAppStore()

  const [currentStep, setCurrentStep] = useState(0)
  const [stepsCompleted, setStepsCompleted] = useState<number[]>([])
  const [estimatedTime, setEstimatedTime] = useState('5s')
  const cancelRef = useRef(false)

  useEffect(() => {
    cancelRef.current = false

    const stepDuration = 700 // ms per step
    const progressIncrement = 100 / GENERATION_STEPS.length
    let step = 0

    const advanceStep = () => {
      if (cancelRef.current) return

      if (step < GENERATION_STEPS.length) {
        setCurrentStep(step)
        setStepsCompleted(prev => [...prev, step])
        setGenerationProgress(Math.min(100, Math.round((step + 1) * progressIncrement)))
        
        const remaining = GENERATION_STEPS.length - step - 1
        setEstimatedTime(`${remaining * 0.7}s`)
        
        step++
        
        if (step < GENERATION_STEPS.length) {
          setTimeout(advanceStep, stepDuration)
        } else {
          // Complete — generate pages and advance to preview
          setTimeout(() => {
            if (cancelRef.current) return
            const pages = generateWebsiteContent(builderPrompt)
            setGeneratedPages(pages)
            setCurrentPreviewPage(pages[0].id)
            setIsGenerating(false)
            setBuilderPhase('preview')
          }, 500)
        }
      }
    }

    setTimeout(advanceStep, 300)

    return () => {
      cancelRef.current = true
    }
  }, [])

  const handleCancel = () => {
    cancelRef.current = true
    setIsGenerating(false)
    setGenerationProgress(0)
    setBuilderPhase('prompt')
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute left-1/4 top-1/4 h-60 w-60 rounded-full bg-purple-500/20 blur-[100px]"
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-1/4 bottom-1/4 h-60 w-60 rounded-full bg-pink-500/20 blur-[100px]"
          animate={{ scale: [1.5, 1, 1.5], opacity: [0.3, 0.2, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-40 w-40 rounded-full bg-emerald-500/15 blur-[80px]"
          animate={{ scale: [1, 1.3, 1], x: [0, 40, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg px-4 sm:px-6"
      >
        {/* Central animation */}
        <div className="mb-8 flex justify-center">
          <motion.div
            className="relative h-24 w-24"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/30" />
            <div className="absolute inset-2 rounded-full border-2 border-pink-500/20" style={{ animationDirection: 'reverse' }} />
            <div className="absolute inset-4 rounded-full border-2 border-emerald-500/20" />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: -360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="h-8 w-8 text-purple-400" />
            </motion.div>
          </motion.div>
        </div>

        {/* Title */}
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-bold text-white">Generating your website</h2>
          <p className="text-sm text-white/40">AI is crafting your vision step by step</p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <Progress value={generationProgress} className="h-2 bg-white/10 [&>[data-slot=progress-indicator]]:bg-gradient-to-r [&>[data-slot=progress-indicator]]:from-purple-500 [&>[data-slot=progress-indicator]]:via-pink-500 [&>[data-slot=progress-indicator]]:to-emerald-500" />
          <div className="mt-2 flex justify-between text-xs text-white/30">
            <span>{generationProgress}%</span>
            <span>{estimatedTime} remaining</span>
          </div>
        </div>

        {/* Step list */}
        <div className="mb-8 space-y-3">
          {GENERATION_STEPS.map((step, i) => {
            const StepIcon = step.icon
            const isCompleted = stepsCompleted.includes(i)
            const isCurrent = currentStep === i && !isCompleted

            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isCompleted || isCurrent ? 1 : 0.3, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className={`flex items-center gap-3 rounded-lg border p-3 transition-all duration-500 ${
                  isCompleted
                    ? 'border-emerald-500/20 bg-emerald-500/5'
                    : isCurrent
                    ? 'border-purple-500/30 bg-purple-500/10'
                    : 'border-white/5 bg-white/[0.02]'
                }`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  isCompleted ? 'bg-emerald-500/20 text-emerald-400' : isCurrent ? 'bg-purple-500/20 text-purple-400 animate-pulse' : 'bg-white/5 text-white/20'
                }`}>
                  {isCompleted ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                      <Rocket className="h-4 w-4" />
                    </motion.div>
                  ) : isCurrent ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <StepIcon className="h-4 w-4" />
                  )}
                </div>
                <span className={`text-sm font-medium ${
                  isCompleted ? 'text-emerald-300' : isCurrent ? 'text-white' : 'text-white/30'
                }`}>
                  {step.label}
                </span>
                {isCompleted && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-auto text-xs text-emerald-400">&#10003;</motion.span>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Cancel button */}
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="text-white/30 hover:text-white/60 hover:bg-white/5"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel Generation
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

function PreviewPhase() {
  const {
    generatedPages,
    currentPreviewPage,
    setCurrentPreviewPage,
    setBuilderPhase,
    builderPrompt,
    navigate,
    addProject,
  } = useAppStore()

  const [deviceSize, setDeviceSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const currentPage = generatedPages.find(p => p.id === currentPreviewPage)
  const templateType = detectTemplateType(builderPrompt)
  const siteName = templateType === 'coffee' ? 'Ember & Roast'
    : templateType === 'portfolio' ? 'Mira Solano'
    : templateType === 'ecommerce' ? 'Luxe Market'
    : 'NovaPulse'

  const handleSaveProject = () => {
    const project = {
      id: `proj-${Date.now()}`,
      name: siteName,
      description: builderPrompt,
      prompt: builderPrompt,
      thumbnail: '',
      status: 'draft',
      framework: 'html',
      theme: templateType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    addProject(project)
    toast({ title: 'Project saved!', description: `${siteName} has been saved to your dashboard` })
  }

  const handleExport = () => {
    if (currentPage) {
      const blob = new Blob([currentPage.html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = window.document.createElement('a')
      a.href = url
      a.download = `${siteName.toLowerCase().replace(/\s+/g, '-')}-${currentPage.route.replace('/', '') || 'home'}.html`
      window.document.body.appendChild(a)
      a.click()
      window.document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast({ title: 'Exported!', description: 'HTML file has been downloaded' })
    }
  }

  const handleDeploy = () => {
    toast({ title: 'Deploying...', description: 'Your website is being deployed to production' })
  }

  const handleRegenerate = () => {
    setBuilderPhase('prompt')
  }

  const handleEdit = () => {
    navigate('editor')
  }

  const iframeWidth = DEVICE_SIZES[deviceSize].width

  // Update iframe content when page changes
  useEffect(() => {
    if (iframeRef.current && currentPage) {
      iframeRef.current.srcdoc = currentPage.html
    }
  }, [currentPreviewPage, currentPage])

  return (
    <div className="flex h-screen flex-col bg-[#0a0a0f]">
      {/* Top toolbar */}
      <div className="flex items-center justify-between border-b border-white/8 bg-[#0c0c14] px-4 py-3">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="border-purple-500/20 bg-purple-500/10 text-purple-300">
            <Sparkles className="mr-1 h-3 w-3" />
            Preview
          </Badge>
          <span className="text-sm font-semibold text-white/80">{siteName}</span>
        </div>

        {/* Device toggle */}
        <div className="flex items-center gap-1 rounded-lg border border-white/8 bg-white/[0.03] p-1">
          {(Object.entries(DEVICE_SIZES) as [keyof typeof DEVICE_SIZES, typeof DEVICE_SIZES[keyof typeof DEVICE_SIZES]][]).map(([key, config]) => {
            const Icon = config.icon
            return (
              <Button
                key={key}
                variant={deviceSize === key ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setDeviceSize(key)}
                className={`h-8 px-2 ${deviceSize === key ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}
              >
                <Icon className="h-4 w-4" />
              </Button>
            )
          })}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleRegenerate} className="text-white/30 hover:text-white/60 hover:bg-white/5">
            <RefreshCw className="mr-1 h-4 w-4" />
            Regenerate
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSaveProject} className="text-white/30 hover:text-white/60 hover:bg-white/5">
            <Save className="mr-1 h-4 w-4" />
            Save
          </Button>
          <Button variant="ghost" size="sm" onClick={handleExport} className="text-white/30 hover:text-white/60 hover:bg-white/5">
            <Download className="mr-1 h-4 w-4" />
            Export
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDeploy} className="text-emerald-400/60 hover:text-emerald-400 hover:bg-emerald-500/5">
            <Rocket className="mr-1 h-4 w-4" />
            Deploy
          </Button>
          <Button size="sm" onClick={handleEdit} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:opacity-90">
            <Code2 className="mr-1 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Page navigation */}
        <div className="w-56 border-r border-white/8 bg-[#0c0c14] p-4">
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-white/30 uppercase tracking-wider">Pages</p>
            <div className="space-y-1">
              {generatedPages.map((page) => (
                <motion.button
                  key={page.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setCurrentPreviewPage(page.id)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-all ${
                    currentPreviewPage === page.id
                      ? 'bg-purple-500/10 text-white border border-purple-500/20'
                      : 'text-white/40 hover:bg-white/5 hover:text-white/60'
                  }`}
                >
                  {page.id === 'page-home' && <Eye className="h-4 w-4" />}
                  {page.id === 'page-about' && <Type className="h-4 w-4" />}
                  {page.id === 'page-contact' && <Layers className="h-4 w-4" />}
                  {page.name}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-white/8 bg-white/[0.02] p-3">
            <p className="mb-2 text-xs font-medium text-white/30 uppercase tracking-wider">Details</p>
            <div className="space-y-2 text-xs text-white/40">
              <div className="flex justify-between">
                <span>Template</span>
                <span className="text-white/60">{templateType === 'coffee' ? 'Coffee Shop' : templateType === 'portfolio' ? 'Portfolio' : templateType === 'ecommerce' ? 'Ecommerce' : 'SaaS'}</span>
              </div>
              <div className="flex justify-between">
                <span>Pages</span>
                <span className="text-white/60">{generatedPages.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Framework</span>
                <span className="text-white/60">HTML/CSS</span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-white/8 bg-white/[0.02] p-3">
            <p className="mb-2 text-xs font-medium text-white/30 uppercase tracking-wider">Prompt</p>
            <p className="text-xs text-white/40 leading-relaxed">{builderPrompt}</p>
          </div>
        </div>

        {/* Preview area */}
        <div className="flex flex-1 items-center justify-center bg-[#0a0a0f] p-4 overflow-auto">
          <motion.div
            layout
            className="relative overflow-hidden rounded-xl border border-white/10 shadow-2xl shadow-black/40"
            style={{ width: iframeWidth, maxWidth: '100%', height: deviceSize === 'mobile' ? '667px' : deviceSize === 'tablet' ? '1024px' : 'calc(100vh - 120px)' }}
          >
            {/* Browser chrome */}
            <div className="flex items-center gap-2 bg-[#1a1a24] px-3 py-2 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <div className="h-3 w-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 mx-4">
                <div className="flex items-center gap-1 rounded-md bg-white/5 px-3 py-1">
                  <Lock className="h-3 w-3 text-white/20" />
                  <span className="text-xs text-white/30 truncate">{siteName.toLowerCase().replace(/\s+/g, '-')}.app</span>
                </div>
              </div>
            </div>

            {/* iframe */}
            <iframe
              ref={iframeRef}
              srcDoc={currentPage?.html || ''}
              title="Website Preview"
              className="w-full bg-white border-0"
              style={{ height: deviceSize === 'mobile' ? '641px' : deviceSize === 'tablet' ? '998px' : 'calc(100vh - 160px)' }}
              sandbox="allow-scripts"
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

function LockIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

const Lock = LockIcon

export default function BuilderPage() {
  const { builderPhase } = useAppStore()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={builderPhase}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-[#0a0a0f]"
      >
        {builderPhase === 'prompt' && <PromptPhase />}
        {builderPhase === 'generating' && <GeneratingPhase />}
        {builderPhase === 'preview' && <PreviewPhase />}
        {builderPhase === 'edit' && (
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto mb-4" />
              <p className="text-white/60">Transitioning to editor...</p>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
