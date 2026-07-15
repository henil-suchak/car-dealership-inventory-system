CREATE TABLE purchases (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    vehicle_id UUID NOT NULL,
    purchase_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    purchase_price DECIMAL(15, 2) NOT NULL,
    CONSTRAINT fk_purchases_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_purchases_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

CREATE INDEX idx_purchases_user_id ON purchases(user_id);
