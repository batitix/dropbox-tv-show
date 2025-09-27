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
    if(uploadedData.length === 0) return alert("No links to copy!");
    const textBlock = uploadedData.map(item => `${item.title}\t${item.link}`).join("\n");
    navigator.clipboard.writeText(textBlock)
        .then(() => alert("Copied all links!"))
        .catch(err => alert("Failed to copy: " + err));
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
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    fetch(url, { method: "POST", body: formData })
        .then(res => res.json())
        .then(data => {
            const link = data.secure_url;
            uploadedData.push({ title, link });

            const div = document.createElement("div");
            div.innerHTML = `<strong>${title}</strong> → <a href="${link}" target="_blank">${link}</a>`;
            resultDiv.appendChild(div);
        })
        .catch(err => console.error(err));
}
