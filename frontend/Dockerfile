FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 3000

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV WATCHPACK_POLLING=true
ENV HOSTNAME=0.0.0.0

# Use a more robust command for development
CMD ["sh", "-c", "npx next dev --turbopack --hostname 0.0.0.0"] 