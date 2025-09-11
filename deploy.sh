#!/bin/bash

# Script de deploy para AgroLearning
# Execute este script no servidor Ubuntu

set -e

echo "🚀 Iniciando deploy do AgroLearning..."

# Definir variáveis
APP_NAME="agrolearning"
APP_DIR="/var/www/$APP_NAME"
REPO_URL="https://github.com/sanchesRepo/agrolearning.git"  # Substitua pelo seu repo
NGINX_CONFIG="/etc/nginx/sites-available/$APP_NAME"
DOMAIN="185.187.169.198"  # Pode ser substituído pelo seu domínio

# Função para verificar se um comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Atualizar sistema
echo "📦 Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 20 LTS se não existir
if ! command_exists node; then
    echo "📦 Instalando Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Instalar pnpm se não existir
if ! command_exists pnpm; then
    echo "📦 Instalando pnpm..."
    sudo npm install -g pnpm
fi

# Instalar PM2 se não existir
if ! command_exists pm2; then
    echo "📦 Instalando PM2..."
    sudo npm install -g pm2
    sudo pm2 startup
fi

# Criar diretório da aplicação
echo "📁 Criando diretório da aplicação..."
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# Clonar ou atualizar repositório
if [ -d "$APP_DIR/.git" ]; then
    echo "🔄 Atualizando código do repositório..."
    cd $APP_DIR
    git pull origin main
else
    echo "📥 Clonando repositório..."
    git clone $REPO_URL $APP_DIR
    cd $APP_DIR
fi

# Instalar dependências
echo "📦 Instalando dependências..."
pnpm install --frozen-lockfile

# Build da aplicação
echo "🏗️  Fazendo build da aplicação..."
pnpm build

# Parar aplicação se estiver rodando
echo "🛑 Parando aplicação anterior..."
pm2 stop $APP_NAME || true
pm2 delete $APP_NAME || true

# Iniciar aplicação com PM2
echo "🚀 Iniciando aplicação com PM2..."
pm2 start ecosystem.config.js
pm2 save

# Configurar Nginx
echo "🌐 Configurando Nginx..."
sudo tee $NGINX_CONFIG > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }

    # Configuração para arquivos estáticos
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /public/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        expires 1y;
        add_header Cache-Control "public";
    }
}
EOF

# Ativar site no Nginx
sudo ln -sf $NGINX_CONFIG /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Configurar firewall
echo "🔒 Configurando firewall..."
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw --force enable

echo "✅ Deploy concluído com sucesso!"
echo "🌐 Aplicação disponível em: http://$DOMAIN"
echo ""
echo "Comandos úteis:"
echo "  pm2 status          - Ver status da aplicação"
echo "  pm2 logs $APP_NAME  - Ver logs da aplicação"
echo "  pm2 restart $APP_NAME - Reiniciar aplicação"
echo "  pm2 stop $APP_NAME  - Parar aplicação"
