# Setup

## Create AWS Instance
- Create a t2.micro instance
- Use `prd-frontend` security group
- Use `20Gb` General Purpose SSD storage
- Add tags
  - `Environment`: `Production`

## Install update
`sudo yum update`

## Add welcome message

```
cd /etc/update-motd.d/
sudo vi 9999-environment#!/bin/sh
```

// Add following contents to the file
```
cat <<EOF

######################
# Prd PROXY 1 (LIVE) #
######################

EOF
```

```
sudo chmod +x 9999-environment
sudo /usr/sbin/update-motd
```

## Add directory structure

```

sudo su
cd /var/
mkdir www && cd www
mkdir noblequran && cd noblequran
mkdir log ssh ssl
chown -R ec2-user:ec2-user /var/www
```

## Install Certbot and generate certificate

```
sudo amazon-linux-extras install epel
yum install -y certbot
sudo certbot certonly --standalone -d noblequran.cloud -d www.noblequran.cloud \
  --non-interactive --agree-tos --email c2sattara1@gmail.com \
  --http-01-port=54321
# For renewing SSL
certbot renew --http-01-port=54321
```

## Setup Haproxy

```
sudo su
wget http://www.haproxy.org/download/2.3/src/haproxy-2.3.7.tar.gz
tar -xzf haproxy-2.3.7.tar.gz
cd haproxy-2.3.7
# Install the dependency need for the build
yum install openssl-devel pcre-devel make gcc
make TARGET=linux-glibc USE_PCRE=1 USE_PCRE_JIT=1 USE_OPENSSL=1 USE_ZLIB=1 USE_REGPARM=1 USE_SYSTEMD=1
make install
cp -f /usr/local/sbin/haproxy /usr/sbin
id -u haproxy &>/dev/null || useradd -s /usr/sbin/nologin -r haproxy
cd contrib/systemd
make
cp haproxy.service /lib/systemd/system/
mkdir -p /var/lib/haproxy/ # use for binding to socket
mkdir -p /etc/haproxy/errors
vi /etc/haproxy/haproxy.cfg # Copy prd.cfg from ops/haproxy/prd.cfg
vi /etc/haproxy/errors/502.http # copy src/error.html with 502 http header information in the beginning of the file
vi /etc/haprxoy/errors/503.http # copy src/error.html with 503 http header information in the beginning of the file
systemctl daemon-reload
systemctl enable haproxy
systemctl start haproxy
systemctl status haproxy
curl -X GET -I noblequran.cloud:443 # Quick sanity check
```
