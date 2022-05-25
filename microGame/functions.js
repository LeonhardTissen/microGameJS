window.onerror = function(message, url, lineNumber) {
	log(message, lineNumber)
}

function randomColor() {
	return '#' + (Math.floor(Math.random() * 2 ** 24)).toString(16).padStart(0, 6)
}

function randomNumberBetween(start, end) {
	return Math.ceil(Math.random() * (start - end - 1) + end);
}
randomNum = randomNumberBetween;

function setGameBackground(bg) {
	cvs.style.background = bg;
}

function setBodyBackground(bg) {
	document.body.style.background = bg;
}

function delay(time) {
	return new Promise(resolve => setTimeout(resolve, time));
}

let tick_counter = {}
function everyNthTick(n) {
	if (tick_counter[n] === undefined) {
		tick_counter[n] = 0;
	}
	if (time > tick_counter[n] + n) {
		tick_counter[n] = time;
		return true;
	}
	return false;
}

function restart() {
	objects = [];
	clickable_objects = [];
	tick_counter = {};
	time = 0;
	start();
}