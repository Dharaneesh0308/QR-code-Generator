-- Create storage bucket for QR media files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'qr-media',
  'qr-media',
  true,
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
);

-- Allow anyone to upload files (we'll add more specific policies if needed)
CREATE POLICY "Anyone can upload media files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'qr-media');

-- Allow anyone to view media files (public bucket)
CREATE POLICY "Anyone can view media files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'qr-media');