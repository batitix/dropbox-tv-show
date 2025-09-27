const ACCESS_TOKEN = "sl.u.AGCEGl3h5iuP6JL2j7Mhqs7jxq5NVezB1r-ubOb4S6UWk-itsZbHBsCe87qBwFYSEjfhqQXxLudHvQGpU6yWAGfauHCQqqiql88aHCRt4RrbE2GoWO-drcV3cMV_UBLIU3awuqEugh693d-U2vmUJOQZMFGFNwlphZm478d3o3MXu7y1eeC7B0LoDU0Ln0qEj-tvdLNTjsAgGvxtqUVjlgMsIT_t1GZMDkWUue6P9hNWHi0MLVpjgL2aXsT-lcucxFx-335evW2IWHKQGDce-U4RbxdtxcQllZf0MB3cpeYZMojybKFicb_g71kzYJxE_RwcOG3jc79Je9mzecLQYneXezYRl1D1-KW9xFeuh2rh-T_OS8zHD2yNEcV1eJFqPbSUzI5mjkOSAJMYYGlzdCRvmD-qNediY1m23S1vKh9ZiJoNM24cHbUsHhaBzPaqhFCh_bCIW13jaNU2-jRJ3rw-J0mU1--8Yv9LJ9N1Ym-uaqTFVvwj1OKlNuiHCzZ9xuKLmFC0BZrvl22wt9ZKHZCCReo_oTRUvue-1uvu8SRGaAD4ff4sz4zg3-1QCSRMStUn73Y_bQRb6nYYkpeWOB2xYB107727bB3eJ2gQc-iTRjaQHsOoKvtjUzhgDgT0clrzBNsZWDNgpPWtZySvjA2HgkmfrS8-pveiSdnGfsM3v8RqSswqSZwWk6PMUmj0KiCHGSF2cjM3FAhzeESEOIyPUj7MAqPE_63i3zEbXIk0OBkaTY7bIaE6pGZ9S7N1f6uK84gtdbvUeWKGCfhkvGIPYZMKxQiXFsnopmmsGUrKpAkezHh-YtoJ4mwYwNCgK49K9Muci10Vlwa3ettNqmgTZ9hNrnP6gHcXqhVRLMjuwE9ZX01ZNuKCmUcaOyY1slgifow5l9KiQ9_tMqK-kvcjJzax6ju7vwbR85g385g8HUO3ufYFSFt87C2puALmfiPsa_XnnWVVqjBNmZh2vMVBvUVX2wRpktzeZFAhh-Ahhx7devMvOESdtH4fKonWTOfZeVJWGd71wGdBN_9GqD347OBDF9GUnPdTd1JbKlzYuSmn0bHpHzuw1ovWYDSjsG53kZ7fBBpzDTFdYBzSyaHwNimK6kN7Tud_iJPIfuRwBFfROfihMM7IDeCQhpftNMYSKdr51QohsJVKeAZqIsX2_7i8ISQkUNPD4muH_rmS5eGQiY6uvuQnOCeLdtlIkgiHZcDmYhUoRn0Hvopzr9pKQ8vGkLzATWyWIgUP2XaUBQUZcg77ZOatxMJ355DoP1Y"; // Replace with your token
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
