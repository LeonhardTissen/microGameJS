let camerax = 0;
let cameray = 0;
let cameratargetx = 0;
let cameratargety = 0;
let cameraeasingx = 10;
let cameraeasingy = 10;

function adjustCameraPosition() {
	if (cameratargetx !== camerax) {
		camerax += (cameratargetx - camerax) / cameraeasingx;
	}
	if (cameratargety !== cameray) {
		cameray += (cameratargety - cameray) / cameraeasingy;
	}
}

// camera set functions
function setCameraPosition(x, y) {
	cameratargetx = x;
	cameratargety = y;
}
function setCameraPositionX(x) {
	cameratargetx = x;
}
function setCameraPositionY(y) {
	cameratargety = y;
}

// camera change functions
function changeCameraPosition(x, y) {
	cameratargetx += x;
	cameratargety += y;
}
function changeCameraPositionX(x) {
	cameratargetx += x;
}
function changeCameraPositionY(y) {
	cameratargety += y;
}

// camera easing functions
function setCameraEasing(x, y) {
	if (y === undefined) {
		y = x;
	}
	cameraeasingx = x;
	cameraeasingy = y;
}