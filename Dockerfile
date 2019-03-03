FROM node:10-alpine

# Create app directory
WORKDIR /tmp/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install node_modules
RUN npm ci

# Bundle app source
COPY . .

# Build project
ENV NODE_ENV production
RUN npm run build

# Move built files to own directory
RUN mkdir /usr/src
RUN mkdir /usr/src/app
RUN mv ./dist /usr/src/app/dist
RUN mv ./serve.json /usr/src/app/serve.json

# Delte tempory working directory
WORKDIR /tmp 
RUN rm -rf ./app

# Switch to new folder
WORKDIR /usr/src/app

# Install serve globally
RUN npm i -g serve@10.1.1

EXPOSE 80

ENTRYPOINT [ "serve", "-s", "-l", "80" ]
