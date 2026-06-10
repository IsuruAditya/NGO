-- Database Schema for the NGO Website

-- 1. Programs / Projects Table
-- This table stores all the NGO's projects or programs (e.g. "Clean Water Initiative").
CREATE TABLE IF NOT EXISTS programs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  goal_amount REAL NOT NULL DEFAULT 0.0,
  raised_amount REAL NOT NULL DEFAULT 0.0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Volunteers Table
-- This table stores submissions from the "Get Involved" volunteer signup form.
CREATE TABLE IF NOT EXISTS volunteers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending', -- Can be 'pending', 'approved', or 'contacted'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Donations Table
-- This table tracks donations processed through Stripe.
CREATE TABLE IF NOT EXISTS donations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  amount REAL NOT NULL,
  stripe_session_id TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending', -- Can be 'pending', 'success', or 'failed'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Contact Form Submissions Table
-- This table stores inquiries from the "Contact Us" page.
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Blog / News Table
-- This table holds the stories, articles, and updates published by the NGO.
CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- The friendly URL part (e.g. 'clean-water-update')
  summary TEXT NOT NULL,      -- A short blurb shown on the blog list page
  content TEXT NOT NULL,      -- The full HTML or Markdown text of the article
  image_url TEXT,             -- Link to the cover image stored in Cloudflare R2
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
