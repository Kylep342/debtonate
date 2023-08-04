# Code for Bucket taken from https://cloud.google.com/storage/docs/hosting-static-website#storage-create-bucket-terraform


# Create new storage bucket in the US multi-region
# and settings for main_page_suffix and not_found_page
resource "random_id" "bucket_prefix" {
  byte_length = 8
}

resource "google_storage_bucket" "static_website" {
  name          = "${random_id.bucket_prefix.hex}-static-website-bucket"
  location      = "US"
  storage_class = "STANDARD"
  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }
}

# Make bucket public by granting allUsers READER access
resource "google_storage_bucket_access_control" "public_rule" {
  bucket = google_storage_bucket.static_website.id
  role   = "READER"
  entity = "allUsers"
}

resource "google_compute_network" "default" {
  name                    = var.network_name
  auto_create_subnetworks = "false"
}

resource "google_compute_subnetwork" "group1" {
  name                     = var.network_name
  ip_cidr_range            = "10.125.0.0/20"
  network                  = google_compute_network.default.self_link
  region                   = var.group1_region
  private_ip_google_access = true
}

locals {
  health_check = {
    request_path = "/"
    port         = 80
  }
}

# [START cloudloadbalancing_ext_http_gce_plus_bucket]
module "gce-lb-https" {
  source  = "GoogleCloudPlatform/lb-http/google"
  name    = var.network_name
  project = var.project_id
  target_tags = []
  firewall_networks = [google_compute_network.default.self_link]
  url_map           = google_compute_url_map.debtonate-https-network.self_link
  create_url_map    = false
  ssl               = true
  private_key       = tls_private_key.debtonate.private_key_pem
  certificate       = tls_self_signed_cert.debtonate.cert_pem

  backends = {
    default = {
      protocol    = "HTTP"
      port        = 80
      port_name   = "http"
      timeout_sec = 10
      enable_cdn  = false
      groups      = []
      health_check = local.health_check
      log_config = {
        enable      = true
        sample_rate = 1.0
      }

      iap_config = {
        enable = false
      }
    }
  }
}

resource "google_compute_url_map" "debtonate-https-network" {
  // note that this is the name of the load balancer
  name            = var.network_name
  default_service = module.gce-lb-https.backend_services["default"].self_link

  host_rule {
    hosts        = ["*"]
    path_matcher = "allpaths"
  }

  path_matcher {
    name            = "allpaths"
    default_service = module.gce-lb-https.backend_services["default"].self_link

    path_rule {
      paths = [
        "/",
        "/*"
      ]
      service = google_storage_bucket.static_website.self_link
    }
  }
}
