-- Seed data for the marketplace app
-- 5 users, 15 listings, 10 messages, 8 favorites
--
-- NOTE: In production, profiles are auto-created by the trigger on auth.users.
-- For seeding, we insert directly into profiles with deterministic UUIDs.

-- ============================================================
-- PROFILES (5 users)
-- ============================================================
insert into public.profiles (id, email, full_name, avatar_url, bio) values
  ('a1b2c3d4-0001-4000-8000-000000000001', 'sarah@example.com',  'Sarah Chen',     'https://i.pravatar.cc/150?u=sarah',  'Vintage collector and interior design enthusiast. Always hunting for unique finds.'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'marcus@example.com', 'Marcus Johnson',  'https://i.pravatar.cc/150?u=marcus', 'Tech gadget lover. Upgrading constantly, selling the old stuff here.'),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'elena@example.com',  'Elena Rodriguez', 'https://i.pravatar.cc/150?u=elena',  'Outdoor adventure gear specialist. If I''m not hiking, I''m selling hiking gear.'),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'james@example.com',  'James Park',      'https://i.pravatar.cc/150?u=james',  'Musician and audio equipment reseller. Quality sound matters.'),
  ('a1b2c3d4-0005-4000-8000-000000000005', 'olivia@example.com', 'Olivia Bennett',  'https://i.pravatar.cc/150?u=olivia',  'Fashion-forward. Curating a closet one piece at a time.')
on conflict (id) do nothing;

