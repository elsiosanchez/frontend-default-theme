#!/bin/sh

# folder with dist app files
cd /var/www/adempiere-vue/dist/static/js

# Set API Proxy connection
find -name 'app.*.js' -exec sed -i "s|https://api.erpya.com|$API_URL|g" {} \;

# Run app
yarn run build && yarn run start && tail -f /dev/null
