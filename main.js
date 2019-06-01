var mod;
var nowstatus = 'complete';
var len;
var setlen;
var delay;
var setdelay;
var sw;
var puzzle;
var nownull;
var puzzletag;
var puzzleseat;
var imgsrc;
var imgw;
var imgh;
var imgm;
var imgx;
var imgy;
var direction = [
	[1, 0],
	[0, 1],
	[-1, 0],
	[0, -1]
];
var keydirection = [
	37, 38, 39, 40
];

function setfoundation() {
	let fm = Math.min(window.innerWidth / 600, window.innerHeight / 800, 1.5);
	fm = Math.max(fm, 0.25);
	settingfoundation.style.transform = foundation.style.transform = 'scale(' + fm + ',' + fm + ')';
}
function setpuzzleimgwh(width, height) {
	imgw = width;
	imgh = height;
	imgm = Math.max(imgw, imgh);
	imgw = Math.floor(imgw * 600 / imgm);
	imgh = Math.floor(imgh * 600 / imgm);
	imgm = 600;
	imgx = Math.floor((imgm - imgw) / 2);
	imgy = Math.floor((imgm - imgh) / 2);
}
window.onload = function () {
	document.body.onresize = setfoundation;
	preview.ondragstart = function () {
		return false;
	};
	let nowtypeonchange = function () {
		let callback = function (a, b, c) {
			spantype.style.zIndex = a;
			filein.style.opacity = b;
			filein.style.zIndex = b;
			spannetfile.style.opacity = c;
			spannetfile.style.zIndex = c;
			netfile.style.opacity = c;
			netfile.style.zIndex = c;
		};
		switch (nowtype.value) {
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
				break;
		}
	};
	setting.onclick = function () {
		setlen = len;
		nowsize.innerHTML = setlen * setlen - 1 + '個 (' + setlen + ' X ' + setlen + ')';
		setdelay = delay;
		nowdelay.innerHTML = setdelay + '毫秒';
		nowtype.value = mod;
		nowtypeonchange();
		settingfoundation.style.zIndex = 10;
	};
	random.onclick = randompuzzle;
	reset.onclick = resetpuzzle;
	subsize.onclick = function () {
		if (setlen > 3) {
			setlen--;
			nowsize.innerHTML = setlen * setlen - 1 + '個 (' + setlen + ' X ' + setlen + ')';
		}
	};
	addsize.onclick = function () {
		if (setlen < 10) {
			setlen++;
			nowsize.innerHTML = setlen * setlen - 1 + '個 (' + setlen + ' X ' + setlen + ')';
		}
	};
	subdelay.onclick = function () {
		if (setdelay > 0) {
			setdelay -= 100;
			nowdelay.innerHTML = setdelay + '毫秒';
		}
	};
	adddelay.onclick = function () {
		if (setdelay < 1000) {
			setdelay *= 1;
			setdelay += 100;
			nowdelay.innerHTML = setdelay + '毫秒';
		}
	};

	nowtype.onchange = nowtypeonchange;
	setdetermine.onclick = function () {
		generator(function* () {
			let data = {}, url;
			switch (nowtype.value) {
				case 'number':
					len = setlen;
					delay = setdelay;
					mod = nowtype.value;
					setCookie('mod', mod);
					setCookie('len', len);
					setCookie('delay', delay);
					setpuzzle();
					settingfoundation.style.zIndex = 0;
					break;
				case 'coordinate':
					len = setlen;
					delay = setdelay;
					mod = nowtype.value;
					setCookie('mod', mod);
					setCookie('len', len);
					setCookie('delay', delay);
					setpuzzle();
					settingfoundation.style.zIndex = 0;
					break;
				case 'hostimage':
					try {
						url = URL.createObjectURL(filein.files[0]);
						yield {
							nextfunc: getimgwh,
							argsfront: [url],
							cbfunc: function (width, height) {
								data.width = width;
								data.height = height;
							}
						};

						if (data.width == -1 || data.height == -1) {
							settingfoundation.style.zIndex = 0;
							break;
						}

						len = setlen;
						delay = setdelay;
						imgsrc = url;
						mod = nowtype.value;
						setCookie('len', len);
						setCookie('delay', delay);

						setpuzzleimgwh(data.width, data.height);
						setpuzzle();

						settingfoundation.style.zIndex = 0;
					} catch (err) {
						settingfoundation.style.zIndex = 0;
					}
					break;
				case 'netimage':
					yield {
						nextfunc: getimgwh,
						argsfront: [netfile.value],
						cbfunc: function (width, height) {
							data.width = width;
							data.height = height;
						}
					};
					if (data.width == -1 || data.height == -1) {
						settingfoundation.style.zIndex = 0;
						break;
					}

					len = setlen;
					delay = setdelay;
					imgsrc = netfile.value;
					mod = nowtype.value;
					setCookie('mod', mod);
					setCookie('imgsrc', imgsrc);
					setCookie('len', len);
					setCookie('delay', delay);

					setpuzzleimgwh(data.width, data.height);
					setpuzzle();

					settingfoundation.style.zIndex = 0;
					break;
				default:
					break;
			}
		});
	};
	setcancel.onclick = function () {
		settingfoundation.style.zIndex = 0;
	};

	full.onclick = function () {
		if (document.documentElement.requestFullscreen) {
			document.documentElement.requestFullscreen();
		} else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
			document.documentElement.mozRequestFullScreen();
		} else if (document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
			document.documentElement.webkitRequestFullscreen();
		} else if (document.documentElement.msRequestFullscreen) { /* IE/Edge */
			document.documentElement.msRequestFullscreen();
		}
	};
	sw = new Stopwatch(stopwatch);
	setfoundation();
	let l = getCookie('len');
	if (l != '' && !isNaN(l) && l >= 3 && l <= 10) {
		len = l;
	} else {
		len = 4;
		setCookie('len', len);
	}
	let d = getCookie('delay');
	if (d != '' && !isNaN(d) && d >= 0 && d <= 1000) {
		delay = d;
	} else {
		delay = 0;
		setCookie('delay', delay);
	}
	let m = getCookie('mod');
	let is = getCookie('imgsrc');
	let numberload = function () {
		mod = 'number';
		setCookie('mod', mod);
		setpuzzle();
	};
	generator(function* () {
		yield {
			nextfunc: numberxmlinitial,
			cbfunc: function () { }
		};
		yield {
			nextfunc: coordinatexmlinitial,
			cbfunc: function () { }
		};
		let data = {};
		switch (m) {
			case 'number':
				numberload();
				break;
			case 'coordinate':
				mod = m;
				setpuzzle();
				break;
			case 'hostimage':
				numberload();
				break;
			case 'netimage':
				if (is != '') {
					yield {
						nextfunc: getimgwh,
						argsfront: [is],
						cbfunc: function (width, height) {
							data.width = width;
							data.height = height;
						}
					};
					if (data.width == -1 || data.height == -1) {
						numberload();
						break;
					}

					setpuzzleimgwh(data.width, data.height);

					mod = m;
					netfile.value = imgsrc = is;
					setpuzzle();
				} else {
					numberload();
				}
				break;
			default:
				numberload();
				break;
		}
	});
};
window.onkeydown = function () {
	key = event.keyCode;
	if (key == 13)
		randompuzzle();
	if (keydirection.indexOf(key) != -1) {
		let d = direction[keydirection.indexOf(key)];
		let x = nownull % len;
		let y = Math.floor(nownull / len);
		if (x + d[0] < 0 || y + d[1] < 0 || x + d[0] >= len || y + d[1] >= len)
			return;
		puzzlemove(puzzle.indexOf(x + d[0] + (y + d[1]) * len));
	}
};

