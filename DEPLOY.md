# 🚀 Guia de Deploy - AgroLearning

Este guia te ajudará a fazer o deploy da aplicação AgroLearning no seu servidor Ubuntu.

## 📋 Pré-requisitos

- Servidor Ubuntu (testado na 20.04/22.04)
- Acesso SSH ao servidor
- Git instalado localmente
- Conta no GitHub (ou GitLab/Bitbucket)

## 🎯 Passo a Passo

### 1. Configurar Repositório Git (Local)

```bash
# No seu computador, dentro do projeto
git init
git add .
git commit -m "Initial commit - AgroLearning"

# Criar repositório no GitHub e adicionar remote
git remote add origin https://github.com/SEU_USUARIO/agrolearning.git
git branch -M main
git push -u origin main
```

### 2. Conectar ao Servidor

```bash
ssh root@185.187.169.198
# ou
ssh seu_usuario@185.187.169.198
```

### 3. Executar Deploy Automático

```bash
# Baixar e executar script de deploy
curl -o deploy.sh https://raw.githubusercontent.com/SEU_USUARIO/agrolearning/main/deploy.sh
chmod +x deploy.sh

# Editar o script para adicionar a URL do seu repositório
nano deploy.sh
# Altere a linha: REPO_URL="https://github.com/SEU_USUARIO/agrolearning.git"

# Executar deploy
./deploy.sh
```

### 4. Configurar SSL (Opcional mas Recomendado)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obter certificado SSL (substitua pelo seu domínio)
sudo certbot --nginx -d seu-dominio.com

# Renovação automática
sudo crontab -e
# Adicionar linha: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔧 Comandos Úteis

### Gerenciamento da Aplicação
```bash
# Ver status
pm2 status

# Ver logs
pm2 logs agrolearning

# Reiniciar
pm2 restart agrolearning

# Parar
pm2 stop agrolearning

# Iniciar
pm2 start agrolearning
```

### Atualização Rápida
```bash
# No servidor, execute:
./update.sh
```

### Nginx
```bash
# Testar configuração
sudo nginx -t

# Recarregar configuração
sudo systemctl reload nginx

# Ver status
sudo systemctl status nginx
```

### Logs
```bash
# Logs da aplicação
pm2 logs agrolearning

# Logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Logs do sistema
sudo journalctl -u nginx -f
```

## 🔒 Segurança

### Configurações Recomendadas

```bash
# Configurar firewall
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'

# Desabilitar login root via SSH (se usando usuário não-root)
sudo nano /etc/ssh/sshd_config
# PermitRootLogin no
sudo systemctl restart ssh

# Atualizar sistema regularmente
sudo apt update && sudo apt upgrade -y
```

## 🐛 Solução de Problemas

### Aplicação não inicia
```bash
# Verificar logs
pm2 logs agrolearning

# Verificar se a porta está em uso
sudo netstat -tlnp | grep :3000

# Reiniciar PM2
pm2 kill
pm2 start ecosystem.config.js
```

### Nginx não funciona
```bash
# Verificar configuração
sudo nginx -t

# Ver logs de erro
sudo tail -f /var/log/nginx/error.log

# Reiniciar Nginx
sudo systemctl restart nginx
```

### Problemas de Build
```bash
# Limpar cache e reinstalar
rm -rf node_modules .next
pnpm install
pnpm build
```

## 📊 Monitoramento

### PM2 Web Interface (Opcional)
```bash
# Instalar PM2 Plus
pm2 install pm2-server-monit
```

### Logs Estruturados
```bash
# Ver logs em tempo real
pm2 logs agrolearning --lines 100 -f
```

## 🔄 Processo de Atualização

1. **Desenvolvimento Local**: Fazer mudanças e commit
2. **Push**: `git push origin main`
3. **Deploy**: No servidor, executar `./update.sh`

## 📞 Suporte

Se encontrar problemas:

1. Verificar logs: `pm2 logs agrolearning`
2. Verificar status: `pm2 status`
3. Verificar Nginx: `sudo nginx -t`
4. Verificar firewall: `sudo ufw status`

---

**🎉 Parabéns! Sua aplicação AgroLearning está no ar!**

Acesse: http://185.187.169.198 (ou seu domínio configurado)
