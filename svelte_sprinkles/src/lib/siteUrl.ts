// Can't use the BASE_URL because configuration weird
export const baseUrl = import.meta.env.VITE_BASE_URL ?? '';

export default function siteUrl(path: string) {
  return baseUrl + path
}
