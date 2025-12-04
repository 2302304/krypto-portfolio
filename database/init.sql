-- Kryptovaluutta Portfolio Database Schema
-- Luotu: 2024

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    settings JSONB DEFAULT '{
        "currency": "EUR",
        "language": "fi",
        "theme": "light",
        "notifications": true
    }'::jsonb
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    crypto_symbol VARCHAR(20) NOT NULL,
    crypto_name VARCHAR(100) NOT NULL,
    amount DECIMAL(20, 8) NOT NULL,
    price_eur DECIMAL(20, 2) NOT NULL,
    total_eur DECIMAL(20, 2) NOT NULL,
    transaction_type VARCHAR(10) NOT NULL CHECK (transaction_type IN ('buy', 'sell')),
    transaction_date TIMESTAMP NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Price cache table
CREATE TABLE IF NOT EXISTS price_cache (
    id SERIAL PRIMARY KEY,
    crypto_symbol VARCHAR(20) UNIQUE NOT NULL,
    crypto_name VARCHAR(100) NOT NULL,
    price_eur DECIMAL(20, 2) NOT NULL,
    price_usd DECIMAL(20, 2) NOT NULL,
    market_cap BIGINT,
    volume_24h BIGINT,
    change_24h DECIMAL(10, 2),
    change_7d DECIMAL(10, 2),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_symbol ON transactions(crypto_symbol);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_user_symbol ON transactions(user_id, crypto_symbol);
CREATE INDEX IF NOT EXISTS idx_price_cache_symbol ON price_cache(crypto_symbol);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing (optional, remove in production)
-- Test user: test@example.com, password: Test1234!
-- Password hash generated with bcrypt (10 rounds)
INSERT INTO users (email, password_hash) VALUES 
    ('test@example.com', '$2b$10$rBV2JDeWW3.vKyYh3jVZbOxK7ZqR3oGS5vBaF2YJKqX.gYPWZ2wqK')
ON CONFLICT (email) DO NOTHING;

-- Insert some popular cryptocurrencies to price_cache
INSERT INTO price_cache (crypto_symbol, crypto_name, price_eur, price_usd, market_cap, volume_24h, change_24h, change_7d) VALUES
    ('BTC', 'Bitcoin', 90000.00, 95000.00, 1800000000000, 50000000000, 2.5, 5.3),
    ('ETH', 'Ethereum', 3200.00, 3400.00, 400000000000, 20000000000, 1.8, 3.2),
    ('BNB', 'Binance Coin', 580.00, 615.00, 90000000000, 2000000000, -0.5, 1.2),
    ('SOL', 'Solana', 220.00, 235.00, 100000000000, 5000000000, 3.2, 8.5),
    ('XRP', 'Ripple', 0.52, 0.55, 30000000000, 2000000000, -1.2, -2.5)
ON CONFLICT (crypto_symbol) DO NOTHING;

-- Verify setup
SELECT 'Database setup completed successfully!' AS status;