-- ============================================================
-- LISTINGS (15 items across categories)
-- ============================================================
insert into public.listings (id, seller_id, title, description, price, category, image_urls, status) values
  -- Sarah's listings (vintage / home)
  ('b1000000-0001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000001',
   'Mid-Century Teak Coffee Table',
   'Beautifully restored 1960s Danish teak coffee table. Solid wood, minor patina adds character. 48" x 24" x 16". Local pickup preferred.',
   285.00, 'Home', '{"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400"}', 'active'),

  ('b1000000-0002-4000-8000-000000000002', 'a1b2c3d4-0001-4000-8000-000000000001',
   'Vintage Brass Table Lamp',
   'Art deco brass lamp from the 1940s. Rewired with new cord and socket. Works perfectly. Includes cream linen shade.',
   120.00, 'Home', '{"https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400"}', 'active'),

  ('b1000000-0003-4000-8000-000000000003', 'a1b2c3d4-0001-4000-8000-000000000001',
   'Set of 4 Ceramic Dinner Plates',
   'Handmade stoneware plates in speckled cream glaze. 10.5" diameter. Microwave and dishwasher safe.',
   65.00, 'Home', '{"https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400"}', 'active'),

  -- Marcus's listings (electronics)
  ('b1000000-0004-4000-8000-000000000004', 'a1b2c3d4-0002-4000-8000-000000000002',
   'Sony WH-1000XM5 Headphones',
   'Like new, used for 3 months. Industry-leading noise cancellation. Includes case, cable, and original box.',
   245.00, 'Electronics', '{"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"}', 'active'),

  ('b1000000-0005-4000-8000-000000000005', 'a1b2c3d4-0002-4000-8000-000000000002',
   'Mechanical Keyboard - Keychron Q1',
   'Hot-swappable 75% layout with Gateron Brown switches. RGB backlight. Includes extra keycaps set.',
   135.00, 'Electronics', '{"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400"}', 'active'),

  ('b1000000-0006-4000-8000-000000000006', 'a1b2c3d4-0002-4000-8000-000000000002',
   'iPad Air 5th Gen 256GB',
   'Space gray, WiFi model. Apple Pencil 2 compatible. Screen protector applied since day one. No scratches.',
   420.00, 'Electronics', '{"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400"}', 'active'),

  -- Elena's listings (sports / outdoors)
  ('b1000000-0007-4000-8000-000000000007', 'a1b2c3d4-0003-4000-8000-000000000003',
   'Osprey Atmos AG 65L Backpack',
   'Anti-Gravity suspension system. Used on 5 trips, well maintained. Color: Abyss Grey. Fits torso 18-22".',
   195.00, 'Sports', '{"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"}', 'active'),

  ('b1000000-0008-4000-8000-000000000008', 'a1b2c3d4-0003-4000-8000-000000000003',
   'REI Half Dome 2 Plus Tent',
   'Lightweight 2-person tent. Freestanding design, full rainfly. Color coded poles for fast setup. 4 lbs packed.',
   175.00, 'Sports', '{"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400"}', 'active'),

  ('b1000000-0009-4000-8000-000000000009', 'a1b2c3d4-0003-4000-8000-000000000003',
   'Garmin Fenix 7 Solar Watch',
   'GPS multisport watch with solar charging. Titanium bezel. Battery lasts 2+ weeks. Includes extra silicone band.',
   380.00, 'Electronics', '{"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"}', 'active'),

  -- James's listings (audio / music)
  ('b1000000-0010-4000-8000-000000000010', 'a1b2c3d4-0004-4000-8000-000000000004',
   'Fender Player Stratocaster',
   'Sunburst finish, maple neck. Alder body. Set up professionally with 10-46 strings. Gig bag included.',
   550.00, 'Sports', '{"https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400"}', 'active'),

  ('b1000000-0011-4000-8000-000000000011', 'a1b2c3d4-0004-4000-8000-000000000004',
   'Audio-Technica AT-LP120 Turntable',
   'Direct-drive turntable with USB output. Built-in preamp. Includes AT95E cartridge. Perfect for vinyl beginners.',
   220.00, 'Electronics', '{"https://images.unsplash.com/photo-1539375665275-f0816cf735cf?w=400"}', 'active'),

  ('b1000000-0012-4000-8000-000000000012', 'a1b2c3d4-0004-4000-8000-000000000004',
   'JBL Charge 5 Bluetooth Speaker',
   'Teal color. IP67 waterproof. 20 hours battery. Great for pool parties. Barely used.',
   95.00, 'Electronics', '{"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400"}', 'active'),

  -- Olivia's listings (clothing)
  ('b1000000-0013-4000-8000-000000000013', 'a1b2c3d4-0005-4000-8000-000000000005',
   'Levi''s 501 Original Fit Jeans',
   'Classic straight leg, medium wash. Size 28x30. Worn twice, basically new. Non-stretch denim.',
   45.00, 'Clothing', '{"https://images.unsplash.com/photo-1542272604-787c3835535d?w=400"}', 'active'),

  ('b1000000-0014-4000-8000-000000000014', 'a1b2c3d4-0005-4000-8000-000000000005',
   'Patagonia Better Sweater Fleece',
   'Women''s size M, New Navy color. Full-zip, jersey-lined. Machine washable. Excellent condition.',
   89.00, 'Clothing', '{"https://images.unsplash.com/photo-1434389677669-e08b4cda3a40?w=400"}', 'active'),

  ('b1000000-0015-4000-8000-000000000015', 'a1b2c3d4-0005-4000-8000-000000000005',
   'Nike Air Max 90 Sneakers',
   'White/Black colorway. Women''s size 8. Only worn a handful of times. No creasing. Original box.',
   78.00, 'Clothing', '{"https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400"}', 'active')
on conflict (id) do nothing;

