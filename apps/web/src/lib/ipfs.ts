"use client";

let helia: any = null;
let fs: any = null;

export async function getIPFS() {
  if (typeof window === "undefined") return null;
  if (helia) return { helia, fs };

  try {
    const { createHelia } = await import("helia");
    const { unixfs } = await import("@helia/unixfs");

    helia = await createHelia();
    fs = unixfs(helia);
    return { helia, fs };
  } catch (e) {
    console.error("Failed to initialize Helia:", e);
    return null;
  }
}

export async function uploadToIPFS(content: string): Promise<string> {
  const ipfs = await getIPFS();
  if (!ipfs) {
    console.error("IPFS upload requested on server or initialization failed.");
    return "";
  }

  const { fs } = ipfs;
  const bytes = new TextEncoder().encode(content);
  const cid = await fs.addBytes(bytes);
  return `ipfs://${cid}`;
}

export async function fetchFromIPFS(uri: string): Promise<string> {
  if (!uri || !uri.startsWith("ipfs://")) return uri || "";

  const cid = uri.replace("ipfs://", "");

  // 1. Try public gateway first (works on server and client, much faster)
  try {
    const response = await fetch(`https://ipfs.io/ipfs/${cid}`);
    if (response.ok) {
      return await response.text();
    }
  } catch (e) {
    console.warn("Public IPFS gateway failed, falling back to local node...");
  }

  // 2. Fallback to local Helia (client-only)
  if (typeof window === "undefined") return "Uplink required...";

  const ipfs = await getIPFS();
  if (!ipfs) return "Network Error";

  const { fs: heliaFs } = ipfs;
  const chunks = [];
  try {
    for await (const chunk of heliaFs.cat(cid)) {
      chunks.push(chunk);
    }

    // Efficiently combine chunks into a single Uint8Array
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }

    return new TextDecoder().decode(result);
  } catch (e) {
    console.error("Helia fetch failed:", e);
    return "Transmission Corrupted";
  }
}
