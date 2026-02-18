// ================= FILTER CONFIG =================

let filters = {
    brightness : { value: 100, min: 0, max: 200, unit: "%" },
    contrast : { value: 100, min: 0, max: 200, unit: "%" },
    saturation : { value: 100, min: 0, max: 200, unit: "%" },
    hueRotation: { value: 0, min: 0, max: 360, unit: "deg" },
    blur: { value: 0, min: 0, max: 20, unit: "px" },
    grayscale: { value: 0, min: 0, max: 100, unit: "%" },
    sepia: { value: 0, min: 0, max: 100, unit: "%" },
    opacity:{ value: 100, min: 0, max: 100, unit: "%" },
    invert: { value: 0, min: 0, max: 100, unit: "%" }
};

// ================= SELECT ELEMENTS =================

const imageCanvas = document.querySelector("#image-canvas");
const canvasCtx = imageCanvas.getContext("2d");
const imgInput = document.querySelector("#image-input");
const resetButton = document.querySelector("#reset-btn");
const downloadButton = document.querySelector("#download-btn");
const filtersContainer = document.querySelector(".filters");
const presetsContainer = document.querySelector(".presets");
const placeholder = document.querySelector(".placeholder");

let image = null;

// ================= CREATE FILTER SLIDERS =================

function createFilterElement(name, value, min, max){

    const div = document.createElement("div");
    div.classList.add("filter");

    const label = document.createElement("label");
    label.innerText = name;

    const input = document.createElement("input");
    input.type = "range";
    input.min = min;
    input.max = max;
    input.value = value;

    input.addEventListener("input", () => {
        filters[name].value = input.value;
        applyFilters();
    });

    div.appendChild(label);
    div.appendChild(input);

    return div;
}

function createFilters(){
    filtersContainer.innerHTML = "";
    Object.keys(filters).forEach(key => {
        const f = filters[key];
        const element = createFilterElement(key, f.value, f.min, f.max);
        filtersContainer.appendChild(element);
    });
}

createFilters();

// ================= IMAGE UPLOAD =================

imgInput.addEventListener("change", (event) => {

    const file = event.target.files[0];
    if(!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {

        image = img;

        const container = imageCanvas.parentElement;
        const maxWidth = container.clientWidth;
        const maxHeight = container.clientHeight;

        const ratio = Math.min(
            maxWidth / img.width,
            maxHeight / img.height
        );

        imageCanvas.width = img.width * ratio;
        imageCanvas.height = img.height * ratio;

        placeholder.style.display = "none";
        imageCanvas.style.display = "block";

        canvasCtx.drawImage(
            img,
            0,
            0,
            imageCanvas.width,
            imageCanvas.height
        );
    };
});

// ================= APPLY FILTERS =================

function applyFilters(){

    if(!image) return;

    canvasCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

    canvasCtx.filter = `
        brightness(${filters.brightness.value}${filters.brightness.unit})
        contrast(${filters.contrast.value}${filters.contrast.unit})
        saturate(${filters.saturation.value}${filters.saturation.unit})
        hue-rotate(${filters.hueRotation.value}${filters.hueRotation.unit})
        blur(${filters.blur.value}${filters.blur.unit})
        grayscale(${filters.grayscale.value}${filters.grayscale.unit})
        sepia(${filters.sepia.value}${filters.sepia.unit})
        opacity(${filters.opacity.value}${filters.opacity.unit})
        invert(${filters.invert.value}${filters.invert.unit})
    `;

    canvasCtx.drawImage(
        image,
        0,
        0,
        imageCanvas.width,
        imageCanvas.height
    );
}

// ================= RESET =================

resetButton.addEventListener("click", () => {

    Object.keys(filters).forEach(key => {
        filters[key].value = filters[key].min === 0 ? 
            (key === "opacity" || key === "brightness" || key === "contrast" || key === "saturation" ? 100 : 0)
            : filters[key].value;
    });

    filters.brightness.value = 100;
    filters.contrast.value = 100;
    filters.saturation.value = 100;
    filters.opacity.value = 100;

    createFilters();
    applyFilters();
});

// ================= DOWNLOAD =================

downloadButton.addEventListener("click", () => {

    if(!image) return;

    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = imageCanvas.toDataURL("image/png");
    link.click();
});

// ================= PRESETS =================

const presets = {

    normal: {
        brightness:100, contrast:100, saturation:100,
        hueRotation:0, blur:0, grayscale:0,
        sepia:0, opacity:100, invert:0
    },

    drama: {
        brightness:110, contrast:140, saturation:130,
        hueRotation:0, blur:0, grayscale:0,
        sepia:10, opacity:100, invert:0
    },

    vintage: {
        brightness:105, contrast:90, saturation:80,
        hueRotation:10, blur:0, grayscale:0,
        sepia:40, opacity:100, invert:0
    },

    oldSchool: {
        brightness:95, contrast:85, saturation:70,
        hueRotation:0, blur:1, grayscale:20,
        sepia:60, opacity:100, invert:0
    },

    cinematic: {
        brightness:105, contrast:130, saturation:90,
        hueRotation:350, blur:0, grayscale:0,
        sepia:5, opacity:100, invert:0
    },

    faded: {
        brightness:110, contrast:80, saturation:70,
        hueRotation:0, blur:0, grayscale:0,
        sepia:15, opacity:95, invert:0
    },

    cool: {
        brightness:100, contrast:110, saturation:105,
        hueRotation:200, blur:0, grayscale:0,
        sepia:0, opacity:100, invert:0
    },

    warm: {
        brightness:105, contrast:110, saturation:120,
        hueRotation:30, blur:0, grayscale:0,
        sepia:15, opacity:100, invert:0
    },

    noir : {
        brightness:90, contrast:150, saturation:0,
        hueRotation:0, blur:0, grayscale:100,
        sepia:10, opacity:100, invert:0
    },

    softGlow : {
        brightness:110, contrast:90, saturation:105,
        hueRotation:0, blur:2, grayscale:0,
        sepia:10, opacity:100, invert:0
    },

    retroPop : {
        brightness:115, contrast:130, saturation:160,
        hueRotation:15, blur:0, grayscale:0,
        sepia:5, opacity:100, invert:0
    }
};


Object.keys(presets).forEach(presetName => {

    const btn = document.createElement("button");
    btn.classList.add("btn");
    btn.innerText = presetName;

    btn.addEventListener("click", () => {

        const preset = presets[presetName];

        Object.keys(preset).forEach(filterName => {
            filters[filterName].value = preset[filterName];
        });

        createFilters();
        applyFilters();
    });

    presetsContainer.appendChild(btn);
});
