ALTER TABLE vehicles
ADD COLUMN year INTEGER,
ADD COLUMN mileage INTEGER,
ADD COLUMN vin VARCHAR(17) UNIQUE,
ADD COLUMN trim_level VARCHAR(255),
ADD COLUMN engine_type VARCHAR(255),
ADD COLUMN transmission VARCHAR(255),
ADD COLUMN color VARCHAR(255),
ADD COLUMN status VARCHAR(50);

CREATE TABLE vehicle_media (
    id UUID PRIMARY KEY,
    vehicle_id UUID NOT NULL,
    media_url VARCHAR(255) NOT NULL,
    media_type VARCHAR(50) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_vehicle_media FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE vehicle_condition_reports (
    id UUID PRIMARY KEY,
    vehicle_id UUID NOT NULL UNIQUE,
    scratches_description TEXT,
    tire_tread_depth_mm INTEGER,
    general_condition_score INTEGER,
    report_date TIMESTAMP NOT NULL,
    CONSTRAINT fk_vehicle_condition FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);
