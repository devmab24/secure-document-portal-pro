-- Allow authenticated users to read objects from the documents bucket so that
-- recipients of shared documents can generate signed download URLs.
-- Access to specific files is gated by application-level sharing (document_shares).
CREATE POLICY "Authenticated users can read documents bucket"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'documents');