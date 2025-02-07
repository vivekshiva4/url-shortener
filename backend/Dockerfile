# backend/Dockerfile
FROM node:18

WORKDIR /app

# Copy package files and install dependencies.
COPY package.json package-lock.json ./
RUN npm install

# Copy the backend source code.
COPY . .

# Build the TypeScript code.
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
