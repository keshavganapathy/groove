/**
 * Transform class for mapping 
 * joints data from video stream space 
 * into Babylon 3D space
 */
export default class Transform{

    /**
     * the class constructor
     * @param {Joints} _joints 
     */
    constructor(_joints){
        this.joints = _joints;
    }

    /**
     * Updates joints data
     * @param {array} _keypoints raw joints data from posenet
     * @param {float} treshHoldScore for determining whether to update or no
     */
    updateKeypoints(_keypoints, treshHoldScore){
        this.keypoints = {};
        _keypoints.forEach(({ score, part, position }) => {
            if (score > treshHoldScore) this.keypoints[part] = position;
        });
        this.distance = null;
        this.headCenter = null;
        this.shoulderCenter = null;
        this.calibrate();
    };

    /**
     * Makes the system invariant to scale and translations,
     * given joints data
     */
    calibrate(){
        if (this.keypoints['leftEye'] && this.keypoints['rightEye']){

            const left_x = this.keypoints['leftEye'].x; 
            const left_y = this.keypoints['leftEye'].y; 
            const right_x = this.keypoints['rightEye'].x; 
            const right_y = this.keypoints['rightEye'].y;

            this.distance = Math.sqrt(Math.pow(left_x - right_x, 2) + Math.pow(left_y - right_y, 2));
            this.headCenter = {'x':(left_x + right_x) / 2.0, 'y':(left_y + right_y) / 2.0};
        }
        if (this.keypoints['leftShoulder'] && this.keypoints['rightShoulder']) {

            const left_x = this.keypoints['leftShoulder'].x;
            const left_y = this.keypoints['leftShoulder'].y;
            const right_x = this.keypoints['rightShoulder'].x;
            const right_y = this.keypoints['rightShoulder'].y;

            this.shoulderCenter = { 'x': (left_x + right_x) / 2.0, 'y': (left_y + right_y) / 2.0 };
			
			/* Added by Sid
			To update the angles of arms in Joints */
			
			// Update Left Arm
			var leftShoulderAngle = this.rotateJoint('leftShoulder', 'leftHip', 'leftElbow', 1, -Math.PI/2);
			console.log("Angle of leftShoulder angle in degrees is -> " + (57.2958 * leftShoulderAngle));
			var leftElbowAngle = this.rotateJoint('leftElbow', 'leftWrist', 'leftShoulder', 1, -Math.PI);
			
			// Update Left Leg
			var leftHipAngle = this.rotateJoint('leftHip', 'leftKnee', 'rightHip', -1, Math.PI*3/2);
			//var leftKneeAngle = this.rotateJoint('leftKnee', 'leftAnkle', 'leftHip', 1, Math.PI);
			
			// Update rightArm
			var rightShoulderAngle = this.rotateJoint('rightShoulder', 'rightHip', 'rightElbow', -1, Math.PI/2);
			var rightElbowAngle = this.rotateJoint('rightElbow', 'rightWrist', 'rightShoulder', -1, Math.PI);
			
			// Update rightLeg
			var rightHipAngle = this.rotateJoint('rightHip', 'rightKnee', 'leftHip', 1, -Math.PI*3/2);
			//var rightKneeAngle = this.rotateJoint('rightKnee', 'rightAnkle', 'rightHip', 1, Math.PI);
			
			
        }
    }

    /** Updates head joint data */
    head(){
        if(this.keypoints['nose'] && this.headCenter && this.shoulderCenter){
            var x = this.keypoints['nose'].x;
            var y = this.keypoints['nose'].y;
            // get nose relative points from origin
            x = (this.headCenter.x - x)/(this.distance/15);
            y = this.shoulderCenter.y - y;
            // normalize (i.e. scale it)
            y = this.map(y,this.distance*1.5,this.distance*2.8,-2,2);
            // console.log(140/this.distance,260/this.distance);
            this.joints.update('head', { x, y });
            return { x, y };
        }
    }
    
    /**
     * Updates joints data and returns angle between three joints
     * @param {integer} jointA index of a joint
     * @param {intger} jointB index of a joint
     * @param {intger} jointC index of a joint
	 * @param {float} default angle of the joint for the 3D model
     * @returns {float} angle
     */
    rotateJoint(jointA, jointB, jointC, multiplier, defaultAngle){
        if (this.keypoints[jointA] && this.keypoints[jointB] && this.keypoints[jointC]){
            const angle = this.findAngle(this.keypoints[jointA], this.keypoints[jointB], this.keypoints[jointC]) * multiplier + defaultAngle;
            //const sign = (this.keypoints[jointC].y > this.keypoints[jointB].y) ? 1 : -1;
			var sign = 1;
			if(jointA == "leftElbow" || jointA == "rightElbow")
				if(this.is_Angle_B_Greater_Than_Angle_C(this.keypoints[jointA], this.keypoints[jointB], this.keypoints[jointC]))
					sign = -1;
            this.joints.update(jointA, angle * sign); // Changed by Sid from jointB to jointA and removed sign multiplier
			return angle * sign;
        }
    }

    /** Maps from one linear interpolation into another one */
    map(original, in_min, in_max, out_min, out_max) {
        return (original - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    /**
     * Returns angle in radians given three points p1, p2, p3
     * @param {integer} p1 
     * @param {integer} p2
     * @param {integer} p3
     * @returns {float}
     */
    findAngle(p1,p2,p3){
        const p12 = Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
        const p13 = Math.sqrt(Math.pow((p1.x - p3.x), 2) + Math.pow((p1.y - p3.y), 2));
        const p23 = Math.sqrt(Math.pow((p2.x - p3.x), 2) + Math.pow((p2.y - p3.y), 2));
        const resultRadian = Math.acos(((Math.pow(p12, 2)) + (Math.pow(p13, 2)) - (Math.pow(p23, 2))) / (2 * p12 * p13));
        return resultRadian;
    }

	is_Angle_B_Greater_Than_Angle_C(pointA, pointB, pointC) {
		var vectorBA = {'x': pointB.x - pointA.x, 'y': pointB.y - pointA.y};
		var vectorCA = {'x': pointC.x - pointA.x, 'y': pointC.y - pointA.y};
		var angleB = Math.acos(vectorBA.x/Math.sqrt(Math.pow(vectorBA.x, 2) + Math.pow(vectorBA.y, 2)));
		var angleC = Math.acos(vectorCA.x/Math.sqrt(Math.pow(vectorCA.x, 2) + Math.pow(vectorCA.y, 2)));
		return angleB > angleC;
	}
}