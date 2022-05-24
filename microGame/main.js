let cvs;
let ctx;
let time = 0;
let objects = [];
let noscaling = false;
let pixelated = false;

let frame_accuracy = 100;
let game_running = false;
let gamebackground = 'white';

function microGame(params) {
	console.clear()
	// Variables
	let width = 512;
	let height = 512;
	let bodybackground = 'url("microGame/assets/background.png")';
	let fps = 60;

	// Handle params
	if (params.width > 1) {
		width = params.width;
	}
	if (params.height > 1) {
		height = params.height;
	}
	if (params.gamebackground) {
		gamebackground = params.gamebackground;
	} 
	if (params.bodybackground) {
		bodybackground = params.bodybackground;
	}
	if (params.fps) {
		fps = params.fps;
	}
	if (params.noscaling) {
		noscaling = true;
	}
	if (params.pixelated) {
		pixelated = true;
	}
	if (params.debug) {
		debug_mode = true;
	}

	// Initialize
	const cvscontainer = document.createElement('div')
	cvs = document.createElement('canvas');
	ctx = cvs.getContext('2d');

	// Styling for the canvas and the container
	cvs.width = width;
	cvs.height = height;
	cvs.style.maxHeight = '100%'
	cvs.style.maxWidth = '100%'
	cvscontainer.style.position = 'fixed'
	cvscontainer.style.left = "50vw";
	cvscontainer.style.top = "50vh";
	cvscontainer.style.transform = "translate(-50%, -50%)"
	cvscontainer.style.width = width + "px";
	cvscontainer.style.height=height + "px";
	cvs.id = 'microGame'
	cvs.style.background = bodybackground;
	cvs.style.imageRendering = (pixelated ? 'pixelated' : '')
	cvs.style.boxShadow = '0px 0px 50px black'
	cvscontainer.appendChild(cvs)
	document.body.appendChild(cvscontainer)

	// Styling for the body
	document.body.style.minHeight = '100vh';
	document.body.style.margin = 0;
	document.body.style.overflow = 'hidden';
	document.body.style.background = bodybackground;

	// FPS for Debug
	if (debug_mode) {
		initDebug();
	}

	// Window scaling
	document.body.onresize = resizeMicroGame;
	resizeMicroGame();

	// Fullscreen button
	const fullscreenbutton = document.createElement('div');
	fullscreenbutton.innerHTML = `<svg 
	width="80" height="80" 
	viewbox="0 0 10 10" 
	style="cursor:pointer;position:fixed;top:10px;right:10px;filter:drop-shadow(5px 5px 5px #0006);"
	onmouseover="this.style.opacity = 0.5;"
	onmouseout="this.style.opacity = 1;"
	onclick="cvs.requestFullscreen();">
		<rect fill="white" x="0" y="0" width="3" height="1"></rect>
		<rect fill="white" x="0" y="0" width="1" height="3"></rect>

		<rect fill="white" x="7" y="0" width="3" height="1"></rect>
		<rect fill="white" x="9" y="0" width="1" height="3"></rect>

		<rect fill="white" x="0" y="9" width="3" height="1"></rect>
		<rect fill="white" x="0" y="7" width="1" height="3"></rect>

		<rect fill="white" x="7" y="9" width="3" height="1"></rect>
		<rect fill="white" x="9" y="7" width="1" height="3"></rect>
	</svg>`
	document.body.appendChild(fullscreenbutton)

	// Input events
	document.body.onkeydown = keyDown;
	document.body.onkeyup = keyUp;

	// Start the clock
	gamerunning = true;
	window.requestAnimationFrame(clockMicroGame);
	return ctx;
}

function resizeMicroGame() {
	cvs.style.transform = 'scale(' + Math.min((noscaling === true ? 1 : 9999),Math.min(window.innerWidth/cvs.width, window.innerHeight/cvs.height)) + ')';
}

function clockMicroGame() {
	// Clear canvas
	ctx.fillStyle = gamebackground;
	ctx.fillRect(0, 0, cvs.width, cvs.height)

	// If game hasn't loaded yet
	if (unloadedAssets !== 0) {
		ctx.beginPath();
		ctx.arc(
			cvs.width / 2, 
			cvs.height / 2, 
			Math.min(cvs.width, cvs.height) / 4, 
			Math.PI * 1.5,
			Math.PI * 1.5 + Math.PI * 2 / totalAssets * (totalAssets - unloadedAssets)
		);
		ctx.strokeStyle = "#4D97FF";
		ctx.lineWidth = Math.min(cvs.width, cvs.height) / 4;
		ctx.stroke();
		window.requestAnimationFrame(clockMicroGame);
		return;
	}

	if (!gamerunning) {
		return;
	}

	// Time and FPS
	time ++;
	if (debug_mode) {
		try {displayDebugText()} catch(e) {}
	}

	try {
		adjustCameraPosition()
	} catch (err) {}

	// Loop through game objects
	for (var o = 0; o < objects.length; o ++) {
		if (objects[o].deleted) {
			objects.splice(o, 1)
			o --;
		} else {
			objects[o].draw()
		}
	}

	// Custom draw call
	draw();

	// Reset key presses
	keys_pressed = new Set();

	// Request next frame
	window.requestAnimationFrame(clockMicroGame);
}