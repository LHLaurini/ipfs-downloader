
import { createHelia } from "helia";
import { UnixFS, unixfs } from "@helia/unixfs";
import { CID } from "multiformats/cid";

function createDownloadUrl(data: Uint8Array<ArrayBuffer>) {
    const file = new Blob([data], { type: 'application/octet-binary' });
    return URL.createObjectURL(file);
}

async function downloadIpfsFile(unixfs: UnixFS, cid: string, onProgress: (downloaded: number, total: number) => void) {
    // These functions accept both a CID or a path as a string, the type annotations are incorrect
    let stat = await unixfs.stat(cid as unknown as CID);
    if (stat.type != "file") {
        throw Error("node is not a file");
    }
    
    let size = Number(stat.size);
    let data = new Uint8Array(size);
    
    let downloaded = 0;
    for await (const chunk of unixfs.cat(cid as unknown as CID)) {
        data.set(chunk, downloaded);
        downloaded += chunk.length;
        onProgress(downloaded, size);
    }

    return data;
}

async function initHelia() {
    if (initHelia.unixfs === undefined) {
        initHelia.unixfs = unixfs(await createHelia());
    }
    return initHelia.unixfs;
}

namespace initHelia {
    export let unixfs: UnixFS | undefined;
}

function setError(element: HTMLAnchorElement) {
    element.innerText = "Failed";
    element.style.setProperty("--progress", "1");
    element.style.setProperty("--progress-color", "#fa0000");
}

async function download(element: HTMLAnchorElement, cid: string) {
    try {
        let unixfs = await initHelia();
        let data = await downloadIpfsFile(unixfs, cid, function (downloaded: number, total: number) {
            element.style.setProperty("--progress", (downloaded / total).toString());
        })

        element.innerText = "Downloaded";
        element.onclick = null;
        element.href = createDownloadUrl(data);
        element.click();
    } catch (err) {
        console.error(err);
        setError(element);
    }
}

window.onload = function () {
    let downloaders = document.getElementsByClassName("ipfs-downloader");
    for (let downloader of downloaders) {
        let cid = downloader.getAttribute("data-cid");

        if (downloader instanceof HTMLAnchorElement && cid != null) {
            downloader.onclick = function () {
                downloader.onclick = null;
                downloader.innerText = "Downloading...";
                download(downloader, cid);
            };
        }
    }
}