function setpuzzle() {
	if (mod == 'number' || mod == 'coordinate') {
		allpreview.style.opacity = 0;
		allpreview.style.zIndex = 1;
	} else if (mod == 'hostimage' || mod == 'netimage') {
		preview.style.left = imgx + 'px';
		preview.style.top = imgy + 'px';
		preview.style.width = imgw + 'px';
		preview.style.height = imgh + 'px';
		preview.src = imgsrc;
		allpreview.style.opacity = 1;
		allpreview.style.zIndex = 3;
		allpreview.style.transition = 'all ' + delay + 'ms';
	}
	main.innerHTML = '';
	complete.innerHTML = '';
	nowstatus = 'complete';
	sw.reset;
	let ss = '';
	puzzlelen = len * len - 1;
	let count;
	let puzzlesize = 600 / len;
	puzzle = [];
	for (let i = 0; i < puzzlelen; i++) {
		if (mod == 'number' || mod == 'coordinate') {
			ss += '<div><img /></div>';
		} else if (mod == 'hostimage' || mod == 'netimage') {
			ss += '<div><img /><span></span></div>';
		}
		puzzle[i] = i;
	}
	main.innerHTML += ss;
	nownull = puzzlelen;
	puzzleseat = [];
	count = 0;
	for (let i = 0; i < len; i++) {
		for (let j = 0; j < len; j++) {
			puzzleseat[count] = {
				left: puzzlesize * j + 'px',
				top: puzzlesize * i + 'px'
			};
			count++;
		}
	}
	let puzzletagarr = main.getElementsByTagName('div');
	puzzletag = [];
	for (let i = 0; i < puzzlelen; i++) {
		puzzletag[i] = puzzletagarr[i];
		puzzletag[i].style.left = puzzleseat[i].left;
		puzzletag[i].style.top = puzzleseat[i].top;
		puzzletag[i].style.width = puzzlesize + 'px';
		puzzletag[i].style.height = puzzlesize + 'px';
		puzzletag[i].style.transition = 'all ' + delay + 'ms';
		if (mod == 'number') {
			let ref = puzzletag[i].getElementsByTagName('img')[0];
			ref.style.width = puzzlesize + 'px';
			ref.style.height = puzzlesize + 'px';
			ref.src = numberstyle(i + 1);
		} else if (mod == 'coordinate') {
			let ref = puzzletag[i].getElementsByTagName('img')[0];
			ref.style.width = puzzlesize + 'px';
			ref.style.height = puzzlesize + 'px';
			ref.src = coordinatestyle(String.fromCharCode(Math.floor(i / len + 65)), String.fromCharCode(i % len + 65));
		} else if (mod == 'hostimage' || mod == 'netimage') {
			let ref = puzzletag[i].getElementsByTagName('img')[0];
			ref.style.left = imgx - puzzleseat[i].left.replace('px', '') + 'px';
			ref.style.top = imgy - puzzleseat[i].top.replace('px', '') + 'px';
			ref.style.width = imgw + 'px';
			ref.style.height = imgh + 'px';
			ref.src = imgsrc;
			ref = puzzletag[i].getElementsByTagName('span')[0];
			ref.style.width = puzzlesize - 4 + 'px';
			ref.style.height = puzzlesize - 4 + 'px';
		}
		puzzletag[i].onmousedown = function () {
			puzzlemove(i);
		};
		puzzletag[i].ontouchstart = function () {
			puzzlemove(i);
		};
		let ref = puzzletag[i].getElementsByTagName('img')[0];
		ref.ondragstart = function () {
			return false;
		};
	}
}

