// Optional E2E encryption module (feature-flagged)
// Uses Web Crypto API for cross-platform compatibility

export async function deriveKey(passphrase: string, salt: Uint8Array): Promise<Uint8Array> {
  const enc = new TextEncoder()
  const baseKey = await crypto.subtle.importKey(
    'raw', 
    enc.encode(passphrase), 
    'PBKDF2', 
    false, 
    ['deriveKey']
  )
  
  const key = await crypto.subtle.deriveKey(
    { 
      name: 'PBKDF2', 
      salt: salt as unknown as BufferSource, 
      iterations: 200000, 
      hash: 'SHA-256' 
    }, 
    baseKey, 
    { name: 'AES-GCM', length: 256 }, 
    true, 
    ['encrypt', 'decrypt']
  )
  
  const raw = new Uint8Array(await crypto.subtle.exportKey('raw', key))
  return raw
}

export async function seal(
  plaintext: Uint8Array, 
  key: Uint8Array
): Promise<{ nonce: Uint8Array; ct: Uint8Array }> {
  const nonce = crypto.getRandomValues(new Uint8Array(12))
  const cryptoKey = await crypto.subtle.importKey(
    'raw', 
    key as unknown as BufferSource, 
    'AES-GCM', 
    false, 
    ['encrypt']
  )
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: nonce as unknown as BufferSource }, 
    cryptoKey, 
    plaintext as unknown as BufferSource
  )
  const ct = new Uint8Array(encrypted)
  return { nonce, ct }
}

export async function open(
  ct: Uint8Array, 
  nonce: Uint8Array, 
  key: Uint8Array
): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw', 
    key as unknown as BufferSource, 
    'AES-GCM', 
    false, 
    ['decrypt']
  )
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: nonce as unknown as BufferSource }, 
    cryptoKey, 
    ct as unknown as BufferSource
  )
  const pt = new Uint8Array(decrypted)
  return pt
}
