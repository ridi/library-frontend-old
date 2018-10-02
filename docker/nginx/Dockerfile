FROM nginx:stable

ARG ENVIRONMENT
COPY docker/nginx/$ENVIRONMENT/nginx.conf /etc/nginx/nginx.conf

RUN touch /var/run/nginx.pid && \
  chown -R www-data:www-data /var/run/nginx.pid && \
  chown -R www-data:www-data /var/cache/nginx

COPY docs/docker/nginx/$ENVIRONMENT/node.conf /etc/nginx/conf.d
