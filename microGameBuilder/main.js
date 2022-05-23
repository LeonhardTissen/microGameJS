const inputcode = document.getElementById('inputcode');
const outputcode = document.getElementById('outputcode');
const gamewindow = document.getElementById('gamewindow');
let code;
let iframe;
inputcode.oninput = updateCode;
inputcode.onscroll = scrollCode;
document.body.onkeydown = keyDown;
inputcode.oncontextmenu = contextMenu;
inputcode.onclick = closeContextMenus;

HTMLTextAreaElement.prototype.getCaretPosition = function () { //return the caret position of the textarea
    return this.selectionStart;
};
HTMLTextAreaElement.prototype.setCaretPosition = function (position) { //change the caret position of the textarea
    this.selectionStart = position;
    this.selectionEnd = position;
    this.focus();
};

function keyDown() {
	if (event.key === 's' && event.ctrlKey) {
		event.preventDefault();
		runCode();
	}
	if (event.key === 'Tab') { //tab was pressed
        var newCaretPosition;
        newCaretPosition = inputcode.getCaretPosition() + "	".length;
        inputcode.value = inputcode.value.substring(0, inputcode.getCaretPosition()) + "	" + inputcode.value.substring(inputcode.getCaretPosition(), inputcode.value.length);
        inputcode.setCaretPosition(newCaretPosition);
        updateCode();
        return false;
    }
}

function runCode() {
	gamewindow.innerHTML = `<iframe width="100" height="100" src="emulation.html"></iframe>`
	iframe = document.querySelector('#gamewindow iframe')
	iframe.onload = function() {
		const script = document.createElement('script');
		const sourcecode = inputcode.value.replaceAll('&lt;','<').replaceAll('&gt;','>');
		const lines = sourcecode.split('\n');
		var trimmedcode = '';
		lines.forEach((line) => {
			if (!line.startsWith('//')) {
				trimmedcode += line.replaceAll('<br>','') + "\n";
			}
		});
		script.innerHTML = trimmedcode;
		iframe.contentDocument.body.appendChild(script);
	}
}
runCode();

function scrollCode() {
	outputcode.scrollLeft = inputcode.scrollLeft;
	outputcode.scrollTop = inputcode.scrollTop;
	fixScroll();
}

function fixScroll() {
	inputcode.scrollTop = Math.min(inputcode.scrollTop, outputcode.scrollTop);
	inputcode.scrollLeft = Math.min(inputcode.scrollLeft, outputcode.scrollLeft);
}

function updateCode() {
	outputcode.classList.remove('prettyprinted')
	outputcode.innerHTML = inputcode.value;
	PR.prettyPrint();
	fixScroll();
}
updateCode();

const contextMenuItems = [
	{
		name: "Create MicroGame Window",
		action: function() {
			closeContextMenus();
			appendCode(
`// Creation of the game window
microGame({
	width: 1000,
	height: 700,
	noscaling: true,
	pixelated: false,
	bodybackground: '#4D97FF',
	gamebackground: '#FFFFFF',
	debug: true
})

function draw() {

}
`)
		}
	},
	{
		name: "Create Image Object",
		action: function() {
			closeContextMenus();
			appendCode(
`loadImage('Player', 'microGame/assets/redblockeyes.png')

// Playable character
const player = new GameElement({
	name: "Player",
	type: "Image",
	src: "Player",
	x: 500,
	y: 600,
	bounciness: 0,
	friction: 1,
	width: 100,
	height: 100,
	physics: true,
	collidewalls: true,
	gravityy: 0.15
})
`)
		}
	},
	{
		name: "Create Player Controller",
		action: function() {
			closeContextMenus();
			insideDrawCode(
`
    // Set the y velocity when pressing up
    if (keyPress('ArrowUp')) {
        player.yvel = -10;
    }
    // Change the x velocity when holding left or right
    if (keyHeld('ArrowRight')) {
        player.xvel += 0.2;
    }
    if (keyHeld('ArrowLeft')) {
        player.xvel -= 0.2;
    }`)
		}
	}
];

function prependCode(code) {
	inputcode.value = code + inputcode.value;
	updateCode();
}

function appendCode(code) {
	inputcode.value += code;
	updateCode();
}

function insideDrawCode(code) {
	const v = inputcode.value;
	const pos = v.indexOf('draw() {');
	if (pos === -1) {
		alert("No draw function found, please create a game window.")
		return;
	}
	inputcode.value = v.substr(0, pos + 8) + code + v.substr(pos + 8, v.length)
	updateCode();
}

function closeContextMenus() {
	document.querySelectorAll('.contextMenu').forEach(elem => elem.remove())
}

function contextMenu() {
	event.preventDefault();

	closeContextMenus()

	const contextMenu = document.createElement('div');
	contextMenu.classList.add('contextMenu');
	contextMenu.style.top = event.clientY + "px";
	contextMenu.style.left = event.clientX + "px";

	contextMenuItems.forEach((item) => {
		const button = document.createElement('button');
		button.onclick = item.action;
		button.innerText = item.name;
		button.classList.add('contextMenuItem');
		contextMenu.appendChild(button);
	})
	document.body.appendChild(contextMenu);
}