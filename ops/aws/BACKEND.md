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

## NVM Install
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash

## Add directory structure

```

sudo su

mkdir -p /var/www/noblequran
mkdir /var/www/noblequran/logs /var/www/noblequran/releases

adduser node
groupadd web
chgrp -R web /var/www
chmod -R 775 /var/www
usermod -a -G web ec2-user
usermod -a -G web node
```
