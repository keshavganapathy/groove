
import Joints from './joints';
import GraphicsEngine from './graphics';
import PoseNet from './posenet';


window.genObj = {
    refs: {
        babylonUser: document.getElementById("babylonUser"),
        video: document.getElementById("video"),
        output: document.getElementById("output")
    }
}


async function start() {
genObj.joints = new Joints();
genObj.graphics_engine = new GraphicsEngine(genObj.refs.babylonUser, genObj.joints);
genObj.posenet = new PoseNet(genObj.joints, genObj.graphics_engine, genObj.refs);
//const descContent = fs.readFileSync("./description.md", "utf-8");
//this.refs.description.innerHTML = markdown.toHTML(descContent);
await genObj.posenet.loadNetwork();
//this.setState({loading: false});
genObj.posenet.startPrediction().then((webcam) => {
    //this.setState({ webcam });
});

}


start();


