# LEDBLE Controller

A web app that connects to your Bluetooth LED strip and lets you set the exact RGB color that you want - no more guessing with sliders or color wheels and no more failing to connect.

**Got a LED BLE device? Try  the controller here → https://starlit-lolly-326867.netlify.app**

## Quick start

1. Open the link above on a Bluetooth-capable device using Chrome or Edge (Web Bluetooth isn't supported in Safari or Firefox).
2. Click **Connect** and select your LEDBLE strip from the pairing dialog.
3. Pick a color, hit send and watch your LEDs instantly change color.

## Demo
Watch the demo video on youtube → https://youtube.com/shorts/bWvfn4RX4Fs?si=fltGwEV1UII1_F8b
## Features

- Precise RGB input (type exact 0–255 values instead of dragging imprecise sliders or using glitchy color wheels)
- Built-in brightness control
- Save, edit and delete presets 

## How it works

Cheap LED strip apps (like the stock LED BLE app) only expose color sliders, with no way to type an exact value, or only allows you to select colors from a glitchy, unresponsive color wheel which is  a dealbreaker if you're trying to match a specific RGB color or set a specific mood. Aonther issue with the stock app was that sometimes it would connect to the LED Strip controller other times it would'nt get picked up at all, it also requires you to turn on yoyur location which is weird why would an app for LED lights need to be able to use your location? My web app talks directly to the strip over the Web Bluetooth API instead, sending raw byte commands to the `0000ffe1` write characteristic under the `0000ffe0` service.

The strip uses a common "LED Lamp" protocol family shared by a lot of cheap BLE strips, light bulbs and other BLE LED devices, built around `7e`/`ff`-framed byte commands. A few candidate command sets for this family were tried against the strip directly until one worked. Each command follows a fixed frame: color changes are sent as `7e ff 05 03 [r] [g] [b] ff ef`, brightness as `7e ff 01 [0–100] 00 ff ff ff ef`, and power as `7e ff 04 [00|01] ff ff ff ff ef`.

## Credits

The stock LED BLE app (Titled "LED BLE" on the google play store) was used as a reference point.
Used Claudes assistance for the following:
- Setting up the bluetooth API
- Uuid codes for the controller: Claude gave all the common codes it could find, which I tested against my strip controller until I found the working one.
- Help with the css: I wrapped my html in appropriate id's, and gave that code as well as my ui sketch and it gave me the basic css which I used as a guideline while coding the css. 



