variable "project_id" {
  description = "GCP Project ID hosting all cloud resources"
  default = "debtonate"
}

variable "region" {
  default = "us-central1"
}

variable "primary_zone" {
  default = "us-central1-c"
}

variable "gcp-credentials" {
  description = "Token to authenticate with Google"
  default = ""
}

variable "organization_name" {
  default = "debtonate"
}


variable "group1_region" {
  default = "us-west1"
}

variable "group2_region" {
  default = "us-central1"
}

variable "group3_region" {
  default = "us-east1"
}

variable "network_name" {
  default = "debtonate-https-network"
}
