const cloudName = "duklao3sh";             // Replace with your Cloudinary cloud name
const uploadPreset = "TVshowvela_unsigned";      // Your unsigned preset

const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");
const resultDiv = document.getElementById("result");
const copyBtn = document.getElementById("copyBtn");
const resetBtn = document.getElementById("resetBtn");

let uploadedData = []; // Store {title, link} objects

// Drag & drop
dropArea.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", () => handleFiles(fileInput.files));
dropArea.addEventListener("dragover", e => e.preventDefault());
dropArea.addEventListener("drop", e => { e.preventDefault(); handleFiles(e.dataTransfer.files); });

// Copy all links (Title + URL) for Google Sheets
copyBtn.addEventListener("click", () => {
    if(uploadedData.length === 0) return;
    const textBlock = uploadedData.map(item => `${item.title}\t${item.link}`).join("\n");
    navigator.clipboard.writeText(textBlock);
});

// Reset everything
resetBtn.addEventListener("click", () => {
    uploadedData = [];
    resultDiv.innerHTML = "";
    fileInput.value = "";
});

// Handle files
function handleFiles(files) {
    [...files].forEach(file => uploadFile(file));
}

function uploadFile(file) {
    const title = file.name.replace(/\.[^/.]+$/, ""); // Remove extension

    // Create upload item with progress bar
    const itemDiv = document.createElement("div");
    itemDiv.className = "upload-item";
    itemDiv.innerHTML = `<strong>${title}</strong>`;
    const progressContainer = document.createElement("div");
    progressContainer.className = "progress-bar";
    const progressFill = document.createElement("div");
    progressFill.className = "progress-fill";
    progressContainer.appendChild(progressFill);
    itemDiv.appendChild(progressContainer);
    resultDiv.appendChild(itemDiv);

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    // Track progress
    xhr.upload.addEventListener("progress", e => {
        if (e.lengthComputable) {
            const percent = (e.loaded / e.total) * 100;
            progressFill.style.width = percent + "%";
        }
    });

    xhr.onload = () => {
        if(xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            const link = data.secure_url;
            uploadedData.push({ title, link });

            const a = document.createElement("a");
            a.href = link;
            a.target = "_blank";
            a.innerText = link;
            itemDiv.appendChild(document.createElement("br"));
            itemDiv.appendChild(a);
        } else {
            itemDiv.innerHTML += `<br>❌ Upload failed`;
        }
    };

    xhr.onerror = () => {
        itemDiv.innerHTML += `<br>❌ Upload error`;
    };

    xhr.send(formData);
}
