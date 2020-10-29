# ipfs-downloader

ipfs-downloader is a simple script which allows one to download files from the IPFS directly from the browser without using gateways. It creates an IPFS node when the download button is first clicked.

## Building

``` sh
npm install
npm run bundle
```

## Usage

1. Add the generated `bundle.js` script and the `styles.css` stylesheet to your page;
2. For each IPFS file, add:

``` html
<a class="ipfs-downloader" data-cid="/ipfs/CID" download="filename.ext">Download label</a>
```

See the [public/index.html](public/index.html) example or [try it live](https://ipfs.io/ipfs/QmPNSLu15AaMbxQRb5pe7LjxzyiHd1Xiz44xZoRcUxWxZF) (from IPFS).

## To-do

* High priority:
    * Allow downloading directories (zipped);
    * Don't store file in RAM (should allow downloading larger files).
* Medium priority:
    * Customization;
    * Show details (size, rate, status, ...).
* Low priority:
    * Use running node, if present.
