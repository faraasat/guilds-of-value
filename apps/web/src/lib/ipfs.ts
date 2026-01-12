let helia: any = null;
let fs: any = null;

export async function getIPFS() {
  if (typeof window === "undefined") return null;
  if (helia) return { helia, fs };

  const { createHelia } = await import("helia");
  const { unixfs } = await import("@helia/unixfs");

  helia = await createHelia();
  fs = unixfs(helia);
  return { helia, fs };
}

export async function uploadToIPFS(content: string): Promise<string> {
  const ipfs = await getIPFS();
  if (!ipfs) return "";

  const { fs } = ipfs;
  const bytes = new TextEncoder().encode(content);
  const cid = await fs.addBytes(bytes);
  return `ipfs://${cid}`;
}

export async function fetchFromIPFS(uri: string): Promise<string> {
  if (!uri.startsWith("ipfs://")) return uri;

  // Try to use a public gateway first for faster SSR and reliability
  const cid = uri.replace("ipfs://", "");
  const gatewayUrl = `https://ipfs.io/ipfs/${cid}`;

  try {
    const response = await fetch(gatewayUrl);
    if (response.ok) {
      return await response.text();
    }
  } catch (e) {
    console.warn("Gateway fetch failed, falling back to local Helia", e);
  }

  const ipfs = await getIPFS();
  if (!ipfs) return "IPFS Unavailable";

  const { fs } = ipfs;
  const chunks = [];
  for await (const chunk of fs.cat(cid)) {
    chunks.push(chunk);
  }

  // Using TextDecoder to handle potential Uint8Array chunks
  const decoded = new TextDecoder().decode(
    new Uint8Array(
      chunks.reduce((acc, chunk) => [...acc, ...chunk], [] as number[]),
    ),
  );
  return decoded;
}
