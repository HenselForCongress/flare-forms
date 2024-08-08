-- migrations/003_add_new_columns.sql

-- Add new columns
ALTER TABLE signups ADD COLUMN country TEXT;
ALTER TABLE signups ADD COLUMN region TEXT;
ALTER TABLE signups ADD COLUMN city TEXT;
ALTER TABLE signups ADD COLUMN timezone TEXT;
