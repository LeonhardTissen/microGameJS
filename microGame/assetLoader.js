let totalAssets = 0;
let unloadedAssets = 0;

let sounds = {};
function loadSound(name, path) {
	unloadedAssets ++;
	totalAssets ++;
	const newSound = new Audio();
	newSound.id = name;
	sounds[name] = newSound;
	newSound.onpause = function() {
		newSound.volume = 1;
		unloadedAssets --;
		this.onpause = function() {}
	}
	newSound.src = path;
	newSound.volume = 0;
	newSound.play()
}
function playSound(name) {
	if (sounds[name].currentTime !== 0) {
		sounds[name].currentTime = 0;
	}
	sounds[name].play();
}

let images = {};
function loadImage(name, path) {
	unloadedAssets ++;
	totalAssets ++;
	const newImage = new Image();
	newImage.id = name;
	newImage.onload = function() {
		unloadedAssets --;
	}
	images[name] = newImage;
	newImage.src = path;
}