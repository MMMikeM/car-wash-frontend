FROM nginx:latest

WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get install -y curl

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -

RUN apt-get update

RUN apt-get install -y nodejs

COPY . .

RUN npm install

RUN npm run-script build
