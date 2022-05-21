let cvs;
let ctx;
let time = 0;
let last_frame = 0;
let avg_frame_rate = [];
let objects = [];
let keys_held = new Set();
let keys_pressed = new Set();

let debug_mode = false;
let frame_accuracy = 100;
let debug_text;

function microGame(params) {
	// Variables
	let width = 512;
	let height = 512;
	let gamebackground = 'white';
	let bodybackground = 'url("microGame/assets/background.png")';
	let fps = 60;
	let noscaling = false;
	let pixelated = false;

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
	cvs.style.backgroundColor = gamebackground;
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
		debug_text = document.createElement('p')
		debug_text.style.position = 'absolute';
		debug_text.style.top = 0;
		debug_text.style.left = 0;
		cvscontainer.appendChild(debug_text)
	}

	// Window scaling
	if (!noscaling) {
		document.body.onresize = resizeMicroGame;
		resizeMicroGame();
	}

	// More events
	document.body.onkeydown = function() {
		if (event.repeat) return;
		keys_held.add(event.key);
		keys_pressed.add(event.key);
	}
	document.body.onkeyup = function() {
		keys_held.delete(event.key);
	}

	// Start the clock
	window.requestAnimationFrame(clockMicroGame);
	return ctx;
}

function resizeMicroGame() {
	cvs.style.transform = 'scale(' + Math.min(window.innerWidth/cvs.width, window.innerHeight/cvs.height) + ')';
}

function clockMicroGame() {
	// Time and FPS
	time ++;
	if (debug_mode) {
		displayDebugText();
	}

	// Clear canvas
	ctx.clearRect(0, 0, cvs.width, cvs.height)

	// Loop through game objects
	objects.forEach((obj) => {
		obj.draw()
	});

	// Custom draw call
	draw();

	// Reset key presses
	keys_pressed = new Set();

	// Request next frame
	window.requestAnimationFrame(clockMicroGame);
}

// debug 
function displayDebugText() {
	const pf = performance.now()
	avg_frame_rate.push(1000 / (pf - last_frame))
	if (avg_frame_rate.length > frame_accuracy) {
		avg_frame_rate.shift()
	}
	let avg = 0;
	avg_frame_rate.forEach((fps) => {
		avg += fps
	})
	debug_text.innerText = `${Math.floor(avg / avg_frame_rate.length)} FPS
	Keys Held: [${Array.from(keys_held)}] 
	Keys Pressed: [${Array.from(keys_pressed)}]
	Object Count: ${objects.length}`;
	last_frame = pf;
}

function keyPress(type) {
	return keys_pressed.has(type);
}
function keyHeld(type) {
	return keys_held.has(type);
}