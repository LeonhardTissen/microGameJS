let cvs;
let ctx;
let time = 0;
let objects = [];
let clickable_objects = [];
let noscaling = false;
let pixelated = false;

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
	cvs.onclick = function() {
		handleEvent('onclick')
	};
	cvs.onmousedown = function() {
		handleEvent('onmousedown')
	};
	cvs.onmouseup = function() {
		handleEvent('onmouseup')
	};
	cvs.onmousemove = function() {
		cvs.style.cursor = 'default'; 
		handleEvent('onmouseover')
	};
	cvs.onmouseout = function() {
		handleEvent('onmouseout')
	};
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
	const controlpanel = document.createElement('div');
	controlpanel.style.backgroundColor = '#0003'
	controlpanel.style.width = '200px';
	controlpanel.style.padding = '10px';
	controlpanel.style.borderRadius = '20px'
	controlpanel.style.position = 'fixed';
	controlpanel.style.right = '10px';
	controlpanel.style.top = '10px';

	controlpanel.innerHTML = `
	<svg 
	width="60" height="60" 
	viewbox="0 0 10 10" 
	style="cursor:pointer;filter:drop-shadow(5px 5px 5px #0006);"
	onmouseover="this.style.opacity = 0.5;"
	onmouseout="this.style.opacity = 1;"
	onclick="pauseButton();">
		<rect fill="white" x="1" y="1" width="2" height="8"></rect>
		<rect fill="white" x="7" y="1" width="2" height="8"></rect>
	</svg>
	<svg 
	width="60" height="60" 
	viewbox="0 0 10 10" 
	style="cursor:pointer;filter:drop-shadow(5px 5px 5px #0006);"
	onmouseover="this.style.opacity = 0.5;"
	onmouseout="this.style.opacity = 1;"
	onclick="fullScreenButton()">
		<rect fill="white" x="0" y="0" width="3" height="1"></rect>
		<rect fill="white" x="0" y="0" width="1" height="3"></rect>

		<rect fill="white" x="7" y="0" width="3" height="1"></rect>
		<rect fill="white" x="9" y="0" width="1" height="3"></rect>

		<rect fill="white" x="0" y="9" width="3" height="1"></rect>
		<rect fill="white" x="0" y="7" width="1" height="3"></rect>

		<rect fill="white" x="7" y="9" width="3" height="1"></rect>
		<rect fill="white" x="9" y="7" width="1" height="3"></rect>
	</svg>`
	document.body.appendChild(controlpanel)

	// Input events
	document.body.onkeydown = keyDown;
	document.body.onkeyup = keyUp;

	// Start the clock
	gamerunning = true;
	window.requestAnimationFrame(clockMicroGame);
	return ctx;
}

function pauseButton() {
	gamerunning = !gamerunning;
	if (gamerunning) {
		clockMicroGame();
	}
}

let fullscreen = false;
function fullScreenButton() {
	if (fullscreen) {
		document.exitFullscreen()
	} else {
		document.body.requestFullscreen();
	}
	fullscreen = !fullscreen;
}

function resizeMicroGame() {
	cvs.style.transform = 'scale(' + Math.min((noscaling === true ? 1 : 9999),Math.min(window.innerWidth/cvs.width, window.innerHeight/cvs.height)) + ')';
}

function clockMicroGame() {
	// If game hasn't loaded yet
	if (unloadedAssets !== 0) {
		ctx.fillStyle = '#4D97FF';
		ctx.fillRect(0, 0, cvs.width, cvs.height)
		ctx.beginPath();
		ctx.arc(
			cvs.width / 2, 
			cvs.height / 2, 
			Math.min(cvs.width, cvs.height) / 4, 
			Math.PI * 1.5,
			Math.PI * 1.5 + Math.PI * 2 / totalAssets * (totalAssets - unloadedAssets)
		);
		ctx.strokeStyle = "#3D78CC";
		ctx.lineWidth = Math.min(cvs.width, cvs.height) / 4;
		ctx.stroke();
		window.requestAnimationFrame(clockMicroGame);
		return;
	}

	if (!gamerunning) {
		return;
	}

	// Clear canvas
	ctx.fillStyle = gamebackground;
	ctx.fillRect(0, 0, cvs.width, cvs.height)

	// Time and FPS
	pf = performance.now()
	frame = 1000 / (pf - last_frame);
	deltay = 60 / frame;
	if (isNaN(deltay)) {
		deltay = 1;
	}
	if (debug_mode) {
		displayDebugText();
	}
	last_frame = pf;
	time += deltay;

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

function handleEvent(type) {
	clickable_objects.forEach((obj) => {
		if (event.layerX > obj.x - obj.width / 2 && 
			event.layerY > obj.y - obj.height/ 2 && 
			event.layerX < obj.x + obj.width / 2 && 
			event.layerY < obj.y + obj.height/ 2) {
			switch (type) {
				case "onclick": obj.onclick(); break;
				case "onmousedown": obj.onmousedown(); break;
				case "onmouseup": obj.onmouseup(); break;
				case "onmouseover":
					cvs.style.cursor = 'pointer'; 
					if (!obj.hovering) {
						obj.hovering = true;
						obj.onmouseover();
					}
					break;
			}
		} else {
			if (type === "onmouseover" && obj.hovering) {
				obj.onmouseout();
				obj.hovering = false;
			}
		}
	})
}