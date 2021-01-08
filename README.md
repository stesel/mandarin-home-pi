![Node CI](https://github.com/stesel/mandarin-home-pi/workflows/Node%20CI/badge.svg?branch=master)
# mandarin-home-pi

## Backend env
`PORT_PI`
`SECRET_PHRASE_PI`
`DB_SECRET_PI`

## Pi env
`WS_HOST_PI`
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

## Camera setup
https://www.raspberrypi.org/documentation/usage/camera/installing.md

## GPIO
http://wiringpi.com/

gpio -g mode 4 output
gpio -g blink 4
or
gpio -g write 4 1 (to turn it on)
gpio -g write 4 0 (to turn it off)
