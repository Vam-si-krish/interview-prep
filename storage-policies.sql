-- Storage RLS policies for the 'recordings' bucket
-- Run this if recordings aren't saving (upload fails silently without these)

-- Allow authenticated users to upload files
CREATE POLICY "authenticated users can upload"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'recordings');

-- Allow public to read/play recordings via URL
CREATE POLICY "public can read recordings"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'recordings');

-- Allow users to update their own files
CREATE POLICY "users can update own files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'recordings' AND auth.uid()::text = (storage.foldername(name))[2]);

-- Allow users to delete their own files
CREATE POLICY "users can delete own files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'recordings' AND auth.uid()::text = (storage.foldername(name))[2]);
