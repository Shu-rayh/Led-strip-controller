let device = null;
let characteristic = null;

async function connect() {
    device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["0000ffe0-0000-1000-8000-00805f9b34fb"]
    });

    let server = await device.gatt.connect();
    let service = await server.getPrimaryService("0000ffe0-0000-1000-8000-00805f9b34fb");
    characteristic = await service.getCharacteristic("0000ffe0-0000-1000-8000-00805f9b34fb");

    document.getElementById("status").textContent = "Connected";
    
}

document.getElementById("connectButton").addEventListener("click", function() {})