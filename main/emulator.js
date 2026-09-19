function makeFakeChar() {
    let strip = document.getElementById("emulatorStrip");
    let log = document.getElementById("emulatorLog");
    let emulator = { on: true, r: 255, g: 255, b: 255, brightness: 100 };

    function draw() {
        if (emulator.on) {
            strip.style.background = "rgb(" + emulator.r + "," + emulator.g + "," + emulator.b + ")";
            strip.style.opacity = emulator.brightness / 100;
        } else {
            strip.style.background = "#111";
            strip.style.opacity = 1;
        }
    }

    draw();

    return {
        writeValueWithResponse: async function(bytes) {
            let cmd = bytes[2];
            if (cmd === 0x04) {
                emulator.on = bytes[3] === 1;
            } else if (cmd === 0x05) {
                emulator.r = bytes[4];
                emulator.g = bytes[5];
                emulator.b = bytes[6];
            } else if (cmd === 0x01) {
                emulator.brightness = bytes[3];
            }
            draw();
            log.textContent = "Sent: " + Array.from(bytes).map(function(x) {
                return x.toString(16).padStart(2, "0");
            }).join(" ");
        }
    };
}