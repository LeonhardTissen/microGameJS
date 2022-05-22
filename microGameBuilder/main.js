const inputcode = document.getElementById('inputcode');
const outputcode = document.getElementById('outputcode');
const gamewindow = document.getElementById('gamewindow');
let code;
let iframe;
inputcode.oninput = updateCode;
inputcode.onscroll = scrollCode;
inputcode.onkeydown = saveCode;

function saveCode() {
	if (event.key === "s") {
		if (event.ctrlKey) {
			event.preventDefault();
			runCode();
		}
	}
}

function runCode() {
	gamewindow.innerHTML = `<iframe width="100" height="100" src="emulation.html"></iframe>`
	iframe = document.querySelector('#gamewindow iframe')
	iframe.onload = function() {
		const script = document.createElement('script');
		const sourcecode = inputcode.innerHTML.replaceAll('&lt;','<').replaceAll('&gt;','>');
		const lines = sourcecode.split("\n");
		var trimmedcode = ""
		lines.forEach((line) => {
			if (!line.startsWith('//') && !line.includes('<br>')) {
				trimmedcode += line + "\n";
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
	outputcode.innerHTML = inputcode.innerHTML;
	PR.prettyPrint();
	fixScroll();
}
updateCode();