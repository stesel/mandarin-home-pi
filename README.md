# mandarin-home-pi

## Backend env
`HTTP_PORT_PI`
`WS_PORT_PI`
`SECRET_PHRASE_PI`
`DB_SECRET_PI`

## Pi env
`WS_HOST_PI`
`WS_PORT_PI`
`SECRET_PHRASE_PI`

## Set Pi env
```
export ENV_VAR="value" >> /etc/profile
source /etc/profile
echo ENV_VAR
```

## Install Pi App
```
wget -O mandarin-home-pi.js url/mandarin-home-pi.js --show-progress
pm2 start ./mandarin-home-pi.js
pm2 save
```

## Find Pi in local network
```
arp -na | grep "PI MAC" | grep -E -o "192.168.0.[0-9]{1,3}"
```
