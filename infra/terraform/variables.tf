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
