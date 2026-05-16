import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { createUltimatePostShader } from './shaders'
import { particleMath } from './particleMath'

export class WebGLCore {
  canvas: HTMLCanvasElement
  width: number
  height: number
  pixelRatio: number
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  composer!: EffectComposer
  customPass!: ShaderPass
  clock: THREE.Clock
  mouse: THREE.Vector2
  targetMouse: THREE.Vector2
  scrollVelocity = 0
  targetScrollVelocity = 0

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)

    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2(0x030305, 0.02)

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      0.1,
      1000,
    )
    this.camera.position.z = 35

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
    })
    this.renderer.setSize(this.width, this.height)
    this.renderer.setPixelRatio(this.pixelRatio)
    this.renderer.setClearColor(0x030305, 1)

    this.clock = new THREE.Clock()
    this.mouse = new THREE.Vector2(0, 0)
    this.targetMouse = new THREE.Vector2(0, 0)

    this.initPostProcessing()
    window.addEventListener('resize', this.onResize)
    window.addEventListener('mousemove', this.onMouseMove)
  }

  dispose() {
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('mousemove', this.onMouseMove)
    this.renderer.dispose()
  }

  initPostProcessing() {
    const ultimate = createUltimatePostShader(THREE)
    this.composer = new EffectComposer(this.renderer)
    const renderPass = new RenderPass(this.scene, this.camera)
    this.composer.addPass(renderPass)

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(this.width, this.height),
      1.5,
      0.4,
      0.85,
    )
    this.composer.addPass(bloomPass)

    this.customPass = new ShaderPass(ultimate)
    this.customPass.uniforms.uResolution.value.set(this.width, this.height)
    this.composer.addPass(this.customPass)
  }

  onResize = () => {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.width, this.height)
    this.composer.setSize(this.width, this.height)
    this.customPass.uniforms.uResolution.value.set(this.width, this.height)
  }

  onMouseMove = (e: MouseEvent) => {
    this.targetMouse.x = (e.clientX / this.width) * 2 - 1
    this.targetMouse.y = -(e.clientY / this.height) * 2 + 1
  }

  render() {
    const time = this.clock.getElapsedTime()

    this.mouse.lerp(this.targetMouse, 0.05)
    this.scrollVelocity = particleMath.lerp(
      this.scrollVelocity,
      this.targetScrollVelocity,
      0.1,
    )
    this.targetScrollVelocity *= 0.9

    this.camera.position.x = this.mouse.x * 3
    this.camera.position.y = this.mouse.y * 3
    this.camera.lookAt(0, 0, 0)

    this.customPass.uniforms.uTime.value = time
    this.customPass.uniforms.uVelocity.value = Math.abs(this.scrollVelocity)

    const shaderMouseX = (this.mouse.x + 1) / 2
    const shaderMouseY = (this.mouse.y + 1) / 2
    this.customPass.uniforms.uMouse.value.set(shaderMouseX, shaderMouseY)

    this.composer.render()
  }
}
