#
provider "google" {
    project     = var.project_id
    region      = var.region
    zone        = var.primary_zone
    credentials = var.gcp-credentials
}
