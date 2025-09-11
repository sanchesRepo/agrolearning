#!/bin/bash

# Script de configuração inicial do servidor Ubuntu
# Execute este script ANTES do deploy.sh

set -e

echo "🔧 Configurando servidor Ubuntu para AgroLearning..."

# Atualizar sistema
echo "📦 Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar dependências básicas
echo "📦 Instalando dependências básicas..."
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Instalar Nginx
echo "🌐 Instalando Nginx..."
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Instalar Node.js 20 LTS
echo "📦 Instalando Node.js 20 LTS..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar versões
echo "✅ Versões instaladas:"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "Nginx: $(nginx -v 2>&1)"

# Instalar pnpm globalmente
echo "📦 Instalando pnpm..."
sudo npm install -g pnpm

# Instalar PM2 globalmente
echo "📦 Instalando PM2..."
sudo npm install -g pm2

# Configurar PM2 para iniciar com o sistema
echo "🔄 Configurando PM2 startup..."
sudo pm2 startup systemd -u $USER --hp $HOME
pm2 save

# Criar diretórios necessários
echo "📁 Criando diretórios..."
sudo mkdir -p /var/www
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/www
sudo chown -R $USER:$USER /var/log/pm2

# Configurar firewall básico
echo "🔒 Configurando firewall..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'

# Criar usuário para deploy (opcional)
read -p "Deseja criar um usuário específico para deploy? (y/N): " create_user
if [[ $create_user == "y" || $create_user == "Y" ]]; then
    read -p "Nome do usuário: " username
    sudo adduser $username
    sudo usermod -aG sudo $username
    sudo usermod -aG www-data $username
    echo "✅ Usuário $username criado com sucesso!"
fi

# Configurar swap (se não existir)
if [ ! -f /swapfile ]; then
    echo "💾 Configurando swap de 2GB..."
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

# Otimizar configurações do sistema
echo "⚡ Otimizando configurações do sistema..."

# Configurar limites de arquivos
sudo tee -a /etc/security/limits.conf > /dev/null <<EOF
* soft nofile 65536
* hard nofile 65536
root soft nofile 65536
root hard nofile 65536
EOF

# Configurar sysctl
sudo tee -a /etc/sysctl.conf > /dev/null <<EOF
# Otimizações para aplicações Node.js
net.core.somaxconn = 65536
net.ipv4.tcp_max_syn_backlog = 65536
net.ipv4.ip_local_port_range = 1024 65536
vm.swappiness = 10
EOF

sudo sysctl -p

# Configurar logrotate para PM2
sudo tee /etc/logrotate.d/pm2 > /dev/null <<EOF
/var/log/pm2/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    copytruncate
    su $USER $USER
}
EOF

echo "✅ Configuração inicial do servidor concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure seu repositório Git"
echo "2. Execute o script deploy.sh"
echo "3. Configure SSL com certbot (opcional)"
echo ""
echo "🔧 Comandos úteis:"
echo "  sudo systemctl status nginx  - Status do Nginx"
echo "  pm2 status                   - Status das aplicações PM2"
echo "  sudo ufw status             - Status do firewall"
