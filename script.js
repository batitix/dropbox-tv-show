const cloudName = "duklao3sh";             // Replace with your Cloudinary cloud name
const uploadPreset = "TVshowvela_unsigned";      // Your unsigned preset
const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");
const resultDiv = document.getElementById("result");
const copyBtn = document.getElementById("copyBtn");

let uploadedLinks = [];

// Drag & drop
dropArea.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", () => handleFiles(fileInput.files));
dropArea.addEventListener("dragover", e => e.preventDefault());
dropArea.addEventListener("drop", e => { e.preventDefault(); handleFiles(e.dataTransfer.files); });

// Copy all links button
copyBtn.addEventListener("click", () => {
    if(uploadedLinks.length === 0) return alert("No links to copy!");
    navigator.clipboard.writeText(uploadedLinks.join("\n"))
        .then(() => alert("Copied all links!"))
        .catch(err => alert("Failed to copy: " + err));
});

// Handle files
function handleFiles(files) {
    [...files].forEach(file => uploadFile(file));
}

function uploadFile(file) {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    fetch(url, { method: "POST", body: formData })
        .then(res => res.json())
        .then(data => {
            const link = data.secure_url;
            uploadedLinks.push(link);

            const a = document.createElement("a");
            a.href = link;
            a.target = "_blank";
            a.innerText = link;
            resultDiv.appendChild(a);
            resultDiv.appendChild(document.createElement("br"));
        })
        .catch(err => console.error(err));
}
