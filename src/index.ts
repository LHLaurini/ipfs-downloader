
import IPFS from "ipfs";
import { PromiseValue } from "type-fest";

// Doesn't support import, it seems
const uint8ArrayConcat = require("uint8arrays/concat");

type Ipfs = PromiseValue<ReturnType<typeof IPFS.create>>;

const OPTIONS = {};

function createDownloadUrl(data: Uint8Array) {
    const file = new Blob([data], { type: 'application/octet-binary' });
    return URL.createObjectURL(file);
}

// let a = document.createElement("a");
//                 let content: Uint8Array = uint8ArrayConcat(await all(x.content));
//                 a.href = createDownloadUrl(content);
//                 a.download = "file.bin";
//                 a.appendChild(document.createTextNode("Download!"));

//                 document.body.appendChild(a);

function downloadIpfsFile(ipfs: Ipfs, cid: string, onProgress: (downloaded: number, total: number) => void) {
    return new Promise(async function (resolve: (arg: Uint8Array) => void, reject: () => void) {
        let data: Uint8Array[] = [];
        let downloaded = 0;
        let total: number;

        for await (const file of ipfs.get(cid)) {
            if (downloaded != 0) {
                // shouldn't get to this point
                console.error("multiple files");
                reject();
                return;
            }

            if (file.type == "file") {
                if (file.content != undefined) {
                    total = file.size;

                    for await (const chunk of file.content) {
                        data.push(chunk);
                        downloaded += chunk.length;
                        onProgress(downloaded, total);
                    }
                }
            } else {
                console.error("node is not a file");
                reject();
                return;
            }
        }

        resolve(uint8ArrayConcat(data));
    });
}

async function initIpfs() {
    if (initIpfs.ipfs === undefined) {
        initIpfs.ipfs = await IPFS.create(OPTIONS);
        const version = await initIpfs.ipfs.version();

        console.log(`Version: ${version.version}`);

        /*
            /ipfs/QmS4ustL54uo8FzR9455qaxZwuMiUhyvMcX9Ba8nUH4uVv/readme
            /ipfs/bafybeigwwctpv37xdcwacqxvekr6e4kaemqsrv34em6glkbiceo3fcy4si
        */

        return initIpfs.ipfs;
    }
    else {
        return initIpfs.ipfs;
    }
}

namespace initIpfs {
    export let ipfs: Ipfs | undefined;
}

async function download(self: HTMLAnchorElement, cid: string) {
    let ipfs = await initIpfs();
    let dataPromise = downloadIpfsFile(ipfs, cid, function (downloaded: number, total: number) {
        self.style.setProperty("--progress", (downloaded / total).toString());
    });
    dataPromise.catch(function () {
        self.innerText = "Failed";
        self.style.setProperty("--progress", "1");
        self.style.setProperty("--progress-color", "#fa0000");
    });
    let data = await dataPromise;
    self.innerText = "Downloaded";
    self.onclick = null;
    self.href = createDownloadUrl(data);
    self.click();
}

window.onload = function () {
    let downloaders = document.getElementsByClassName("ipfs-downloader");
    for (let downloader of downloaders) {
        let cid = downloader.getAttribute("data-cid");

        if (downloader instanceof HTMLAnchorElement && cid != null) {
            let downloader_ = downloader;
            let cid_ = cid;

            downloader.onclick = function () {
                downloader_.onclick = null;
                downloader_.innerText = "Downloading...";
                download(downloader_, cid_);
            };
        }
    }
}
