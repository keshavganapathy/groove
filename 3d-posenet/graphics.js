import * as BABYLON from 'babylonjs';

/**
 * GraphicsEngine class for running BabylonJS
 * and rendering 3D rigged character on it
 */
var modelName = "Dude.babylon"; // Should be either "Dude.babylon" or "BlueHumanoid.babylon"
 
export default class GraphicsEngine {
    /**
     * the class constructor
     * @param {HTMLCanvasElement} _canvas 
     * @param {Joints} _joints 
     */
    constructor(_canvas, _joints, _isPerson, reactApp){
        this.canvas = _canvas;
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.engine.displayLoadingUI();
        this.engine.loadingUIText = "Bablyon 3D Loading ...";
        this.joints = _joints;
        this.initScene();
        this.engine.hideLoadingUI();
		this.isPerson = _isPerson;
		this.reactApp = reactApp;
    }

    /**
     * Initialez the scene, creates the character
     * and defines how should joints of the character be updated
     */
    initScene(){
        this.scene = new BABYLON.Scene(this.engine);
        const camera = this.setCamera();
        const sphere = BABYLON.MeshBuilder.CreateSphere('', { diameter: .0001 }, this.scene);
		
		// Enable Physics (gravity)
		this.scene.enablePhysics(null, new BABYLON.OimoJSPlugin());
		
		// Adding light
		var light = new BABYLON.PointLight("dir01", new BABYLON.Vector3(0, 5, 5), this.scene);
		light.diffuse = new BABYLON.Color3(1, 1, 1);
		light.specular = new BABYLON.Color3(0, 0, 0);
		this.scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);
		