-- ============================================================
-- MESSAGES (10 conversations about listings)
-- ============================================================
insert into public.messages (id, sender_id, recipient_id, listing_id, content, read) values
  -- Marcus asks Sarah about the coffee table
  ('c1000000-0001-4000-8000-000000000001',
   'a1b2c3d4-0002-4000-8000-000000000002', 'a1b2c3d4-0001-4000-8000-000000000001',
   'b1000000-0001-4000-8000-000000000001',
   'Hi Sarah! Is the teak coffee table still available? I can pick up this weekend.', true),

  ('c1000000-0002-4000-8000-000000000002',
   'a1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0002-4000-8000-000000000002',
   'b1000000-0001-4000-8000-000000000001',
   'Hi Marcus! Yes, it''s still available. Saturday afternoon works great for pickup.', true),

  -- Elena asks Marcus about the headphones
  ('c1000000-0003-4000-8000-000000000003',
   'a1b2c3d4-0003-4000-8000-000000000003', 'a1b2c3d4-0002-4000-8000-000000000002',
   'b1000000-0004-4000-8000-000000000004',
   'Would you take $220 for the Sony headphones? I can meet locally.', true),

  ('c1000000-0004-4000-8000-000000000004',
   'a1b2c3d4-0002-4000-8000-000000000002', 'a1b2c3d4-0003-4000-8000-000000000003',
   'b1000000-0004-4000-8000-000000000004',
   'I could do $230 since they''re practically new. Deal?', false),

  -- Olivia asks Elena about the backpack
  ('c1000000-0005-4000-8000-000000000005',
   'a1b2c3d4-0005-4000-8000-000000000005', 'a1b2c3d4-0003-4000-8000-000000000003',
   'b1000000-0007-4000-8000-000000000007',
   'Is the Osprey backpack good for a 5-day trek? I''m planning a trip to Patagonia.', true),

  ('c1000000-0006-4000-8000-000000000006',
   'a1b2c3d4-0003-4000-8000-000000000003', 'a1b2c3d4-0005-4000-8000-000000000005',
   'b1000000-0007-4000-8000-000000000007',
   'Absolutely! I used it on a 7-day trek and it was incredibly comfortable. The AG suspension really makes a difference.', true),

  -- James asks about sneakers
  ('c1000000-0007-4000-8000-000000000007',
   'a1b2c3d4-0004-4000-8000-000000000004', 'a1b2c3d4-0005-4000-8000-000000000005',
   'b1000000-0015-4000-8000-000000000015',
   'Do you have these in men''s sizing or only women''s?', false),

  -- Sarah asks about the turntable
  ('c1000000-0008-4000-8000-000000000008',
   'a1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0004-4000-8000-000000000004',
   'b1000000-0011-4000-8000-000000000011',
   'I''m new to vinyl - is this turntable good for a beginner? Does it come with a dust cover?', true),

  ('c1000000-0009-4000-8000-000000000009',
   'a1b2c3d4-0004-4000-8000-000000000004', 'a1b2c3d4-0001-4000-8000-000000000001',
   'b1000000-0011-4000-8000-000000000011',
   'It''s perfect for beginners! Yes, dust cover is included. The built-in preamp means you can connect directly to powered speakers.', true),

  -- Marcus messages Elena about the tent
  ('c1000000-0010-4000-8000-000000000010',
   'a1b2c3d4-0002-4000-8000-000000000002', 'a1b2c3d4-0003-4000-8000-000000000003',
   'b1000000-0008-4000-8000-000000000008',
   'Hey Elena, does the tent come with a footprint/ground cloth?', false)
on conflict (id) do nothing;

-- ============================================================
-- FAVORITES (8 saves)
-- ============================================================
insert into public.favorites (id, user_id, listing_id) values
  ('d1000000-0001-4000-8000-000000000001', 'a1b2c3d4-0002-4000-8000-000000000002', 'b1000000-0001-4000-8000-000000000001'),  -- Marcus likes coffee table
  ('d1000000-0002-4000-8000-000000000002', 'a1b2c3d4-0002-4000-8000-000000000002', 'b1000000-0010-4000-8000-000000000010'), -- Marcus likes guitar
  ('d1000000-0003-4000-8000-000000000003', 'a1b2c3d4-0003-4000-8000-000000000003', 'b1000000-0004-4000-8000-000000000004'), -- Elena likes headphones
  ('d1000000-0004-4000-8000-000000000004', 'a1b2c3d4-0005-4000-8000-000000000005', 'b1000000-0007-4000-8000-000000000007'), -- Olivia likes backpack
  ('d1000000-0005-4000-8000-000000000005', 'a1b2c3d4-0005-4000-8000-000000000005', 'b1000000-0003-4000-8000-000000000003'), -- Olivia likes plates
  ('d1000000-0006-4000-8000-000000000006', 'a1b2c3d4-0001-4000-8000-000000000001', 'b1000000-0011-4000-8000-000000000011'), -- Sarah likes turntable
  ('d1000000-0007-4000-8000-000000000007', 'a1b2c3d4-0001-4000-8000-000000000001', 'b1000000-0013-4000-8000-000000000013'), -- Sarah likes jeans
  ('d1000000-0008-4000-8000-000000000008', 'a1b2c3d4-0004-4000-8000-000000000004', 'b1000000-0009-4000-8000-000000000009')  -- James likes Garmin watch
on conflict (user_id, listing_id) do nothing;
