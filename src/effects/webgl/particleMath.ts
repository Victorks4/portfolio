/** Evita colisão com THREE.MathUtils */
export const particleMath = {
  lerp: (a: number, b: number, t: number) => a + (b - a) * t,

  generateFibonacciSphere: (samples: number, radius: number) => {
    const points = new Float32Array(samples * 3)
    const phi = Math.PI * (3.0 - Math.sqrt(5.0))
    for (let i = 0; i < samples; i++) {
      const y = 1 - (i / (samples - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const theta = phi * i
      points[i * 3] = Math.cos(theta) * r * radius
      points[i * 3 + 1] = y * radius
      points[i * 3 + 2] = Math.sin(theta) * r * radius
    }
    return points
  },

  getTorusKnotPoint: (radius: number, tube: number, p: number, q: number) => {
    const u = Math.random() * Math.PI * 2
    const v = Math.random() * Math.PI * 2
    const quOverP = (q / p) * u
    const cs = Math.cos(quOverP)
    const r = radius * (2 + cs) * 0.5
    const x = r * Math.cos(p * u)
    const y = r * Math.sin(p * u)
    const z = radius * Math.sin(quOverP) * 0.5

    const cx = -Math.sin(p * u)
    const cy = Math.cos(p * u)
    const cz = 0

    const norm = Math.sqrt(cx * cx + cy * cy)
    const nx = cx / norm
    const ny = cy / norm

    const bx = -z * ny
    const by = z * nx
    const bz = x * ny - y * nx

    const bnorm = Math.sqrt(bx * bx + by * by + bz * bz)
    const bnx = bx / bnorm
    const bny = by / bnorm
    const bnz = bz / bnorm

    const tx = nx * Math.cos(v) + bnx * Math.sin(v)
    const ty = ny * Math.cos(v) + bny * Math.sin(v)
    const tz = cz * Math.cos(v) + bnz * Math.sin(v)

    return {
      x: x + tube * tx,
      y: y + tube * ty,
      z: z + tube * tz,
    }
  },

  getDNAPoint: (length: number, radius: number) => {
    const t = Math.random() * Math.PI * length
    const strand = Math.random() > 0.5 ? 1 : -1
    const jx = (Math.random() - 0.5) * 1.5
    const jy = (Math.random() - 0.5) * 1.5
    const jz = (Math.random() - 0.5) * 1.5
    return {
      x: Math.cos(t) * radius * strand + jx,
      y: (t - (Math.PI * length) / 2) * 0.8 + jy,
      z: Math.sin(t) * radius * strand + jz,
    }
  },

  getGridPoint: (size: number, step: number) => {
    const half = size / 2
    const x = Math.floor(Math.random() * (size / step)) * step - half
    const y = Math.floor(Math.random() * (size / step)) * step - half
    const z = Math.floor(Math.random() * (size / step)) * step - half
    return {
      x: x + (Math.random() - 0.5) * step * 0.5,
      y: y + (Math.random() - 0.5) * step * 0.5,
      z: z + (Math.random() - 0.5) * step * 0.5,
    }
  },
}
