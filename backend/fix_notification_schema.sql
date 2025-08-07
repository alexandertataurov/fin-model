-- Fix notification schema issues
-- This script manually fixes the column name mismatch

-- Check if notifications table has 'type' column and rename it
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'notifications' 
        AND column_name = 'type'
    ) THEN
        ALTER TABLE notifications RENAME COLUMN type TO notification_type;
        RAISE NOTICE 'Renamed type column to notification_type in notifications table';
    ELSE
        RAISE NOTICE 'type column not found in notifications table';
    END IF;
END $$;

-- Check if notification_templates table exists and has 'type' column
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'notification_templates'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'notification_templates' 
        AND column_name = 'type'
    ) THEN
        ALTER TABLE notification_templates RENAME COLUMN type TO notification_type;
        RAISE NOTICE 'Renamed type column to notification_type in notification_templates table';
    ELSE
        RAISE NOTICE 'notification_templates table or type column not found';
    END IF;
END $$;

-- Update indexes if they exist
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'ix_notifications_type'
    ) THEN
        DROP INDEX ix_notifications_type;
        CREATE INDEX ix_notifications_notification_type ON notifications(notification_type);
        RAISE NOTICE 'Updated notification type index';
    END IF;
END $$;
