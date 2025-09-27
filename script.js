const ACCESS_TOKEN = "sl.u.AGBHgw5K87795ERt74X45Wyk2Q1Lst4Fava3QwnSXGQmkz8FQ_aTvfbrX6G7E4dQXNqnOOuvOEmmD6afY_jisiUSXXsUaRKH0YZrGkf1GSXISvCsjeH8H4KmQrBOtBUVxNbndlGEKVPXa3L1qwyHWBrfGrcSryc1I1tC2CEmy89tjLLkoqs17D0r18x5GmS4GvnvMqd23M4G5TwOUH2JxTRfMawUo1BTxn-FTmybzojj8mml06pgFRnvC940wrzUi5tJz0Q8YfU7LCVuC9BC4VearQqga_2tbAtVNY4zNvDEAwKHoQafixTuwy9H0ZQyRZ7-BYiSA2dOYnIfNsSYz4NAwsvMSyDdN_mU40Dut3sYMyee8xUK_rlC7iWUHruxJyldwQueA59MPOGa5bBghWynJbnLay6xaGsDYwnDtBDWvbU4HPQaMF1awK2ACRpqRYg6BOTSvngva2ZwaDSPvuGNQHAEfCJGtuQG3aRZ1xRn9yy2kzlqjk100KCzW-exh88Q8lDr8oB-OeOBEf3ViVoYb5fUS5RK_KGhY152NhRVeUxMLnpeQQN_MdPd7w6J3qBmD2egQbLbKT5ORh1bocmX8JG8VQL8GxcCeIY7AzRC63jkQ7vn9cH1yVcV21ibDDL2QgShUJktwWgasM2lgWhF_-WmTIUbFXJMtBRQCr_2vd-l70Uu7AG9Rlj-E7Mg16E3WtWQ3ySx4WBsJ4rmonyhS9mQ9XGrb6psnUKZbMGpxa4sS1B9ZTPXMlGewxhYgb4ACcEnwkGcv9L4X5riD3_kTJos0GeOTERuxv9QsQKu3-MqinpirmR_QM4LS4PH9TcPLW9-VaKeiElgPXLV-HBpFgpdWRBocK7xbyVIVsUZEI8CBIV4RUuXXkckPYEnO5473hTy70HtzFY7aeJa159z0F6GbMD6I3hup1UpWu4yGi6A00BkxP4RUGL28crgiHqQTGZpkazfSVmU0IfaB8LsVkXUCrF_MlvUfL2oE1c1Dz6qcDZs-B0h80X3_3V-W3IwCLux-WIoYjw58NmJSX8FhmPrB-rnG3XFiQ9_uMZc2EmdvSEgLM-S0tVnlMiXKpDKLywehxCmXJ-bRgbDOFYIC8WqNVwygse4vInRsQOfU3xrGrxtJuYw_qgP6t2TT74VfrcBQ7PpkKvJzKpLZyizVYHYpck-GHTaAzwTg6kZCwPq_xkshMxfZKZkPHNLeYs1wBqw3GdAFTqWFe3mDGTbOtElqSH60ujRWXhb-9ZmV3DwkuZPsxHTxTFtCFzkZU80gJy5OCkpdXXFkqx-9K-M"; // Replace with your token
const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");
const resultDiv = document.getElementById("result");

// Click to open file dialog
dropArea.addEventListener("click", () => fileInput.click());

// Handle file selection
fileInput.addEventListener("change", () => handleFiles(fileInput.files));

// Handle drag & drop
dropArea.addEventListener("dragover", e => { e.preventDefault(); });
dropArea.addEventListener("drop", e => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
});

async function handleFiles(files) {
    resultDiv.innerHTML = "";
    const promises = [...files].map(file => uploadFile(file));
    try {
        const links = await Promise.all(promises);
        links.forEach(link => {
            const a = document.createElement("a");
            a.href = link;
            a.target = "_blank";
            a.innerText = link;
            resultDiv.appendChild(a);
            resultDiv.appendChild(document.createElement("br"));
        });
    } catch (err) {
        resultDiv.innerText = "Error: " + err.message;
    }
}

async function uploadFile(file) {
    const path = "/" + file.name;

    // Upload to Dropbox
    const res = await fetch("https://content.dropboxapi.com/2/files/upload", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${ACCESS_TOKEN}`,
            "Dropbox-API-Arg": JSON.stringify({ path, mode: "overwrite" }),
            "Content-Type": "application/octet-stream"
        },
        body: file
    });
    if(!res.ok) throw new Error(await res.text());

    // Create shared link
    const linkRes = await fetch("https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ path, settings: {} })
    });
    const data = await linkRes.json();
    return data.url.replace("?dl=0","?raw=1"); // Direct link
}
