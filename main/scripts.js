let device = null;
let characteristic = null;

// bluetooth
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

// connect button
document.getElementById("connectButton").addEventListener("click", function() {
    connect();
});

// turn on off
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

// colors and swatch
function syncPair(sliderId, numberId) {
    let slider = document.getElementById(sliderId);
    let number = document.getElementById(numberId);
    slider.addEventListener("input", function() {
        number.value = slider.value;
        updateSwatch();
    });
    number.addEventListener("input", function(){
        slider.value = number.value;
        updateSwatch();
    });
    
};

function updateSwatch () {
    let r = document.getElementById ("numberR").value;
    let g = document.getElementById ("numberG").value;
    let b = document.getElementById ("numberB").value;
    document.getElementById("swatch").style.background	=	"rgb("	+	r	+	","	 +	g	+ ","  +	b +	")";

}

syncPair("sliderR", "numberR");
syncPair("sliderG", "numberG");
syncPair("sliderB", "numberB");


document.getElementById("sendColorButton").addEventListener("click", function() {
    let r = parseInt (document.getElementById("numberR").value);
    let g = parseInt (document.getElementById("numberG").value);
    let b = parseInt (document.getElementById("numberB").value);
    setColor(r, g, b);
    document.getElementById("result1").textContent = g;
    document.getElementById("result2").textContent = b;

});

async function  setColor(r, g, b) {
    let bytes = new Uint8Array([0x7e, 0xff, 0x05, 0x03, r, g, b, 0xff, 0xef])
    await characteristic.writeValueWithResponse(bytes);
};

// brightness
async function setBrightness(percent) {
    let bytes = new Uint8Array([0x7e, 0xff, 0x01, percent, 0x00, 0xff, 0xff, 0xff, 0xef]);
    await characteristic.writeValueWithResponse(bytes);
    
};

document.getElementById("sliderBright").addEventListener("input", function() {
    let percent = parseInt(this.value);
    document.getElementById("brightLabel").textContent = percent + "%";
    setBrightness(percent);

});

// preset (wip))
const PRESET_STORAGE_KEY = "ledPresets";
let editingId = null;

function loadPresets(){
    let stored = localStorage.getItem(PRESET_STORAGE_KEY);
    return stored ? JSON.parse(stored) :[];
}

function storePresets(presets){
    localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presets));
}

function savePreset(){
    let nameInput = document.getElementById("presetNameInput");
    let name = nameInput.value.trim();

    if (!name){
    alert("Please enter a preset name.");
    return;
    };

    let r = parseInt(document.getElementById("numberR").value);
    let g = parseInt(document.getElementById("numberG").value);
    let b = parseInt(document.getElementById("numberB").value);
    let brightness = parseInt(document.getElementById("sliderBright").value);

    let newPreset = {
    id: Date.now(),
    name: name,
    r: r,
    g: g,
    b: b,
    brightness: brightness,
    };

    let presets = loadPresets();
    presets.push(newPreset);
    storePresets(presets);

    nameInput.value = "";
    renderPresets();

};

function deletePreset(id){
    let presets = loadPresets();
    presets = presets.filter(function(p){return p.id !== id;});
    storePresets(presets);
    renderPresets();
}

function editPreset(id){
    editingId = id;
    renderPresets();
}

function cancelEdit(){
    editingId = null;
    renderPresets();
}

function saveEdit(id){
    let presets = loadPresets();
    let preset = presets.find(function(p) {return p.id === id;});
    if(!preset) return;

    let nameInput = document.getElementById("editNameInput_" + id);
    let newName = nameInput.value.trim();
    if (newName) {
        preset.name = newName;
    }

    let overwriteCheckbox = document.getElementById("editOverwrite_" + id);
    if (overwriteCheckbox.checked){
        preset.r = parseInt(document.getElementById("numberR").value);
        preset.g = parseInt(document.getElementById("numberG").value);
        preset.b = parseInt(document.getElementById("numberB").value);
        preset.brightness = parseInt(document.getElementById("sliderBright").value);
    }

    storePresets(presets);
    editingId = null;
    renderPresets();
}

function applyPresets(preset){
    document.getElementById("sliderR").value = preset.r;
    document.getElementById("numberR").value = preset.r;
    document.getElementById("sliderG").value = preset.g;
    document.getElementById("numberG").value = preset.g;
    document.getElementById("sliderB").value = preset.b;
    document.getElementById("numberB").value = preset.b;
    document.getElementById("sliderBright").value = preset.brightness;
    document.getElementById("brightLabel").textContent = preset.brightness + "%";
    updateSwatch();

    setColor(preset.r, preset.g, preset.b);
    setBrightness(preset.brightness);
    
}

function renderPresets(){
    let list = document.getElementById("presetList");
    list.innerHTML = "";
    let presets = loadPresets();
    presets.forEach(function(preset){
        let item = document.createElement("div");
        item.className = "presetItem";

        let miniSwatch = document.createElement("div");
        miniSwatch.style.width = "30px";
        miniSwatch.style.height = "30px";
        miniSwatch.style.display = "inline-block";
        miniSwatch.style.cursor = "pointer";
        miniSwatch.style.border = "1px solid #333";
        miniSwatch.style.background = "rgb(" + preset.r + "," + preset.g + "," + preset.b + ")";
        miniSwatch.style.verticalAlign = "middle";
        miniSwatch.addEventListener("click", function(){
            applyPresets(preset);
        });

        item.appendChild(miniSwatch);

        if (editingId === preset.id) {
            let nameInput = document.createElement("input");
            nameInput.type = "text";
            nameInput.id = "editNameInput_" + preset.id;
            nameInput.value = preset.name;

            let overwriteLabel = document.createElement("label");
            let overwriteCheckbox = document.createElement("input");
            overwriteCheckbox.type = "checkbox";
            overwriteCheckbox.id = "editOverwrite_" + preset.id;
            overwriteLabel.appendChild(overwriteCheckbox);
            overwriteLabel.appendChild(document.createTextNode(" update to current color/brightness"));

            let saveBtn = document.createElement("button");
            saveBtn.textContent = "Save";
            saveBtn.addEventListener("click", function(){
                saveEdit(preset.id);
            });

            let cancelBtn = document.createElement("button");
            cancelBtn.textContent = "Cancel";
            cancelBtn.addEventListener("click", function(){
                cancelEdit();
            });

            item.appendChild(nameInput);
            item.appendChild(overwriteLabel);
            item.appendChild(saveBtn);
            item.appendChild(cancelBtn);
        } else {
            let label = document.createElement("span");
            label.textContent = " " + preset.name + " ";

            let editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.addEventListener("click", function(){
                editPreset(preset.id);
            });

            let deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", function(){
                deletePreset(preset.id);
            });

            item.appendChild(label);
            item.appendChild(editBtn);
            item.appendChild(deleteBtn);
        }

        list.appendChild(item);
    }) 
}

document.getElementById("savePresetButton").addEventListener("click", function(){
    savePreset();
});

renderPresets();