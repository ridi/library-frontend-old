FROM node:8

ADD . /htdocs/www/
RUN chown -R www-data.www-data /htdocs/www/
WORKDIR /htdocs/www

RUN npm install

EXPOSE 8080
CMD [ "npm", "run", "start" ]
