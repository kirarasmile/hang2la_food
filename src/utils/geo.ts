/**
 * 计算两个坐标点之间的距离 (米)
 */
export function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3 // 地球半径 (米)
  const φ1 = lat1 * Math.PI / 180
  const φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2 - lat1) * Math.PI / 180
  const Δλ = (lng2 - lng1) * Math.PI / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

/**
 * 估计步行时间 (分钟)
 * 假设步行速度为 1.2 m/s
 */
export function estimateWalkTime(distance: number): number {
  return Math.round(distance / (1.2 * 60))
}
