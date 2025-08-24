import { api } from "../lib/axios";

export async function enableShare(): Promise<string> {
  const res = await api.post("/link/share", { share: true });
  const hash = (res.data?.hash ?? res.data?.message) as string;
  return `${window.location.origin}/share/${hash}`;
}

export async function disableShare(): Promise<void> {
  await api.post("/link/share", { share: false });
}
