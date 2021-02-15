# Development

This process will need to be done once and the same certificate will be re-used by all the developers

## Install certbot

## Generate certificate for localhost
- sudo certbot -d local.noblequran.cloud --manual --preferred-challenges dns certonly
- Copy generated certificate crt and pem from `/etc/letsencrypt/live/local.noblequran.cloud` to the repository under `/ops/haproxy/ssl`

## Validate haproxy
haproxy -c -V -f ./dev.cfg

## Run
To run haproxy go into the `server` folder and run `npm run start-haproxy`