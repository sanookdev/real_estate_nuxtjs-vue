FROM node:22-alpine

WORKDIR /app

# Install dependencies (only system ones if needed, otherwise just node deps)
RUN apk add --no-cache bash

COPY package*.json ./
RUN npm install

COPY . .

# Make scripts executable
RUN chmod +x wait-for-it.sh run.sh

EXPOSE 5000

CMD ["bash", "./run.sh"]
