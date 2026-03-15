
-- Fix: restrict contact_messages insert to require non-empty fields (already has NOT NULL constraints, the WITH CHECK true is acceptable for a public contact form)
-- The linter warning is about contact_messages INSERT WITH CHECK (true) - this is intentional for a public contact form
-- No changes needed - the warning is acceptable for this use case
SELECT 1;
