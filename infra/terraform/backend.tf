#
terraform {
    cloud {
        organization = "debtonate"

        workspaces {
            name = "debtonate"
        }
    }

    required_version = ">= 1.1.2"
}
