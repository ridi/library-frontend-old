FROM node:8

ADD . /htdocs/www/
RUN chown -R www-data.www-data /htdocs/www/
WORKDIR /htdocs/www

RUN yarn global add pm2
RUN yarn install
EXPOSE 8080
