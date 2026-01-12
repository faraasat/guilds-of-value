import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";

let helia: any = null;
let fs: any = null;

export async function getIPFS() {
  if (helia) return { helia, fs };

  helia = await createHelia();
  fs = unixfs(helia);
  return { helia, fs };
}

export async function uploadToIPFS(content: string): Promise<string> {
  const { fs } = await getIPFS();
  const bytes = new TextEncoder().encode(content);
  const cid = await fs.addBytes(bytes);
  return `ipfs://${cid}`;
}

export async function fetchFromIPFS(uri: string): Promise<string> {
  if (!uri.startsWith("ipfs://")) return uri;
  const cid = uri.replace("ipfs://", "");
  const { fs } = await getIPFS();

  const chunks = [];
  for await (const chunk of fs.cat(cid)) {
    chunks.push(chunk);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}
