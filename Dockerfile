# Dockerfile para m-site (Static Site)
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Instala o pacote serve globalmente para servir os arquivos estáticos
RUN npm install -g serve

# Copia todos os arquivos do site para o container
COPY . .

# Expõe a porta que o serve utilizará (o padrão do usuário era 3000)
EXPOSE 3000

# Adiciona um healthcheck básico para garantir que o serviço está no ar
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Comando para iniciar o servidor estático mantendo a configuração do usuário
CMD ["serve", "-s", ".", "-p", "3000"]
