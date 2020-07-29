FROM node:current-alpine3.10
RUN npm install -g serve
COPY build build
CMD ["serve","-s","build","-l","3000"]