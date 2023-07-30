
output "bucket_url" {
    description = "The auto-generated URL for the GCS bucket"
    value       = resource.google_storage_bucket.static_website.url
}
