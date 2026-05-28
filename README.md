# ipfs-downloader

ipfs-downloader is an example showing how to download files from IPFS directly from the browser without using gateways. It creates an IPFS node once the download button is first clicked.

## Building

``` sh
npm install
npm run build
```

## Usage

1. Add the generated `bundle.js` and `styles.css` to your page;
2. For each IPFS file, add:

``` html
<a class="ipfs-downloader" data-path="/ipfs/CID/filename" download="filename.ext">Download label</a>
```

See the [public/index.html](public/index.html) example or [try it live](https://ipfs.io/ipfs/QmPNSLu15AaMbxQRb5pe7LjxzyiHd1Xiz44xZoRcUxWxZF) (from IPFS).

## To-do

* Allow downloading directories (zipped);
* Don't store file in RAM (should allow downloading larger files).
* Customization;
* Show details (size, rate, status, ...).
* Use running node, if present.
