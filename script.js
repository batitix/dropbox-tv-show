const ACCESS_TOKEN = "sl.u.AGAaaFyJbvqaumX7RA-3ztkG_vBB4r7vG0fqdQlTzZ8KLASKCifivVeAEYkzlzkn9rUJD2nD8V9A6quniQ8d8IL6fFk9Vl0veD0G0FRI4AEIAr2pywDauRI3iZvEuwFIy10RAUAyR2cMiKk0U6c6YwPsk5kPcNylwxodgfnfktC8EEgqNKUJhlL6RgwiBP3iEcYQGdEjQpAp5p9gNcBXY5OrsKKg6anzEojz3vSLMz9TxE3m490laD_4x_6Wvex6Spi8pBHNQi75kA2SzeUMKAE65y1gp85dpJyMmyQUwreQaSwVzU7ydpcMOfrhYpep5wM6CJuT3USfMyIoFvuGOSSHjGZloxvPtKqaDyGQvQgz-98er0FxJuNh-ykKaDYAj8XdfGe5aG-DpfAr7Tw7TBbomKB85JjFLM09Edf5iDZj6Wz-xKdm_SAgNwFK1gwPQCzxjitxepLx3g1CyYCK9Xgum5YV1l1KVuZ_3mCycl_VXU-N4JC7n7v4zR2Pebl8HN048DtyrLtW875LN7RxhvjJ5VVpHcuGfrPLO9X74gtiWxcR45OYOg0M5Rb_ahqUERlOtUc_1WK6J1pzPKDUCKmauD6RQgVbW80nU9_x7iS-K4PgkK8jVoI1-r655QoRh9bOStumYAuDpjC-kHCiytAcEdl9U0HDQv-k2BMKAiFlYrvw3p5Ih2qKtYduz9IKreZDr-kB9-NLbHZzWr7nqjn_vHjF8Q5UZsx3B52G7zR01d4FBE-gyGn-l9Pk5lJiifXD6LAVQTapofOcCTKlfxhDbWRA8nc75csMQs5kyGQSbGGDAnznUbS7RN_ixwjzE2Y0xyHm217z40fGCU9td0dWJ5T9oGFrrjBDzQCDAnuFPzg_N6EpLAwYa5wn6ixwyaJXAvdScMVZR2YTuvaRsCdgiyVzGeFFB-yyzw6tt0liwBXN5nwSvsQh41PXYj7Jt0V0xlIypZtB-G1ZBaCCrylAYZOyLu5d7sMsE6oHgG7o1F7zWXE4vFORowra0YVBnH8dI0dAaylo3It_AGrghQxcXBoJ1VwQi4wfstaPqcjy9fPwqHjvKMDFGVCdri63HoGnp3CVKl9Ct6NcJQsDIHFCCWdQtd0CZVudcZG52VK0G8OrC7CJoZnTSSEiD8OFp-6fcmThPQ-FbGpZYKM7czwM1R1JQrn5XCjwi1K0NrC_LR3VMvhZlOmee2tjXUqgJwpax29gMPM2VEGM_ZExoDTKLB4SrFFpZRo31mwaPLgfwM-opzwxInyucMt1GgJbdGo"; // Replace with your token
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
