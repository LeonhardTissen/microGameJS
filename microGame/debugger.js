let debug_mode = false;
let debug_text;
let last_frame = 0;
let avg_frame_rate = [];

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
	Object Count: ${objects.length}
	Camera: ${camerax} ${cameray}`;
	last_frame = pf;
}

function initDebug() {
	debug_text = document.createElement('p')
	debug_text.style.position = 'absolute';
	debug_text.style.top = 0;
	debug_text.style.left = 0;
	debug_text.style.backgroundColor = '#FFF8'
	document.body.appendChild(debug_text)
}