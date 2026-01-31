-- WARNING: This script will DELETE ALL USERS from the database
-- This action is IRREVERSIBLE
-- Only run this in development/testing environments

-- Delete all users from auth.users table
DELETE FROM auth.users;

-- Optional: Clean up related verification codes
DELETE FROM email_verification_codes;

-- Optional: Clean up password reset codes if you have them
-- DELETE FROM password_reset_codes;

SELECT 'All users have been deleted' AS status;
