import { geturl, savedata, setdata, imgdata } from './dataio.js';
import number from './number.js';
import coordinate from './coordinate.js';
import image from './imagecode.js';
import language from './language.js';
import Stopwatch from './stopwatch.js';
import soundeffect from './soundeffect.js';
import puzzle from './puzzle.js';

let direction = {
	'ArrowLeft': { x: 1, y: 0 },
	'ArrowUp': { x: 0, y: 1 },
	'ArrowRight': { x: -1, y: 0 },
	'ArrowDown': { x: 0, y: -1 }
};

function nowmodonchange() {
	let callback = (a, b, c) => {
		spanhostimage.style.zIndex = a;
		hostfile.style.opacity = b;
		hostfile.style.zIndex = b;
		spannetimage.style.opacity = c;
		spannetimage.style.zIndex = c;
		netfile.style.opacity = c;
		netfile.style.zIndex = c;
	};
	switch (nowmod.value) {
		case 'number':
			callback(1, 0, 0);
			break;
		case 'coordinate':
			callback(1, 0, 0);
			break;
		case 'hostimage':
			callback(0, 1, 0);
			break;
		case 'netimage':
			callback(0, 0, 1);
			break;
		default:
			callback(1, 0, 0);
			break;
	}
};

preview.setAttribute('viewBox', '0 0 600 600');
let ref = preview.querySelector('use');
ref.setAttribute('width', 600);
ref.setAttribute('height', 600);
main.ondragstart = () => {
	return false;
};

setting.onclick = () => {
	nowlanguage.value = savedata.lang;
	nowmod.value = savedata.mod; nowmodonchange();
	setdata.len = savedata.len;
	setdata.delay = savedata.delay
	nowsoundeffect.checked = savedata.soundeffect;
	netfile.value = savedata.imgsrc;
	settingfoundation.style.zIndex = 10;
};
full.onclick = () => {
	let de = window.parent.document.documentElement;
	if (de.requestFullscreen) {
		de.requestFullscreen();
	} else if (de.mozRequestFullScreen) { /* Firefox */
		de.mozRequestFullScreen();
	} else if (de.webkitRequestFullscreen) { /*Edge, Chrome, Safari & Opera */
		de.webkitRequestFullscreen();
	}
};

settingfoundation.onclick = (e) => {
	if (e.target.id != 'determine')
		imageerror.innerHTML = '';
};
nowlanguage.onchange = async () => {
	setdata.lang = nowlanguage.value;
};
subsize.onclick = () => {
	if (setdata.len > 3) {
		setdata.len--;
	}
};
addsize.onclick = () => {
	if (setdata.len < 10) {
		setdata.len++;
	}
};
subdelay.onclick = () => {
	if (setdata.delay > 0) {
		setdata.delay -= 100;
	}
};
adddelay.onclick = () => {
	if (setdata.delay < 1000) {
		setdata.delay *= 1;
		setdata.delay += 100;
	}
};
nowmod.onchange = nowmodonchange;
determine.onclick = async () => {
	try {
		switch (nowmod.value) {
			case 'hostimage':
				let url = blob2url(hostfile.files[0])
				await imgdata.checkandsetdata(url);
				savedata.hostimg = await png2base64(url);
				break;
			case 'netimage':
				await imgdata.checkandsetdata(netfile.value);
				savedata.imgsrc = imgdata.src;
				break;
			default:
				break;
		}
		savedata.lang = setdata.lang;
		savedata.mod = nowmod.value;
		savedata.len = setdata.len;
		savedata.delay = setdata.delay;
		savedata.soundeffect = nowsoundeffect.checked;
		puzzle.setting();
		settingfoundation.style.zIndex = 0;
	} catch (err) {
		imageerror.innerHTML = language.reg[setdata.lang][nowmod.value + 'error'];
	}
};
cancel.onclick = async () => {
	setdata.lang = savedata.lang;
	settingfoundation.style.zIndex = 0;
};

window.sw = new Stopwatch(stopwatch);
await language.initial(nowlanguage);
setdata.lang = savedata.lang;

try {
	switch (savedata.mod) {
		case 'hostimage':
			await imgdata.checkandsetdata(savedata.hostimg);
			break;
		case 'netimage':
			await imgdata.checkandsetdata(savedata.imgsrc);
			break;
		default:
			break;
	}
} catch (err) {
	savedata.mod = 'number';
}
puzzle.setting();
document.body.style.opacity = 1;
window.parent.document.body.style.opacity = 1;
if (geturl.random == 'true') {
	await sleep(1000);
	puzzle.random();
}

window.onkeydown = (e) => {
	let key = e.code;
	if (key == 'Enter')
		puzzle.random();
	if (key == 'Escape')
		puzzle.reset();
	if (key in direction) {
		puzzle.keymove(direction[key]);
	}
};
