-- migrations/002_update_signups_table.sql

-- Add new columns
ALTER TABLE signups ADD COLUMN message TEXT;
ALTER TABLE signups ADD COLUMN form_name TEXT;
ALTER TABLE signups ADD COLUMN user_agent TEXT;

-- Change the data type of created_at and updated_at to TIMESTAMPTZ
ALTER TABLE signups ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC';
ALTER TABLE signups ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'UTC';
