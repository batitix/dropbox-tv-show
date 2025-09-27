const ACCESS_TOKEN = "sl.u.AGDF7bBdkVu0zeJhecwFSdlGMFiJT-a3JI4YBuomhAeWQx0bb7rn3icoghZDnbAEjUqj5J_KBJd9HC-peqIGTaoBOOXauayTKs9ddefhIUkP6pvTC5umT46evO49OCv4V3QaWh-7DGRQ1pQBHfM95tObD7XTGcWoYElKznwzceh0dItoLy5DsP4nvf6V93nfr6iKpzlDZtXxpMUvJpMOZfdhfxDpn6eAK0xVNUXIr2kinuudpkf5OYwIHVZ6pMbEuSm5fXcw8wMMjo4oOwucR6defg1P4cypOaA_c0BUkfe0dgBOGOeLetIoqcNSXBFizvQk7gBqed0GLDj4e0gFHSt6XGtLME_m9BXZB8ngGv4Qq8TWp-ypjnwSDvkVo1FVHKXlNBzExhzsKjioaj2RgScHTlIdUD6Vvu1LaDQOCZkuTZKqGtwH8ptwXY7OW_o3KRTlz6VfcgaF0QJ6_h0ckQY0L3XzPyPY-nA7eTUSCQRaGLAzGh_fr1dIorK0kifaKkzIX6zoZ3zwaZ82942aUaXeySBdDey6yCxH2PcXauGWNNu_RGcdc2KydUrzD8wPMcLURiP9uaU1lksZ0ahsesa3Qwp8ZNQX6CU4yTGqzel1kWVHk5yGODyYy5Imgb2W8BG-kRjluwKyTNyT_ID9IVHpg0pC01muzT1_caMyE0VJ2o1r7DzrdpVK_po-6I1VfsiSFXollVfz0rsG0YvKzhC5nXRZpMTdcc8gAY2nwhF8PYOMd0UTZNMRST0uaf5dxLZMIHG8GCWjtRFPdnYcAmqqcE3gM40poN6vd-MKO05tzHSAbFcs7vsG5PRnyWssWZi9SXW3rZtygyadLiAttvZDfo8qBupLiiO0hWVuUtLV1_pr8gpNLp0VhU-LKJMyIWK3OoosDYxQb9PY0Xhix6f6TTQlQegzBVe3rNpCBuptBGaUiSxzcWZv7yjajYBahB5wjg86Z_IZtb-EupPTxbMOaTVBafIHvag3cKTtIy9xEC2bs3RIrepK4UdJ7p06BvXM6O7flmBpXg86fet0P8KtQKPXlkNHwFr-nUzwmWR3SldHbQd7XrKYTwa3c0t9EVKO-aUPcRD5-mVFC3Cpyi83wsUF6CKXCDNYQD9tROUIoXry5pXDW9_I-0T2s_eLTI1vSLUcjoBeUwjLwWxV3IEMwNhbRnc6JuHmrxZZDyMb-tfIr--FEKU3okb24LoQ_ypZBXyhmS4etLqji66xrJWVSt4V4P55eSw_9kvhO3aSDLF4UmY3osGXl8Ea-trjraXRCcj8DdgZcRevA5lQTO1V"; // Replace with your token
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
