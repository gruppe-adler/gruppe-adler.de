FROM node:10-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install node_modules
RUN npm ci
CMD [ "npm", "install", "serve" ]

CMD [ "npm", "build" ]

# Bundle app source
COPY serve.json .
COPY dist dist/

EXPOSE 80

CMD [ "npm", "start" ]