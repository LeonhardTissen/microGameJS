let debug_mode = false;
let debug_text;
let avg_frame_rate = [];
let frame_accuracy = 100;
let frame;
let last_frame;
let deltay;

function displayDebugText() {
	avg_frame_rate.push(frame)
	if (avg_frame_rate.length > frame_accuracy) {
		avg_frame_rate.shift()
	}
	let avg = 0;
	avg_frame_rate.forEach((fps) => {
		avg += fps
	})
	debug_text.innerText = `${Math.floor(frame)} FPS (avg: ${Math.floor(avg / avg_frame_rate.length)}) Game Time: ${Math.round(time)}
	Keys Held: [${Array.from(keys_held)}] 
	Keys Pressed: [${Array.from(keys_pressed)}]
	Object Count: ${objects.length}
	Clickable Object Count: ${clickable_objects.length}
	Camera: ${camerax} ${cameray}`;
}

function initDebug() {
	debug_text = document.createElement('p')
	debug_text.style.position = 'absolute';
	debug_text.style.top = 0;
	debug_text.style.left = 0;
	debug_text.style.backgroundColor = '#FFF8'
	document.body.appendChild(debug_text)
}

console.log = log;
console.error = log;

function log(message, line) {
	const msgwindow = document.createElement('div');
	msgwindow.classList.add('msgwindow')
	msgwindow.style.position = 'fixed';
	msgwindow.style.left = '17px';
	msgwindow.style.bottom = '-40px';
	msgwindow.style.padding = '10px';
	msgwindow.style.backgroundColor = 'white';
	msgwindow.style.fontFamily = 'Consolas';
	msgwindow.style.fontSize = '20px';
	msgwindow.style.maxWidth = 'calc(100vw - 100px)';
	msgwindow.style.borderRadius = '10px';
	msgwindow.style.boxShadow = '-7px 0px 0px #0003';
	msgwindow.style.transition = 'all 0.5s ease-out'
	msgwindow.innerHTML += `<span style="color:red">Line ${line}</span> - ${message}`;
	setTimeout(function() {
		msgwindow.style.opacity = 0;
	}, 2000)
	setTimeout(function() {
		msgwindow.remove()
	}, 2500)
	document.body.appendChild(msgwindow)
	setTimeout(function() {
		document.querySelectorAll('.msgwindow').forEach((elem) => {
			elem.style.bottom = parseInt(elem.style.bottom.replace('px','')) + 50 + 'px';
		})
	}, 10);
}