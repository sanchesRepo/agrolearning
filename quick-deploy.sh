#!/bin/bash

# Script de deploy rápido para AgroLearning
# Execute este script no seu computador local

set -e

SERVER_IP="185.187.169.198"
SERVER_USER="root"  # Altere se usar outro usuário
REPO_NAME="agrolearning"

echo "🚀 Deploy Rápido - AgroLearning"
echo "=================================="

# Verificar se Git está configurado
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Este diretório não é um repositório Git!"
    echo "Execute: git init && git add . && git commit -m 'Initial commit'"
    exit 1
fi

# Verificar se há mudanças não commitadas
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  Há mudanças não commitadas. Fazendo commit automaticamente..."
    git add .
    git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
fi

# Verificar se remote origin existe
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ Remote 'origin' não configurado!"
    echo "Configure seu repositório GitHub primeiro:"
    echo "git remote add origin https://github.com/SEU_USUARIO/$REPO_NAME.git"
    exit 1
fi

# Push para o repositório
echo "📤 Enviando código para o repositório..."
git push origin main

# Verificar conectividade com servidor
echo "🔌 Testando conexão com servidor..."
if ! ssh -o ConnectTimeout=10 $SERVER_USER@$SERVER_IP "echo 'Conexão OK'"; then
    echo "❌ Não foi possível conectar ao servidor!"
    echo "Verifique:"
    echo "  - IP do servidor: $SERVER_IP"
    echo "  - Usuário: $SERVER_USER"
    echo "  - Chave SSH configurada"
    exit 1
fi

# Menu de opções
echo ""
echo "Escolha uma opção:"
echo "1) Configuração inicial do servidor (primeira vez)"
echo "2) Deploy da aplicação"
echo "3) Atualização rápida (apenas código)"
echo "4) Deploy completo (configuração + aplicação)"
echo ""
read -p "Opção (1-4): " option

case $option in
    1)
        echo "🔧 Executando configuração inicial do servidor..."
        ssh $SERVER_USER@$SERVER_IP 'bash -s' < server-setup.sh
        echo "✅ Configuração inicial concluída!"
        ;;
    2)
        echo "🚀 Fazendo deploy da aplicação..."
        # Primeiro, enviar o script de deploy
        scp deploy.sh $SERVER_USER@$SERVER_IP:/tmp/
        # Executar no servidor
        ssh $SERVER_USER@$SERVER_IP "chmod +x /tmp/deploy.sh && /tmp/deploy.sh"
        echo "✅ Deploy concluído!"
        ;;
    3)
        echo "🔄 Fazendo atualização rápida..."
        # Enviar script de update
        scp update.sh $SERVER_USER@$SERVER_IP:/tmp/
        # Executar no servidor
        ssh $SERVER_USER@$SERVER_IP "chmod +x /tmp/update.sh && /tmp/update.sh"
        echo "✅ Atualização concluída!"
        ;;
    4)
        echo "🚀 Fazendo deploy completo..."
        # Configuração inicial
        ssh $SERVER_USER@$SERVER_IP 'bash -s' < server-setup.sh
        echo "✅ Configuração inicial concluída!"
        
        # Deploy da aplicação
        scp deploy.sh $SERVER_USER@$SERVER_IP:/tmp/
        ssh $SERVER_USER@$SERVER_IP "chmod +x /tmp/deploy.sh && /tmp/deploy.sh"
        echo "✅ Deploy completo concluído!"
        ;;
    *)
        echo "❌ Opção inválida!"
        exit 1
        ;;
esac

echo ""
echo "🎉 Processo concluído!"
echo "🌐 Acesse sua aplicação em: http://$SERVER_IP"
echo ""
echo "📋 Comandos úteis para o servidor:"
echo "  ssh $SERVER_USER@$SERVER_IP"
echo "  pm2 status"
echo "  pm2 logs agrolearning"
echo "  sudo systemctl status nginx"
