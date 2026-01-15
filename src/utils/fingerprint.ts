/**
 * 获取或创建简单的设备指纹 (基于 localStorage)
 */
export function getFingerprint(): string {
  let fingerprint = localStorage.getItem('visitor_fingerprint')
  
  if (!fingerprint) {
    fingerprint = crypto.randomUUID()
    localStorage.setItem('visitor_fingerprint', fingerprint)
  }
  
  return fingerprint
}
