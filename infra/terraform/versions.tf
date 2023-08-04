
terraform {
  required_version = ">= 1.1.2"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 3.53, < 5.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = ">= 4.40, < 5.0"
    }
    random = {
      source = "hashicorp/random"
    }
    tls = {
      source = "hashicorp/tls"
    }
  }
  cloud {
    organization = "debtonate"

    workspaces {
        name = "debtonate"
    }
  }
}