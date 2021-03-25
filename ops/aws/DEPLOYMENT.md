SERVER_VERSION={{ VERSION_FROM_PACKAGE_JSON }
cd /var/www/noblequran/releases/
tar xzf "noblequran-$SERVER_VERSION+prd.tgz"
mv package/ noblequran-$SERVER_VERSION


cd noblequran-$SERVER_VERSION

nvm install 14.16.0
npm install -g forever

cd server
npm install --production
cd /var/www/noblequran/
unlink src_main
ln -s releases/noblequran-$SERVER_VERSION src_main
sudo su node
./start main
tail -f logs/error.log
