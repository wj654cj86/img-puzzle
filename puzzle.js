var puzzle = (() => {
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
		if (savedata.mod == 'number' || savedata.mod == 'coordinate') {
			preview.style.transition = 'all 0ms';
			preview.style.opacity = 0;
			preview.style.zIndex = 1;
		} else if (savedata.mod == 'hostimage' || savedata.mod == 'netimage') {
			preview.style.transition = 'all 0ms';
			preview.style.opacity = 1;
			preview.style.zIndex = 3;
			refpreview.setAttribute('viewBox', [-imgdata.maximum / 2, -imgdata.maximum / 2, imgdata.maximum, imgdata.maximum].join(' '));
			let ref = refpreview.getElementsByTagName('image')[0];
			ref.setAttribute('x', -imgdata.width / 2);
			ref.setAttribute('y', -imgdata.height / 2);
			ref.setAttribute('width', imgdata.width);
			ref.setAttribute('height', imgdata.height);
			ref.setAttribute('xlink:href', imgdata.src);
			ref = refpreview.getElementsByTagName('rect')[0];
			ref.setAttribute('x', -imgdata.maximum / 2);
			ref.setAttribute('y', -imgdata.maximum / 2);
			ref.setAttribute('width', imgdata.maximum);
			ref.setAttribute('height', imgdata.maximum);
		}
		mask.append(...main.getElementsByTagName('svg'));
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
		let puzzletagarr = main.getElementsByTagName('svg');
		ref = [];
		for (let i = 0; i < len; i++) {
			ref[i] = puzzletagarr[i];
			ref[i].onmousedown = function () {
				move(i);
			};
			ref[i].ontouchstart = function () {
				move(i);
			};
		}
		setseat();
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
		if (savedata.mod == 'hostimage' || savedata.mod == 'netimage') {
			random.onclick = function () { };
			reset.onclick = function () { };
			preview.style.transition = 'all ' + savedata.delay + 'ms';
			preview.style.opacity = 0;
			preview.style.zIndex = 1;
			if (status == 'complete')
				await sleep(savedata.delay);
			random.onclick = random;
			reset.onclick = reset;
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
	}
	async function reset() {
		complete.innerHTML = '';
		status = 'complete';
		sw.reset;
		_reset();
		setseat();
		if (savedata.mod == 'hostimage' || savedata.mod == 'netimage') {
			random.onclick = function () { };
			reset.onclick = function () { };
			await sleep(savedata.delay);
			random.onclick = random;
			reset.onclick = reset;
			preview.style.opacity = 1;
			preview.style.zIndex = 3;
		}
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
			complete.innerHTML = language.reg[setdata.lang].complete;
			status = 'complete';
			sw.stop;
			if (savedata.mod == 'hostimage' || savedata.mod == 'netimage') {
				random.onclick = function () { };
				reset.onclick = function () { };
				await sleep(savedata.delay);
				random.onclick = random;
				reset.onclick = reset;
				preview.style.opacity = 1;
				preview.style.zIndex = 3;
			}
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
	return {
		setting: setting,
		random: random,
		reset: reset,
		move: move,
		keymove: keymove
	};
})();
