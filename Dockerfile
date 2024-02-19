FROM node:current-alpine3.10
RUN apk add curl
RUN npm install -g serve
COPY build build
HEALTHCHECK CMD curl --fail http://localhost:3000 || exit 1
CMD ["serve","-s","build","-l","3000"]