		// Added Ground
		var ground = BABYLON.Mesh.CreateGround("ground", 1000, 1000, 1, this.scene, false);
		var groundMaterial = new BABYLON.StandardMaterial("ground", this.scene);
		groundMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
		groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
		ground.material = groundMaterial;
		ground.receiveShadows = true;
		ground.checkCollisions = true;
		ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7}, this.scene);
		
		
        BABYLON.SceneLoader.ImportMesh("", `/dist/Scenes/Dude/`, modelName, this.scene, (newMeshes, particleSystems, skeletons) => {
            const mesh = newMeshes[0];
            const skeleton = skeletons[0];
            var head_bone;
			var right_shoulder_bone, right_arm_bone, right_hip_bone, right_knee_bone;
			var left_shoulder_bone, left_arm_bone, left_hip_bone, left_knee_bone;
			
			// Enable gravity on mesh
			mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, this.scene);
			mesh.applyGravity = true;
			mesh.checkCollisions = true;
			
			if(modelName == "Dude.babylon") {
				mesh.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
				mesh.position = new BABYLON.Vector3(0, 0, 0);
				
				/* Bone setup for Dude model */
				// Head
				head_bone = skeleton.bones[7];
				
				// Right Arm
				right_shoulder_bone = skeleton.bones[13];
				right_arm_bone = skeleton.bones[14];
				
				// Right Leg
				right_hip_bone = skeleton.bones[50];
				right_knee_bone = skeleton.bones[51];
				
				// Left Arm
				left_shoulder_bone = skeleton.bones[32];
				left_arm_bone = skeleton.bones[33];
				
				// Left Leg
				left_hip_bone = skeleton.bones[54];
				left_knee_bone = skeleton.bones[55];
			}
			else {
				mesh.scaling = new BABYLON.Vector3(4, 4, 4);
				mesh.position = new BABYLON.Vector3(0, 0, 0);
				
				/* Bone setup for Blue Humanoid Model */
				// Head
				head_bone = skeleton.bones[4];
				
				// Right Arm
				right_shoulder_bone = skeleton.bones[34]; // RightArm
				right_arm_bone = skeleton.bones[35];	// RightForeArm
				
				// Right Leg
				right_hip_bone = skeleton.bones[57];	// RightUpLeg
				right_knee_bone = skeleton.bones[58];	// RightLeg
				
				// Left Arm
				left_shoulder_bone = skeleton.bones[10]; // LeftArm
				left_arm_bone = skeleton.bones[11];	// LeftForeArm
				
				// Left Leg
				left_hip_bone = skeleton.bones[62];	// LeftUpLeg
				left_knee_bone = skeleton.bones[63];	// LeftLeg
			}				

            const lookAtCtl = new BABYLON.BoneLookController(mesh, head_bone, sphere.position, { adjustYaw: Math.PI * .5, adjustRoll: Math.PI * .5 });

            this.scene.registerBeforeRender(() => {

                const { data } = this.joints;

				if(modelName == "Dude.babylon") {
					sphere.position.x = 0 + data.head.x;
					sphere.position.y = 6 + data.head.y;
					sphere.position.z = 5;

					lookAtCtl.update();
					
					// Right Arm
					right_shoulder_bone.rotation = new BABYLON.Vector3(0, data.rightShoulder, 0); // Changed by Sid from 1.5 to 1
					right_arm_bone.rotation = new BABYLON.Vector3(0, data.rightElbow, 0);
					
					// Right Leg
					right_hip_bone.rotation = new BABYLON.Vector3(0, data.rightHip, 0);
					right_knee_bone.rotation = new BABYLON.Vector3(0, data.rightKnee, 0);
					
					// Left Arm
					left_shoulder_bone.rotation = new BABYLON.Vector3(0, data.leftShoulder, 0); // Changed by Sid from -1.5 to -1
					left_arm_bone.rotation = new BABYLON.Vector3(0, data.leftElbow, 0);
					
					// Left Leg
					left_hip_bone.rotation = new BABYLON.Vector3(0, data.leftHip, 0);
					left_knee_bone.rotation = new BABYLON.Vector3(0, data.leftKnee, 0);
				}
				else {
					sphere.position.x = 0 + data.head.x;
					sphere.position.y = 20 + data.head.y;
					sphere.position.z = 0;

					lookAtCtl.update();
					
					// Right Arm
					right_shoulder_bone.rotation = new BABYLON.Vector3(0, 0, -data.rightShoulder); // Changed by Sid from 1.5 to 1
					right_arm_bone.rotation = new BABYLON.Vector3(0, data.rightElbow, 0);
					
					// Right Leg
					right_hip_bone.rotation = new BABYLON.Vector3(0, 0, data.rightHip - Math.PI);
					right_knee_bone.rotation = new BABYLON.Vector3(0, 0, data.rightKnee);
					
					// Left Arm
					left_shoulder_bone.rotation = new BABYLON.Vector3(0, 0, -data.leftShoulder); // Changed by Sid from -1.5 to -1
					left_arm_bone.rotation = new BABYLON.Vector3(0, data.leftElbow, 0);
					
					// Left Leg
					left_hip_bone.rotation = new BABYLON.Vector3(0, 0, data.leftHip - Math.PI);
					left_knee_bone.rotation = new BABYLON.Vector3(0, 0, data.leftKnee);
				}
				
				// Check if user has followed current pose
				if(!this.isPerson && this.reactApp.posesDone<2) {
					//Check if pose matched!
					if(this.checkIfPoseMatched()) {
						alert("Great! You completed pose index: "+this.reactApp.posesDone + "\nNamed: "+this.joints.data['asanaName']);
						this.reactApp.posesDone = this.reactApp.posesDone + 1;
						this.reactApp.show_recorded_pose_having_index(this.reactApp.posesDone);
					}
				}
            });
        });
    };

	/** Check if current pose was matched by the user **/
	checkIfPoseMatched(){
		var targetJointsData = this.joints.data;
		var userJointsData = this.reactApp.joints.data;
		
		// Calculate sum of absolute angle differences for all joint angles
		var sum = 0;
		sum = sum + Math.abs(targetJointsData['rightShoulder'] - userJointsData['rightShoulder']);
		sum = sum + Math.abs(targetJointsData['rightElbow'] - userJointsData['rightElbow']);
		sum = sum + Math.abs(targetJointsData['rightHip'] - userJointsData['rightHip']);
		sum = sum + Math.abs(targetJointsData['rightKnee'] - userJointsData['rightKnee']);
		sum = sum + Math.abs(targetJointsData['leftShoulder'] - userJointsData['leftShoulder']);
		sum = sum + Math.abs(targetJointsData['leftElbow'] - userJointsData['leftElbow']);
		//console.log("Target rightShoulder angle is "+targetJointsData['rightShoulder']+" and your angle is "+userJointsData['rightShoulder']);
		sum = sum + Math.abs(targetJointsData['leftHip'] - userJointsData['leftHip']);
		sum = sum + Math.abs(targetJointsData['leftKnee'] - userJointsData['leftKnee']);
		
		// Return pose matched as true if sum is less than 90 degrees
		console.log("Sum of differences is "+sum);
		return sum < Math.PI/2;
	}

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