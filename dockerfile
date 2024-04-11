FROM node:18-alpine as builder
WORKDIR /fe

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine as runner
WORKDIR /fe
COPY --from=builder /fe/package.json .
COPY --from=builder /fe/package-lock.json .
COPY --from=builder /fe/next.config.js ./
COPY --from=builder /fe/public ./public
COPY --from=builder /fe/.next/standalone ./
COPY --from=builder /fe/.next/static ./.next/static
EXPOSE 8060
ENTRYPOINT ["npm", "start"]