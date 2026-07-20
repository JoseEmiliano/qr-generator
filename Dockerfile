services:
  qr-generator:
    image: node:20-alpine
    container_name: qr-generator
    working_dir: /app
    restart: unless-stopped

    command: >
      sh -c "
      apk add --no-cache git &&
      rm -rf /app/* &&
      git clone https://github.com/JoseEmiliano/qr-generator.git /app &&
      npm install &&
      node app.js
      "

    ports:
      - "3000:3000"
