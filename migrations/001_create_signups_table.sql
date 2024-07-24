-- migrations/001_create_signups_table.sql

CREATE TABLE signups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT,
    last_name TEXT,
    email_address TEXT NOT NULL,
    zip_code TEXT,
    source_ip TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source_url TEXT
);
