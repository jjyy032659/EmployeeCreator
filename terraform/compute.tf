data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

resource "aws_iam_role" "ec2" {
  name = "${var.project_name}-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecr_read" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_iam_instance_profile" "ec2" {
  name = "${var.project_name}-ec2-profile"
  role = aws_iam_role.ec2.name
}

resource "aws_instance" "app" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public[0].id
  vpc_security_group_ids = [aws_security_group.ec2.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2.name
  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }
  user_data = templatefile("${path.module}/user-data.sh", {
    aws_region   = var.aws_region
    account_id   = data.aws_caller_identity.current.account_id
    project_name = var.project_name
    db_host      = aws_db_instance.main.address
    db_name      = var.db_name
    db_username  = var.db_username
    db_password  = var.db_password
  })

  user_data_replace_on_change = true

  tags = {
    Name = "${var.project_name}-app"
  }

  depends_on = [aws_db_instance.main]
}

data "aws_caller_identity" "current" {}