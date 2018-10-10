FROM nginx:stable

COPY docs/docker/nginx/nginx.conf /etc/nginx/nginx.conf

RUN touch /var/run/nginx.pid && \
  chown -R www-data:www-data /var/run/nginx.pid && \
  chown -R www-data:www-data /var/cache/nginx

ARG ENVIRONMENT
COPY docs/docker/nginx/$ENVIRONMENT/node.conf /etc/nginx/conf.d
