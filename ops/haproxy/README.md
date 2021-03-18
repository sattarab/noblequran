# Development

This process will need to be done once and the same certificate will be re-used by all the developers

## Install certbot

### Install certbot dns route53 plugin
pip3 install certbot-dns-route53

## Generate certificate for localhost
- sudo certbot -d local.noblequran.cloud --manual --preferred-challenges dns certonly
- Copy generated certificate crt and pem from `/etc/letsencrypt/live/local.noblequran.cloud` to the repository under `/ops/haproxy/ssl`

## Validate haproxy
haproxy -c -V -f ./dev.cfg

## Run
Run `npm run start:haproxy` from the `noblequran` root folder

## Renew certificate
Run script `./scripts/renew-local-ssl.sh` from `noblequran` root folder
