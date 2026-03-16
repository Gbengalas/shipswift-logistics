
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS package_type text DEFAULT null;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS delivery_speed text DEFAULT 'standard';
