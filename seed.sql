-- Seeding mock data for NGO Website

-- Seed initial programs
INSERT OR IGNORE INTO programs (title, description, image_url, goal_amount, raised_amount)
VALUES 
(
  'Clean Water Initiative', 
  'Providing safe, accessible drinking water to remote rural villages by drilling fresh-water wells and installing solar-powered purification systems.', 
  'https://images.unsplash.com/photo-1541959837701-d1e2b27cbb3c?auto=format&fit=crop&q=80&w=800', 
  15000.00, 
  4500.00
),
(
  'Education for Every Child', 
  'Sponsoring tuition, uniforms, and textbooks for underprivileged children, and refurbishing community libraries to foster learning.', 
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800', 
  10000.00, 
  7200.00
),
(
  'Green Earth Reforestation', 
  'Planting thousands of native trees to reclaim degraded forest land, halt soil erosion, and combat carbon emissions in agricultural zones.', 
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=800', 
  5000.00, 
  1250.00
);

-- Seed initial blog posts
INSERT OR IGNORE INTO blog_posts (title, slug, summary, content, image_url)
VALUES 
(
  'Water Wells Completed in Southern Villages', 
  'water-wells-completed', 
  'We are thrilled to announce the successful installation of three new solar-powered wells, providing water to over 1,200 residents.', 
  '<p>Because of your generous contributions, three remote villages now have round-the-clock access to fresh, clean drinking water.</p><p>Previously, families had to walk over three miles daily to fetch water from unsafe riverbanks. With our new solar-powered pumps, clean water is now available right in the center of the communities.</p><p>We are currently assessing three more locations for Phase 2 of this initiative. Thank you for making this life-changing project possible!</p>', 
  'https://images.unsplash.com/photo-1541959837701-d1e2b27cbb3c?auto=format&fit=crop&q=80&w=800'
),
(
  'Starting the 2026 Reforestation Drive', 
  'reforestation-drive-2026', 
  'Join us this weekend as we embark on our annual community tree-planting event, aiming for 5,000 saplings.', 
  '<p>Our planet needs more green canopy, and our local ecosystem depends on it. This Saturday, June 13th, we will gather at the community forest reserve to plant native saplings.</p><p>We have sourced 5,000 healthy saplings of native oak and maple. Volunteers of all ages are welcome to join. We will provide shovels, gloves, and refreshments.</p><p>Help us restore our local woodlands and leave a healthy legacy for generations to come!</p>', 
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=800'
);
