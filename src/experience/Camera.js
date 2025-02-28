// Libraries
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import TWEEN from "@tweenjs/tween.js";
// Utils
import Experience from "./Experience";
import { monitor1, polaroid, spawn } from "./Locations";
export default class Camera {
	constructor() {
		this.experience = new Experience();
		this.sizes = this.experience.sizes;
		this.scene = this.experience.scene;
		this.renderer = this.experience.renderer;
		this.monitor = this.scene.getObjectByName("monitorView");
		this.setInstance();
	}
	setInstance() {
		this.instance = new THREE.PerspectiveCamera(
			60,
			this.sizes.width / this.sizes.height,
			0.1,
			5000
		);

		this.instance.position.copy(spawn.POSITION);
		// const gui = new dat.GUI({
		// 	width: 400,
		// });

		// gui.add(this.instance.position, "x", -200, 200, 0.01);
		// gui.add(this.instance.position, "y", -200, 200, 0.01);
		// gui.add(this.instance.position, "z", -200, 200, 0.01);
	}
	// const worldIndex = this.scene.children.findIndex(
	// 	(_child) => _child instanceof THREE.Group
	// );
	// console.log(this.scene.children);
	// const mesh = this.scene.children[worldIndex].children.filter(
	// 	(child) => child.name == "MenuNav1"
	// )[0];
	// console.log(mesh.position);

	setOrbitControls() {
		console.log(this.experience.renderer);
		this.controls = new OrbitControls(
			this.instance,
			this.experience.renderer.rendererGl.domElement
		);
		const { x, y, z } = spawn.TARGET;
		this.controls.target = new THREE.Vector3(x, y, z);

		// this.controls.target = new THREE.Vector3(-45, 11, 30);
		this.controls.enableDamping = true;
	}

	resize() {
		this.instance.aspect = this.sizes.width / this.sizes.height;
		this.instance.updateProjectionMatrix();
	}

	update() {
		TWEEN.update();
		this.controls.update();
	}

	/**
	 * Route Determination
	 * @param {String} navName
	 */
	animateNavigation(navName) {
		let pos;
		let tar;
		const monitor = this.scene.getObjectByName("monitorView");
		switch (navName) {
			case "Projects":
				pos = monitor1.POSITION;
				tar = monitor1.TARGET;
				// monitor.visible = true;
				break;
			case "Github":
				window.open("https://github.com/oceansam", "_blank").focus();
				break;
			case "Linkedin":
				window
					.open("https://www.linkedin.com/in/samee-chowdhury", "_blank")
					.focus();
				break;
			case "Polaroid":
				pos = polaroid.POSITION;
				tar = polaroid.TARGET;
				break;
			case "Spawn":
				pos = spawn.POSITION;
				tar = spawn.TARGET;
			// monitor.visible = false;

			default:
				break;
		}
		if (pos && tar) {
			const duration = 1000;
			const keyframe = {
				position: new THREE.Vector3(pos.x, pos.y, pos.z),
				focalPoint: new THREE.Vector3(tar.x, tar.y, tar.z),
			};
			console.log(keyframe.position);
			const posTween = new TWEEN.Tween(this.instance.position)
				.to(keyframe.position, duration)
				.easing(TWEEN.Easing.Quintic.InOut);

			const focTween = new TWEEN.Tween(this.controls.target)
				.to(keyframe.focalPoint, duration)
				.easing(TWEEN.Easing.Quintic.InOut);

			posTween.start();
			focTween.start();
		}

		// // Determine navigation route

		// // Animate and change camera target
		// gsap.to(this.instance.position, {
		// 	x: pos.x,
		// 	y: pos.y,
		// 	z: pos.z,
		// });

		// gsap.to(this.controls.target, { x: tar.x, y: tar.y, z: tar.z });

		this.resize();
	}
}
