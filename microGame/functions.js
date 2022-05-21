function randomColor() {
	return '#' + (Math.floor(Math.random() * 2 ** 24)).toString(16).padStart(0, 6)
}

function randomNumberBetween(start, end) {
	return Math.ceil(Math.random() * (start - end - 1) + end);
}

function setGameBackground(bg) {
	cvs.style.background = bg;
}

function setBodyBackground(bg) {
	document.body.style.background = bg;
}