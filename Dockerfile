FROM node
RUN mkdir -p /usr/src/claro-backend
WORKDIR /usr/src/claro-backend
COPY package.json /usr/src/claro-backend/
RUN npm install
COPY . /usr/src/claro-backend
EXPOSE 3700
CMD [ "npm", "start" ]