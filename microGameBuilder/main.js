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
document.body.onmousemove = function() {
	const x = 2 - event.clientX / window.innerWidth;
	const y = 2 - event.clientY / window.innerHeight;
	document.querySelector('#robot .face').style.transform = `translateX(${15-x*15}px)`;
	document.querySelector('#robot .screen').style.transform = `translateY(${15-y*15}px)`;
	if (event.clientY > window.innerHeight / 2 - 190 && event.clientY < window.innerHeight / 2 + 190) {
		if (event.clientX <= 0) {
			document.getElementById('leftsidebar').classList.remove('hidden')
		} else if (event.clientX > 320) {
			document.getElementById('leftsidebar').classList.add('hidden')
		}
	} else {
		document.getElementById('leftsidebar').classList.add('hidden')
	}
}

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
	} else if (event.key === 'o' && event.ctrlKey) {
		loadCode(prompt('Enter URL'))
	} else if (event.key === 'Tab') { //tab was pressed
        var newCaretPosition;
        newCaretPosition = inputcode.getCaretPosition() + "	".length;
        inputcode.value = inputcode.value.substring(0, inputcode.getCaretPosition()) + "	" + inputcode.value.substring(inputcode.getCaretPosition(), inputcode.value.length);
        inputcode.setCaretPosition(newCaretPosition);
        updateCode();
        return false;
    }
}

function runCode() {
	console.clear()
	saveCode();
	document.body.classList.remove('codeblocksopened');
	gamewindow.innerHTML = `
	<iframe width="100" height="100" src="emulation.html">
	</iframe>
	<div class="microGameLogo"><div class="verticalSegment clampRight"><div class="horizontalSegment clampLeftHarder clampOffsetTop"><div class="verticalSegment clampRightHarder"><div class="horizontalSegment clampLeftHarder clampOffsetTop"></div></div></div></div><div class="horizontalSegment clampLeft"><div class="verticalSegment clampRightHarder clampOffsetRight"><div class="horizontalSegment clampLeftHarder"><div class="verticalSegment clampRightHarder clampOffsetRight"></div></div></div></div></div>`
	iframe = document.querySelector('#gamewindow iframe')
	loading = document.querySelector('#gamewindow .microGameLogo');
	iframe.onload = function() {
		setTimeout(function() {
			loading.remove();
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
		}, 300)
	};
};

function loadCode(url) {
	if (!url) return;
	fetch(url).then((response) => {
		response.text().then((text) => {
			if (text.startsWith('CANNOT') || text.startsWith('<')) {
				alert("Invalid URL");
				return;
			}
			inputcode.value = text;
			updateCode();
			runCode();
		})
	})
}

function scrollCode() {
	outputcode.scrollLeft = inputcode.scrollLeft;
	outputcode.scrollTop = inputcode.scrollTop;
	fixScroll();
}

function fixScroll() {
	inputcode.scrollTop = Math.min(inputcode.scrollTop, outputcode.scrollTop);
	inputcode.scrollLeft = Math.min(inputcode.scrollLeft, outputcode.scrollLeft);
}

function saveCode() {
	window.localStorage.setItem('microGameSavedCode', inputcode.value);
} 
function loadCodeFromStorage() {
	if (window.localStorage.getItem('microGameSavedCode') !== null) {
		inputcode.value = window.localStorage.getItem('microGameSavedCode');
	}
	updateCode();
	runCode();
}

function updateCode() {
	outputcode.classList.remove('prettyprinted')
	outputcode.innerHTML = inputcode.value;
	PR.prettyPrint();
	fixScroll();
}
loadCodeFromStorage();

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

function start() {
	
}

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
		alert("No draw function found, please create a microgame window.")
		return;
	}
	inputcode.value = v.substr(0, pos + 8) + code + v.substr(pos + 8, v.length)
	updateCode();
}

function insideStartCode(code) {
	const v = inputcode.value;
	const pos = v.indexOf('start() {');
	if (pos === -1) {
		alert("No start function found, please create a microgame window.")
		return;
	}
	inputcode.value = v.substr(0, pos + 9) + code + v.substr(pos + 9, v.length)
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

function openMenu(type) {
	const floatingwindow = document.getElementById('floatingwindow');
	floatingwindow.style.display = 'block';
	setTimeout(function() {
		floatingwindow.style.opacity = 1;
	}, 1)
	const floatingwindowcontents = document.getElementById('floatingwindowcontents');
	floatingwindowcontents.innerHTML = '';
	const floatingwindowtitle = document.getElementById('floatingwindowtitle');
	floatingwindowtitle.innerText = type;

	switch (type) {
		case "Colors":
			const keys = Object.keys(codecolors['Default']);
			keys.forEach((key) => {
				const color = getComputedStyle(document.body).getPropertyValue('--' + key);
				const colorpicker = document.createElement('input')
				colorpicker.type = 'color';
				colorpicker.value = color;
				floatingwindowcontents.innerHTML += `<div class="colorslot">
					<input type="color" id="codecolor${key}" value="${color}" oninput="
					setCodeColor('${key}', this.value)
					">
					<span class="inputspan">${key}</span>
				</div>`
			});
			floatingwindowcontents.innerHTML += `<h1 class="presetstitle">Presets</h1>`
			const presets = Object.keys(codecolors);
			presets.forEach((preset) => {
				const presetbutton = document.createElement('button');
				presetbutton.innerText = preset;
				presetbutton.classList.add('presetbutton');
				presetbutton.onclick = function() {
					importCodeColors(preset);
				}
				const colors = Object.keys(codecolors[preset]);
				var i = 0;
				colors.forEach((color) => {
					colorcircle = document.createElement('div');
					colorcircle.style.backgroundColor = codecolors[preset][color];
					colorcircle.style.right = i + '%';
					i += 3;
					colorcircle.classList.add('colorcircle');
					presetbutton.appendChild(colorcircle);
				})
				floatingwindowcontents.appendChild(presetbutton);
			});
			updateCodeColors()
			break;
	}
}

function closeMenu() {
	const floatingwindow = document.getElementById('floatingwindow');
	floatingwindow.style.opacity = 0;
	setTimeout(function() {
		floatingwindow.style.display = 'none';
	}, 200);
};