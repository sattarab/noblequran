#!/bin/bash
sudo certbot certonly --dns-route53 -d local.noblequran.cloud
nobleQuranPath=$(dirname $BASH_SOURCE)
sudo cat /etc/letsencrypt/live/local.noblequran.cloud/fullchain.pem /etc/letsencrypt/live/local.noblequran.cloud/privkey.pem > "$nobleQuranPath/../ops/haproxy/ssl/localhost.pem"
sudo cat /etc/letsencrypt/live/local.noblequran.cloud/cert.pem > "$nobleQuranPath/../ops/haproxy/ssl/localhost.crt"
