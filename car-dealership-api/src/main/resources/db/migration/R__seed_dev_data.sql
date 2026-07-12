-- Seed data for development environment

-- Admin user (password is 'admin123')
INSERT INTO users (id, username, email, password, role)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'admin_demo',
    'admin@dealership.com',
    '$2a$10$5dCBJupBtnBwkhQ/RReczucNHRv8uR28B12YV/TGxyEsW7Fy7bnXO',
    'ADMIN'
) ON CONFLICT (email) DO NOTHING;

-- Customer user (password is 'client123')
INSERT INTO users (id, username, email, password, role)
VALUES (
    '11111111-1111-1111-1111-111111111112',
    'vip_client',
    'client@dealership.com',
    '$2a$10$Ew.qM.M6L9A9n701I.R7BOnYhN2VfS8R3D5/O.p8F2c1S/rO2MvC2', -- Hash for client123
    'USER'
) ON CONFLICT (email) DO NOTHING;

-- Premium Vehicles
INSERT INTO vehicles (id, make, model, category, price, quantity_in_stock, year, mileage, status, version)
VALUES 
    ('33333333-3333-3333-3333-333333333331', 'Rolls-Royce', 'Phantom', 'SEDAN', 493000.00, 1, 2024, 0, 'AVAILABLE', 0),
    ('33333333-3333-3333-3333-333333333332', 'Audi', 'RS e-tron GT', 'SEDAN', 147100.00, 2, 2024, 150, 'AVAILABLE', 0),
    ('33333333-3333-3333-3333-333333333333', 'BMW', 'M8 Competition', 'COUPE', 138800.00, 1, 2024, 50, 'AVAILABLE', 0),
    ('33333333-3333-3333-3333-333333333334', 'Porsche', '911 GT3 RS', 'COUPE', 241300.00, 0, 2024, 12, 'SOLD', 0),
    ('33333333-3333-3333-3333-333333333335', 'Lamborghini', 'Urus Performante', 'SUV', 269885.00, 1, 2024, 25, 'AVAILABLE', 0),
    ('33333333-3333-3333-3333-333333333336', 'Ferrari', '812 Superfast', 'COUPE', 335000.00, 1, 2023, 1500, 'AVAILABLE', 0),
    ('33333333-3333-3333-3333-333333333337', 'Mercedes-Benz', 'G 63 AMG', 'SUV', 179000.00, 3, 2024, 10, 'AVAILABLE', 0),
    ('33333333-3333-3333-3333-333333333338', 'Aston Martin', 'DB12', 'COUPE', 245000.00, 1, 2024, 5, 'IN_TRANSIT', 0)
ON CONFLICT (id) DO UPDATE SET 
    price = EXCLUDED.price,
    quantity_in_stock = EXCLUDED.quantity_in_stock,
    status = EXCLUDED.status;

-- premium vehicle images
INSERT INTO vehicle_media (id, vehicle_id, media_url, media_type, is_primary)
VALUES 
    ('44444444-4444-4444-4444-444444444441', '33333333-3333-3333-3333-333333333331', 'https://images.unsplash.com/photo-1631835773822-7945d8b8390e?q=80&w=2070&auto=format&fit=crop', 'IMAGE', true),
    ('44444444-4444-4444-4444-444444444442', '33333333-3333-3333-3333-333333333332', 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2070&auto=format&fit=crop', 'IMAGE', true),
    ('44444444-4444-4444-4444-444444444443', '33333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop', 'IMAGE', true),
    ('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333334', 'https://images.unsplash.com/photo-1503376712341-ea40ce367c34?q=80&w=2070&auto=format&fit=crop', 'IMAGE', true),
    ('44444444-4444-4444-4444-444444444445', '33333333-3333-3333-3333-333333333335', 'https://images.unsplash.com/photo-1660655816962-dcc78d7857ec?q=80&w=2070&auto=format&fit=crop', 'IMAGE', true),
    ('44444444-4444-4444-4444-444444444446', '33333333-3333-3333-3333-333333333336', 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=2070&auto=format&fit=crop', 'IMAGE', true),
    ('44444444-4444-4444-4444-444444444447', '33333333-3333-3333-3333-333333333337', 'https://images.unsplash.com/photo-1698651817551-ff7cc7fc7a35?q=80&w=2070&auto=format&fit=crop', 'IMAGE', true),
    ('44444444-4444-4444-4444-444444444448', '33333333-3333-3333-3333-333333333338', 'https://images.unsplash.com/photo-1634543781223-b68cd6df9480?q=80&w=2070&auto=format&fit=crop', 'IMAGE', true)
ON CONFLICT (id) DO UPDATE SET media_url = EXCLUDED.media_url;
