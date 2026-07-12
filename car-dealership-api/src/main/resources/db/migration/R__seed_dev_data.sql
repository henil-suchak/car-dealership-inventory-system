-- Seed data for development environment

-- Admin user (password is 'admin123')
-- Bcrypt hash for 'admin123' with 10 rounds
INSERT INTO users (id, username, email, password, role)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'admin_demo',
    'admin@dealership.com',
    '$2a$10$5dCBJupBtnBwkhQ/RReczucNHRv8uR28B12YV/TGxyEsW7Fy7bnXO',
    'ADMIN'
) ON CONFLICT (email) DO NOTHING;

-- Sample Vehicles
INSERT INTO vehicles (id, make, model, category, price, quantity_in_stock, version)
VALUES 
    ('22222222-2222-2222-2222-222222222221', 'Toyota', 'Camry', 'SEDAN', 28000.00, 5, 0),
    ('22222222-2222-2222-2222-222222222222', 'Honda', 'Civic', 'SEDAN', 25000.00, 3, 0),
    ('22222222-2222-2222-2222-222222222223', 'Ford', 'F-150', 'TRUCK', 45000.00, 10, 0),
    ('22222222-2222-2222-2222-222222222224', 'Chevrolet', 'Silverado', 'TRUCK', 42000.00, 8, 0),
    ('22222222-2222-2222-2222-222222222225', 'Toyota', 'RAV4', 'SUV', 32000.00, 15, 0),
    ('22222222-2222-2222-2222-222222222226', 'Honda', 'CR-V', 'SUV', 31000.00, 12, 0),
    ('22222222-2222-2222-2222-222222222227', 'Ford', 'Mustang', 'COUPE', 36000.00, 2, 0),
    ('22222222-2222-2222-2222-222222222228', 'Volkswagen', 'Golf', 'HATCHBACK', 24000.00, 6, 0)
ON CONFLICT (id) DO NOTHING;
