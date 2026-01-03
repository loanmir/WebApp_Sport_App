FROM node:latest

WORKDIR /var/www

RUN npm install -g nodemon

COPY ./app /var/www

RUN npm install

EXPOSE 8080
#CMD ["nodemon", "--watch", ".", "-e", "js", "app.js"]
CMD ["nodemon", "-L", "app.js"]
