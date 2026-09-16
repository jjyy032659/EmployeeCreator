output "app_url" {
  description = "URL of the deployed application"
  value       = "http://${aws_instance.app.public_ip}"
}

output "instance_public_ip" {
  description = "Public IP of the EC2 instance, for SSH"
  value       = aws_instance.app.public_ip
}

output "ecr_api_url" {
  description = "ECR repository URL for the API image"
  value       = aws_ecr_repository.api.repository_url
}

output "ecr_client_url" {
  description = "ECR repository URL for the client image"
  value       = aws_ecr_repository.client.repository_url
}

output "db_endpoint" {
  description = "RDS endpoint"
  value       = aws_db_instance.main.address
}
output "instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.app.id
}