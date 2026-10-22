export interface UpdateManifest {
  version: string;
  url: string;
  sha256: string;
  size: number;
}

export function compareVersions(current: string, remote: string): number {
  const a = current.replace(/^v/i, '').split('.').map(Number);
  const b = remote.replace(/^v/i, '').split('.').map(Number);
  for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
    const left = Number.isFinite(a[i]) ? a[i] : 0;
    const right = Number.isFinite(b[i]) ? b[i] : 0;
    if (left < right) return -1;
    if (left > right) return 1;
  }
  return 0;
}

export function validateManifest(input: unknown): UpdateManifest {
  if (!input || typeof input !== 'object') throw new Error('Invalid update manifest');
  const value = input as Record<string, unknown>;
  if (typeof value.version !== 'string' || !/^\d+\.\d+\.\d+$/.test(value.version)) throw new Error('Invalid version');
  if (typeof value.url !== 'string' || !/^https:\/\//.test(value.url)) throw new Error('Invalid URL');
  if (typeof value.sha256 !== 'string' || !/^[a-f0-9]{64}$/i.test(value.sha256)) throw new Error('Invalid SHA-256');
  if (typeof value.size !== 'number' || value.size < 0) throw new Error('Invalid size');
  return { version: value.version, url: value.url, sha256: value.sha256, size: value.size };
}
