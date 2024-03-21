import {
    ViewerApp,
    AssetManagerPlugin,
    GBufferPlugin,
    ProgressivePlugin,
    TonemapPlugin,
    SSRPlugin,
    SSAOPlugin,
    mobileAndTabletCheck,
    BloomPlugin,
    Vector3, GammaCorrectionPlugin, MeshBasicMaterial2, Color, AssetImporter
} from "webgi";
import "./styles.css";

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from '@studio-freight/lenis'

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
  direction: 'vertical', // vertical, horizontal
  gestureDirection: 'vertical', // vertical, horizontal, both
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

lenis.stop()

function raf(time: number) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  
  requestAnimationFrame(raf)

gsap.registerPlugin(ScrollTrigger)

async function setupViewer(){

    const viewer = new ViewerApp({
        canvas: document.getElementById('webgi-canvas') as HTMLCanvasElement,
        // isAntialiased: true,
    })

    const isMobile = mobileAndTabletCheck()
    // console.log(isMobile)

    const manager = await viewer.addPlugin(AssetManagerPlugin)
    const camera = viewer.scene.activeCamera
    const position = camera.position
    const target = camera.target
    const exitButton = document.querySelector('.button--exit') as HTMLElement
    const customizerInterface = document.querySelector('.customizer--container') as HTMLElement

    // Add plugins individually.
    await viewer.addPlugin(GBufferPlugin)
    await viewer.addPlugin(new ProgressivePlugin(32))
    await viewer.addPlugin(new TonemapPlugin(true))
    await viewer.addPlugin(GammaCorrectionPlugin)
    await viewer.addPlugin(SSRPlugin)
    await viewer.addPlugin(SSAOPlugin)
    await viewer.addPlugin(BloomPlugin)

    // Loader
    const importer = manager.importer as AssetImporter

    importer.addEventListener("onProgress", (ev) => {
        const progressRatio = (ev.loaded / ev.total)
        // console.log(progressRatio)
        document.querySelector('.progress')?.setAttribute('style', `transform: scaleX(${progressRatio})`)
    })

    importer.addEventListener("onLoad", (ev) => {
        gsap.to('.loader', {x: '100%', duration: 0.8, ease: 'power4.inOut', delay: 1, onComplete: () =>{
            document.body.style.overflowY = 'auto'
            lenis.start()

        }})
    })

    viewer.renderer.refreshPipeline()

    await manager.addFromPath("./assets/Watch7.glb")

    const drillMaterial = manager.materials!.findMaterialsByName('Drill_01')[0] as MeshBasicMaterial2

    viewer.getPlugin(TonemapPlugin)!.config!.clipBackground = true // in case its set to false in the glb

    viewer.scene.activeCamera.setCameraOptions({controlsEnabled: false})

    // viewer.scene.position.set(-2,-1.1,5.5)

    if (isMobile){
        position.set(-5.54, -2.85, 9.97)
        target.set(0.63,-1.37, -0.88)
        camera.setCameraOptions({ fov: 40 })
    }

    onUpdate()
    
    window.scrollTo(0,0)

    function setupScrollanimation(){

        const tl = gsap.timeline()

        // FIRST SECTION

        tl
        .to(position, {x: isMobile ? 4.46 : 3.96, y: isMobile ?  -4.005 :  -3.46, z: isMobile ? -9.51 :  -8.22,
            scrollTrigger: {
                trigger: ".second",
                start:"top bottom",
                end: "top top", scrub: true,
                immediateRender: false
        }, onUpdate})

        .to(".section--one--container", { xPercent:'-150' , opacity:0,
            scrollTrigger: {
                trigger: ".second",
                start:"top bottom",
                end: "top 80%", scrub: 1,
                immediateRender: false
        }})
        .to(target, {x: isMobile ? 0.18 : -1.41, y: isMobile ? -1.42 : 0.43 , z: isMobile ? -1.03 : -0.64,
            scrollTrigger: {
                trigger: ".second",
                start:"top bottom",
                end: "top top", scrub: true,
                immediateRender: false
        }})

        // third SECTION
       
        .to(position, { x: isMobile ? -9.63 : -10.52, y: isMobile ?  0.37 :  0.62, z: isMobile ? -0.56 :  0.18,
            scrollTrigger: {
                trigger: ".third",
                start:"top bottom",
                end: "top top", scrub: true,
                immediateRender: false
        }, onUpdate})

        .to(".section--two--container", { xPercent:'-150' , opacity:0,
            scrollTrigger: {
                trigger: ".third",
                start:"top bottom",
                end: "top 50%", scrub: 1,
                immediateRender: false
        }})
       
        .to(target, { x: isMobile ? 0.12: -0.096, y: isMobile ? -0.69 : -0.19 , z: isMobile ? 0.18 : -2.02,
            scrollTrigger: {
                trigger: ".third",
                start:"top bottom",
                end: "top top", scrub: true,
                immediateRender: false
        }})


        //last section
        
        .to(position, {x: isMobile ? -0.07: -0.32, y: isMobile ? -1.56 : -0.77 , z: isMobile ? 15.13 : 9.14,
            scrollTrigger: {
                trigger: ".fourth",
                start:"top bottom",
                end: "top top", scrub: true,
                immediateRender: false
        }, onUpdate})

        .to(".section--third--container", { xPercent:'-150' , opacity:0,
            scrollTrigger: {
                trigger: ".fourth",
                start:"top bottom",
                end: "top 50%", scrub: 1,
                immediateRender: false
        }})
        
        .to(target, {x: isMobile ? 0.09: 0.04, y: isMobile ? -2.07 : 0.199 , z: isMobile ? 0.22 : -0.32,
            scrollTrigger: {
                trigger: ".fourth",
                start:"top bottom",
                end: "top 50%", scrub: true,
                immediateRender: false
        }})
    }

    setupScrollanimation()

    // WEBGI UPDATE
    let needsUpdate = true;

    function onUpdate() {
        needsUpdate = true;
        // viewer.renderer.resetShadows()
        viewer.setDirty()
    }

    viewer.addEventListener('preFrame', () =>{
        if(needsUpdate){
            camera.positionTargetUpdated(true)
            needsUpdate = false
        }
    })

    // KNOW MORE EVENT
	document.querySelector('.button--hero')?.addEventListener('click', () => {
		const element = document.querySelector('.second')
		window.scrollTo({ top: element?.getBoundingClientRect().top, left: 0, behavior: 'smooth' })
	})

	// SCROLL TO TOP
	document.querySelectorAll('.button--footer')?.forEach(item => {
		item.addEventListener('click', () => {
			window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
		})
	})

    // CUSTOMIZE
    const sections = document.querySelector('.container') as HTMLElement
    const mainContainer = document.getElementById('webgi-canvas-container') as HTMLElement
	document.querySelector('.button--customize')?.addEventListener('click', () => {
        sections.style.display = "none"
        mainContainer.style.pointerEvents = "all"
        document.body.style.cursor = "grab"
        lenis.stop()

        gsap.to(position, {x: -2.6, y: 0.2, z: -9.6, duration: 2, ease: "power3.inOut", onUpdate})
        gsap.to(target, {x: -0.15, y: 1.18 , z: 0.12, duration: 2, ease: "power3.inOut", onUpdate, onComplete: enableControlers})
	})

    function enableControlers(){
        exitButton.style.display = "block"
        customizerInterface.style.display = "block"
        viewer.scene.activeCamera.setCameraOptions({controlsEnabled: true})
    }


    // EXIT CUSTOMIZER
	exitButton.addEventListener('click', () => {
        gsap.to(position, {x: -3.4, y: 9.6, z: 1.71, duration: 1, ease: "power3.inOut", onUpdate})
        gsap.to(target, {x: -1.5, y: 2.13 , z: -0.4, duration: 1, ease: "power3.inOut", onUpdate})

        viewer.scene.activeCamera.setCameraOptions({controlsEnabled: false})
        sections.style.display = "contents"
        mainContainer.style.pointerEvents = "none"
        document.body.style.cursor = "default"
        exitButton.style.display = "none"
        customizerInterface.style.display = "none"
        lenis.start()

	})

    document.querySelector('.button--colors.black')?.addEventListener('click', () => {
		changeColor(new Color(0x383830).convertSRGBToLinear())
    })

    document.querySelector('.button--colors.red')?.addEventListener('click', () => {
		changeColor(new Color(0xfe2d2d).convertSRGBToLinear())
    })

    document.querySelector('.button--colors.yellow')?.addEventListener('click', () => {
		changeColor(new Color(0xffffff).convertSRGBToLinear())
    })

    function changeColor(_colorToBeChanged: Color){
        drillMaterial.color = _colorToBeChanged;
        viewer.scene.setDirty()
    }

}

setupViewer()