function _puzzlemove(i) {
	let destination = puzzle[i];
	let ix = destination % len;
	let iy = Math.floor(destination / len);
	let x = nownull % len;
	let y = Math.floor(nownull / len);
	let move = function (m) {
		while (destination != nownull) {
			let nnull = nownull + m;
			let ref = puzzle.indexOf(nnull);
			puzzle[ref] = nownull;
			nownull = nnull;
			puzzletag[ref].style.top = puzzleseat[puzzle[ref]].top;
			puzzletag[ref].style.left = puzzleseat[puzzle[ref]].left;
		}
	}
	if (ix == x) {
		move(Math.sign(iy - y) * len);
	} else if (iy == y) {
		move(Math.sign(ix - x) * 1);
	}
}

function randompuzzle() {
	resetpuzzle();
	complete.innerHTML = '';
	nowstatus = 'random';
	sw.reset;
	Math.floor(Math.random() * 4);
	for (let i = 0; i < puzzlelen; i++) {
		let j = Math.floor(Math.random() * puzzlelen);
		let t = puzzle[i];
		puzzle[i] = puzzle[j];
		puzzle[j] = t;
	}
	let count = 0;
	for (let i = 0; i < puzzlelen; i++) {
		for (let j = i + 1; j < puzzlelen; j++) {
			if (puzzle[i] > puzzle[j]) {
				count++;
			}
		}
	}
	if (count % 2) {
		let t = puzzle[0];
		puzzle[0] = puzzle[1];
		puzzle[1] = t;
	}
	if (mod == 'hostimage' || mod == 'netimage') {
		allpreview.style.opacity = 0;
		allpreview.style.zIndex = 1;
	}
	for (let i = 0; i < puzzlelen; i++) {
		puzzletag[i].style.top = puzzleseat[puzzle[i]].top;
		puzzletag[i].style.left = puzzleseat[puzzle[i]].left;
	}
	let r;
	r = Math.floor(Math.random() * len);
	if (r) {
		_puzzlemove(puzzle.indexOf(nownull - r));
	}
	r = Math.floor(Math.random() * len);
	if (r) {
		_puzzlemove(puzzle.indexOf(nownull - r * len));
	}
}

function resetpuzzle() {
	if (mod == 'hostimage' || mod == 'netimage') {
		allpreview.style.opacity = 1;
		allpreview.style.zIndex = 3;
	}
	complete.innerHTML = '';
	nowstatus = 'complete';
	sw.reset;
	for (let i = 0; i < puzzlelen; i++) {
		puzzle[i] = i;
	}
	nownull = puzzlelen;
	for (let i = 0; i < puzzlelen; i++) {
		puzzletag[i].style.top = puzzleseat[puzzle[i]].top;
		puzzletag[i].style.left = puzzleseat[puzzle[i]].left;
	}
}

function puzzlemove(i) {
	if (nowstatus == 'complete')
		return;
	sw.start;
	_puzzlemove(i);
	let iscomplete = function () {
		for (let i = 0; i < puzzlelen; i++) {
			if (puzzle[i] != i)
				return false;
		}
		return true;
	}
	if (iscomplete()) {
		complete.innerHTML = '完成！';
		nowstatus = 'complete';
		sw.stop;
		if (mod == 'hostimage' || mod == 'netimage') {
			allpreview.style.opacity = 1;
			allpreview.style.zIndex = 3;
		}
	}
}