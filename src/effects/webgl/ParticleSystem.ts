import * as THREE from 'three'
import gsap from 'gsap'
import { particleMath } from './particleMath'
import { shaderCurlNoise, shaderNoise3D } from './shaders'
import type { WebGLCore } from './WebGLCore'

export class ParticleSystem {
  webgl: WebGLCore
  count: number
  targetMorph = 0
  morphProgress = 0
  geometry!: THREE.BufferGeometry
  material!: THREE.ShaderMaterial
  mesh!: THREE.Points

  constructor(webgl: WebGLCore) {
    this.webgl = webgl
    this.count = window.innerWidth < 768 ? 20000 : 60000
    this.initGeometry()
    this.initMaterial()
    this.initMesh()
  }

  initGeometry() {
    this.geometry = new THREE.BufferGeometry()

    const pos0 = particleMath.generateFibonacciSphere(this.count, 15)
    const pos1 = new Float32Array(this.count * 3)
    const pos2 = new Float32Array(this.count * 3)
    const pos3 = new Float32Array(this.count * 3)
    const pos4 = new Float32Array(this.count * 3)
    const randoms = new Float32Array(this.count * 3)

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3

      const p1 = particleMath.getTorusKnotPoint(10, 3, 3, 4)
      pos1[i3] = p1.x
      pos1[i3 + 1] = p1.y
      pos1[i3 + 2] = p1.z

      const p2 = particleMath.getGridPoint(30, 2)
      pos2[i3] = p2.x
      pos2[i3 + 1] = p2.y
      pos2[i3 + 2] = p2.z

      pos3[i3] = (Math.random() - 0.5) * 60
      pos3[i3 + 1] = (Math.random() - 0.5) * 60
      pos3[i3 + 2] = (Math.random() - 0.5) * 60

      const p4 = particleMath.getDNAPoint(20, 8)
      pos4[i3] = p4.x
      pos4[i3 + 1] = p4.y
      pos4[i3 + 2] = p4.z

      randoms[i3] = Math.random()
      randoms[i3 + 1] = Math.random()
      randoms[i3 + 2] = Math.random()
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(pos0, 3))
    this.geometry.setAttribute('aPos0', new THREE.BufferAttribute(pos0, 3))
    this.geometry.setAttribute('aPos1', new THREE.BufferAttribute(pos1, 3))
    this.geometry.setAttribute('aPos2', new THREE.BufferAttribute(pos2, 3))
    this.geometry.setAttribute('aPos3', new THREE.BufferAttribute(pos3, 3))
    this.geometry.setAttribute('aPos4', new THREE.BufferAttribute(pos4, 3))
    this.geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3))
  }

  initMaterial() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMorphProgress: { value: 0 },
        uMorphTarget1: { value: 0 },
        uMorphTarget2: { value: 0 },
        uMouse: { value: new THREE.Vector3() },
        uColor1: { value: new THREE.Color(0x00ffcc) },
        uColor2: { value: new THREE.Color(0x7000ff) },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uMorphProgress;
        uniform int uMorphTarget1;
        uniform int uMorphTarget2;
        uniform vec3 uMouse;

        attribute vec3 aPos0;
        attribute vec3 aPos1;
        attribute vec3 aPos2;
        attribute vec3 aPos3;
        attribute vec3 aPos4;
        attribute vec3 aRandom;

        varying float vNoise;

        ${shaderNoise3D}
        ${shaderCurlNoise}

        vec3 getPos(int target) {
            if(target == 0) return aPos0;
            if(target == 1) return aPos1;
            if(target == 2) return aPos2;
            if(target == 3) return aPos3;
            if(target == 4) return aPos4;
            return aPos0;
        }

        void main() {
            vec3 p1 = getPos(uMorphTarget1);
            vec3 p2 = getPos(uMorphTarget2);

            float ease = smoothstep(0.0, 1.0, uMorphProgress);
            vec3 pos = mix(p1, p2, ease);

            vec3 curl = curlNoise(pos * 0.15 + uTime * 0.1);
            pos += curl * 1.2;

            float dist = distance(pos.xy, uMouse.xy * 25.0);
            if(dist < 10.0) {
                vec3 dir = normalize(vec3(pos.xy - uMouse.xy * 25.0, pos.z));
                float force = (10.0 - dist) / 10.0;
                pos += dir * force * 4.0;
            }

            float spike = sin(uMorphProgress * 3.14159);
            pos += curlNoise(pos + aRandom * 10.0) * spike * 5.0;

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;

            gl_PointSize = (1.5 + aRandom.x * 2.0) * (40.0 / -mvPosition.z);
            vNoise = snoise(pos * 0.2 + uTime * 0.2);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying float vNoise;

        void main() {
            vec2 coord = gl_PointCoord - vec2(0.5);
            if(length(coord) > 0.5) discard;

            vec3 color = mix(uColor1, uColor2, vNoise * 0.5 + 0.5);
            float alpha = smoothstep(0.5, 0.1, length(coord));

            gl_FragColor = vec4(color, alpha * 0.7);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  }

  initMesh() {
    this.mesh = new THREE.Points(this.geometry, this.material)
    this.webgl.scene.add(this.mesh)
  }

  setMorphTarget(index: number) {
    if (this.targetMorph === index) return

    this.material.uniforms.uMorphTarget1.value = this.targetMorph
    this.material.uniforms.uMorphTarget2.value = index
    this.targetMorph = index
    this.morphProgress = 0

    gsap.to(this, {
      morphProgress: 1,
      duration: 2.5,
      ease: 'power3.inOut',
      onUpdate: () => {
        this.material.uniforms.uMorphProgress.value = this.morphProgress
      },
    })
  }

  update(time: number, mouse: THREE.Vector2) {
    this.material.uniforms.uTime.value = time
    this.material.uniforms.uMouse.value.set(mouse.x, mouse.y, 0)

    this.mesh.rotation.y = time * 0.05
    this.mesh.rotation.x = Math.sin(time * 0.02) * 0.1
  }

  dispose() {
    this.geometry.dispose()
    this.material.dispose()
    this.webgl.scene.remove(this.mesh)
  }
}
