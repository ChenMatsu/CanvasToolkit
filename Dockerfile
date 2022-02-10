FROM node:16-alpine AS development
ENV NODE_ENV development

WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

CMD ["npm","start" ]