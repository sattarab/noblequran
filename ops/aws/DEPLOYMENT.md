SERVER_VERSION={{ VERSION_FROM_PACKAGE.JSON }}
cd /var/www/noblequran/releases/
tar xzf "noblequran-$SERVER_VERSION+prd.tgz"
mv package/ noblequran-$SERVER_VERSION

# Install
cd noblequran-$SERVER_VERSION

nvm install
npm install -g forever

forever stop main
forever start -l $LOG --uid main -c node ./server/dist/cluster.js main
