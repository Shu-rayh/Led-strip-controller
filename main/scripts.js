let device = null;
let characteristic = null;

async function connect() {
    device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["0000ffe0-0000-1000-8000-00805f9b34fb"]
    });

    let server = await device.gatt.connect();
    let service = await server.getPrimaryService("0000ffe0-0000-1000-8000-00805f9b34fb");
    characteristic = await service.getCharacteristic("0000ffe1-0000-1000-8000-00805f9b34fb");

    document.getElementById("status").textContent = "Connected";
};

document.getElementById("connectButton").addEventListener("click", function() {
    connect();
});


async function turnOn() {
    let bytes = new Uint8Array([0x7e, 0xff, 0x04, 0x01, 0xff, 0xff, 0xff, 0xff, 0xef]);
    await characteristic.writeValueWithResponse(bytes);

};

async function turnOff() {
    let bytes = new Uint8Array([0x7e, 0xff, 0x04, 0x00, 0xff, 0xff, 0xff, 0xff, 0xef]);
    await characteristic.writeValueWithResponse(bytes);
    
};

document.getElementById("onButton").addEventListener("click", function() {
    turnOn();
});

document.getElementById("offButton").addEventListener("click", function() {
    turnOff();
});

function syncPair(sliderId, numberId) {
    let slider = document.getElementById(sliderId);
    let number = document.getElementById(numberId);
    slider.addEventListener("input", function() {
        number.value = slider.value;
    });
    
};

syncPair("sliderR", "numberR");
syncPair("sliderG", "numberG");
syncPair("sliderB", "numberB");

async function  setColor(r, g, b) {
    let bytes = new Uint8Array([0x7e, 0xff, 0x05, 0x03, r, g, b, 0xff, 0xef])
    await characteristic.writeValueWithResponse(bytes);
};
document.getElementById("sendColorButton").addEventListener("click", function() {
    let r = parseInt (document.getElementById("numberR").value);
    let g = parseInt (document.getElementById("numberG").value);
    let b = parseInt (document.getElementById("numberB").value);
    setColor(r, g, b);
});

async function setBrightness(percent) {
    let bytes = new Uint8Array([0x7e, 0xff, 0x01, percent, 0x00, 0xff, 0xff, 0xff, 0xef]);
    await characteristic.writeValueWithResponse(bytes);
    
};

document.getElementById("sliderBright").addEventListener("input", function() {
    let percent = parseInt(this.value);
    document.getElementById("brightLabel").textContent = percent + "%";
    setBrightness(percent);


});