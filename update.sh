#!/bin/bash

# Script de atualização para AgroLearning
# Execute este script no servidor para atualizações rápidas

set -e

APP_NAME="agrolearning"
APP_DIR="/var/www/$APP_NAME"

echo "🔄 Atualizando AgroLearning..."

# Ir para o diretório da aplicação
cd $APP_DIR

# Fazer backup da versão atual
echo "💾 Fazendo backup..."
pm2 save

# Puxar últimas mudanças
echo "📥 Baixando últimas mudanças..."
git pull origin main

# Instalar/atualizar dependências
echo "📦 Atualizando dependências..."
pnpm install --frozen-lockfile

# Fazer novo build
echo "🏗️  Fazendo novo build..."
pnpm build

# Reiniciar aplicação
echo "🔄 Reiniciando aplicação..."
pm2 restart $APP_NAME

echo "✅ Atualização concluída!"
echo "🌐 Aplicação atualizada e rodando"

# Mostrar status
pm2 status
