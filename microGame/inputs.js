let keys_held = new Set();
let keys_pressed = new Set();

// event functions
function keyDown() {
	if (event.repeat) return;
	keys_held.add(event.key);
	keys_pressed.add(event.key);
}
function keyUp() {
	keys_held.delete(event.key);
}

// memory functions
function keyPress(type) {
	return keys_pressed.has(type);
}

function keyHeld(type) {
	return keys_held.has(type);
}