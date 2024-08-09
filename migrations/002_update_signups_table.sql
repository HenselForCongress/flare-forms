-- migrations/002_update_signups_table.sql

-- Drop the existing signups table
DROP TABLE IF EXISTS signups;

-- Re-create the signups table with all desired columns
CREATE TABLE signups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT,
    last_name TEXT,
    email_address TEXT NOT NULL,
    zip_code TEXT,
    source_ip TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    source_url TEXT,
    message TEXT,
    form_name TEXT,
    user_agent TEXT,
    country TEXT,
    region TEXT,
    city TEXT,
    timezone TEXT
);
