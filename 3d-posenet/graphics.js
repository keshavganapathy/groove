import * as BABYLON from 'babylonjs';

/**
 * GraphicsEngine class for running BabylonJS
 * and rendering 3D rigged character on it
 */
export default class GraphicsEngine {
    /**
     * the class constructor
     * @param {HTMLCanvasElement} _canvas 
     * @param {Joints} _joints 
     */
    constructor(_canvas, _joints){
        this.canvas = _canvas;
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.engine.displayLoadingUI();
        this.engine.loadingUIText = "Bablyon 3D Loading ...";
        this.joints = _joints;
        this.initScene();
        this.engine.hideLoadingUI();
    }

    /**
     * Initialez the scene, creates the character
     * and defines how should joints of the character be updated
     */
    initScene(){
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = new BABYLON.Color3(0.5, 0.8, 0.5);
        const camera = this.setCamera();
        const sphere = BABYLON.MeshBuilder.CreateSphere('', { diameter: .0001 }, this.scene);
        BABYLON.SceneLoader.ImportMesh("", `/${process.env.BPATH}/Scenes/Dude/`, "Dude.babylon", this.scene, (newMeshes, particleSystems, skeletons) => {
            const mesh = newMeshes[0];
            const skeleton = skeletons[0];
            mesh.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
            mesh.position = new BABYLON.Vector3(0, 0, 0);

            const head_bone = skeleton.bones[7];
			
			// Right Arm
            const right_shoulder_bone = skeleton.bones[13];
            const right_arm_bone = skeleton.bones[14];
			
			// Right Leg
			const right_hip_bone = skeleton.bones[50];
			const right_knee_bone = skeleton.bones[51];
			
			// Left Arm
            const left_shoulder_bone = skeleton.bones[32];
            const left_arm_bone = skeleton.bones[33];
			
			// Left Leg
			const left_hip_bone = skeleton.bones[54];
			const left_knee_bone = skeleton.bones[55];

            const lookAtCtl = new BABYLON.BoneLookController(mesh, head_bone, sphere.position, { adjustYaw: Math.PI * .5, adjustRoll: Math.PI * .5 });

            this.scene.registerBeforeRender(() => {

                const { data } = this.joints;

                sphere.position.x = 0 + data.head.x;
                sphere.position.y = 6 + data.head.y;
                sphere.position.z = 5;

                lookAtCtl.update();
				
				// Right Arm
                right_shoulder_bone.rotation = new BABYLON.Vector3(0, data.rightShoulder, 0); // Changed by Sid from 1.5 to 1
                right_arm_bone.rotation = new BABYLON.Vector3(0, data.rightElbow, 0);
				
				// Right Leg
				right_hip_bone.rotation = new BABYLON.Vector3(0, data.rightHip, 0);
				//right_knee_bone.setRotation(new BABYLON.Vector3(0, data.rightKnee, 0), BABYLON.Space.Local, mesh);
				
				// Left Arm
				left_shoulder_bone.rotation = new BABYLON.Vector3(0, data.leftShoulder, 0); // Changed by Sid from -1.5 to -1
                left_arm_bone.rotation = new BABYLON.Vector3(0, data.leftElbow, 0);
				
				// Left Leg
				left_hip_bone.rotation = new BABYLON.Vector3(0, data.leftHip, 0);
				//left_knee_bone.setRotation(new BABYLON.Vector3(0, -data.leftKnee, 0), BABYLON.Space.Local, mesh);
            });
        });
    };

    /** BabylonJS render function that is called every frame */
    render(){
        const self = this;
        this.engine.runRenderLoop(() => {
            const self = this;
            if(self.scene) self.scene.render();
        });
    }

    /** Sets up 3d virtual cam for the scene */
    setCamera(){
        const camera = new BABYLON.ArcRotateCamera("camera", 0, 1, 20, BABYLON.Vector3.Zero(), this.scene);
        camera.setTarget(new BABYLON.Vector3(0, 4, 0));
        camera.setPosition(new BABYLON.Vector3(0, 5, 11))
        camera.attachControl(this.canvas, true);
        const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;
        return camera;
    }

}