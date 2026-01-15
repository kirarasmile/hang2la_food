/**
 * 检测是否为移动端
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * 唤起高德地图
 * @param address 目的地地址
 * @param lat 目的地纬度
 * @param lng 目的地经度
 */
export function openAmap(address: string, lat?: number, lng?: number) {
  const dname = encodeURIComponent(address)
  
  // 基础 URI Scheme
  // t=2 代表步行，dev=0 代表采用高德坐标系
  let url = `amapuri://route/plan/?did=BGVIS2&dname=${dname}&dev=0&t=2`
  
  if (lat && lng) {
    url += `&dlat=${lat}&dlon=${lng}`
  }

  // 尝试唤起
  window.location.href = url
  
  // 如果没安装高德地图，通常会没反应。
  // 可以设置一个定时器，如果几秒后还在当前页面，可以跳转到 H5 版本或者应用商店。
  // 但为了保持简单，我们主要负责唤起。
}

/**
 * 复制文本到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy: ', err)
    return false
  }
}
