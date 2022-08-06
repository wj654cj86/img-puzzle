import { geturl, savedata, setdata, imgdata } from './dataio.js';
import number from './number.js';
import coordinate from './coordinate.js';
import image from './imagecode.js';
import language from './language/language.js';
import soundeffect from './soundeffect/soundeffect.js';

let seat = [],
	none = 0,
	len = 0,
	status = 'complete',
	ref = [],
	addr = [],
	mask = document.createElement('div');
function _reset() {
	seat = [];
	for (let i = 0; i < len; i++) {
		seat[i] = i;
	}
	none = len;
}
function setseat() {
	for (let i = 0; i < len; i++) {
		ref[i].style.left = addr[seat[i]].left;
		ref[i].style.top = addr[seat[i]].top;
	}
}
function setting() {
	window.random.onclick = () => { };
	window.reset.onclick = () => { };
	if (savedata.mod == 'number' || savedata.mod == 'coordinate') {
		preview.style.transition = 'all 0ms';
		preview.style.opacity = 0;
		preview.style.zIndex = 1;
	} else if (savedata.mod == 'hostimage' || savedata.mod == 'netimage') {
		preview.style.transition = 'all 0ms';
		preview.style.opacity = 1;
		preview.style.zIndex = 3;
		refpreview.setAttribute('viewBox', [-imgdata.maximum / 2, -imgdata.maximum / 2, imgdata.maximum, imgdata.maximum].join(' '));
		let ref = refpreview.querySelector('image');
		ref.setAttribute('x', -imgdata.width / 2);
		ref.setAttribute('y', -imgdata.height / 2);
		ref.setAttribute('width', imgdata.width);
		ref.setAttribute('height', imgdata.height);
		ref.setAttribute('xlink:href', imgdata.src);
		ref = refpreview.querySelector('rect');
		ref.setAttribute('x', -imgdata.maximum / 2);
		ref.setAttribute('y', -imgdata.maximum / 2);
		ref.setAttribute('width', imgdata.maximum);
		ref.setAttribute('height', imgdata.maximum);
	}
	mask.append(...ref);
	complete.innerHTML = '';
	status = 'complete';
	sw.reset;
	len = savedata.len * savedata.len - 1;
	let count;
	let puzzlesize = 600 / savedata.len;
	_reset();
	addr = [];
	count = 0;
	for (let i = 0; i < savedata.len; i++) {
		for (let j = 0; j < savedata.len; j++) {
			addr[count] = {
				left: puzzlesize * j + 'px',
				top: puzzlesize * i + 'px'
			};
			count++;
		}
	}

	for (let i = 0; i < len; i++) {
		if (savedata.mod == 'number') {
			main.append(number.style(i + 1));
		} else if (savedata.mod == 'coordinate') {
			main.append(coordinate.style(String.fromCharCode(Math.floor(i / savedata.len + 65)), String.fromCharCode(i % savedata.len + 65)));
		} else if (savedata.mod == 'hostimage' || savedata.mod == 'netimage') {
			main.append(image.style(savedata.len, puzzlesize, i % savedata.len, Math.floor(i / savedata.len)));
		}
	}

	main.style.setProperty('--puzzle-width', puzzlesize + 'px');
	main.style.setProperty('--puzzle-height', puzzlesize + 'px');
	main.style.setProperty('--puzzle-transition', 'all ' + savedata.delay + 'ms');
	ref = main.querySelectorAll(':scope > svg');
	for (let i = 0; i < len; i++) {
		ref[i].onmousedown = function () {
			move(i);
		};
		ref[i].ontouchstart = function () {
			move(i);
		};
	}
	setseat();
	window.random.onclick = random;
	window.reset.onclick = reset;
}
function _move(i) {
	let destination = seat[i];
	let ix = destination % savedata.len;
	let iy = Math.floor(destination / savedata.len);
	let x = none % savedata.len;
	let y = Math.floor(none / savedata.len);
	let ismove = false;
	let move = function (m) {
		while (destination != none) {
			let nnull = none + m;
			let rref = seat.indexOf(nnull);
			seat[rref] = none;
			none = nnull;
			ref[rref].style.left = addr[seat[rref]].left;
			ref[rref].style.top = addr[seat[rref]].top;
			ismove = true;
		}
	}
	if (ix == x) {
		move(Math.sign(iy - y) * savedata.len);
	} else if (iy == y) {
		move(Math.sign(ix - x) * 1);
	}
	return ismove;
}
async function random() {
	window.random.onclick = () => { };
	window.reset.onclick = () => { };
	if (savedata.mod == 'hostimage' || savedata.mod == 'netimage') {
		preview.style.transition = 'all ' + savedata.delay + 'ms';
		preview.style.opacity = 0;
		if (status == 'complete')
			await sleep(savedata.delay);
		preview.style.zIndex = 1;
	}
	complete.innerHTML = '';
	status = 'random';
	sw.reset;
	_reset();
	for (let i = 0; i < len; i++) {
		let j = Math.floor(Math.random() * len);
		let t = seat[i];
		seat[i] = seat[j];
		seat[j] = t;
	}
	let count = 0;
	for (let i = 0; i < len; i++) {
		for (let j = i + 1; j < len; j++) {
			if (seat[i] > seat[j]) {
				count++;
			}
		}
	}
	if (count % 2) {
		let t = seat[0];
		seat[0] = seat[1];
		seat[1] = t;
	}
	setseat();
	let r;
	r = Math.floor(Math.random() * savedata.len);
	if (r) {
		_move(seat.indexOf(none - r));
	}
	r = Math.floor(Math.random() * savedata.len);
	if (r) {
		_move(seat.indexOf(none - r * savedata.len));
	}
	window.random.onclick = random;
	window.reset.onclick = reset;
}
async function reset() {
	if (status == 'complete') {
		complete.innerHTML = '';
		return;
	}
	window.random.onclick = () => { };
	window.reset.onclick = () => { };
	complete.innerHTML = '';
	status = 'complete';
	sw.reset;
	_reset();
	setseat();
	if (savedata.mod == 'hostimage' || savedata.mod == 'netimage') {
		await sleep(savedata.delay);
		preview.style.opacity = 1;
		preview.style.zIndex = 3;
		await sleep(savedata.delay);
	}
	window.random.onclick = random;
	window.reset.onclick = reset;
}
async function move(i) {
	if (status == 'complete')
		return;
	sw.start;
	soundeffect.play(_move(i));
	let iscomplete = function () {
		for (let i = 0; i < len; i++) {
			if (seat[i] != i)
				return false;
		}
		return true;
	}
	if (iscomplete()) {
		window.random.onclick = () => { };
		window.reset.onclick = () => { };
		complete.innerHTML = language.reg[savedata.lang].complete;
		status = 'complete';
		sw.stop;
		if (savedata.mod == 'hostimage' || savedata.mod == 'netimage') {
			preview.style.opacity = 1;
			preview.style.zIndex = 3;
			await sleep(savedata.delay);
		}
		window.random.onclick = random;
		window.reset.onclick = reset;
	}
}
function keymove(d) {
	if (status == 'complete')
		return;
	let x = none % savedata.len;
	let y = Math.floor(none / savedata.len);
	if (x + d.x < 0 || y + d.y < 0 || x + d.x >= savedata.len || y + d.y >= savedata.len) {
		soundeffect.play(false);
		return;
	}
	move(seat.indexOf(x + d.x + (y + d.y) * savedata.len));
}
export default {
	setting,
	random,
	reset,
	move,
	keymove
};
