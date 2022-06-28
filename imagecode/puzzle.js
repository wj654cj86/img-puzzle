var image = (() => {
	let str = {},
		reg = {};
	async function initial() {
		str = await promise(openfile, 'imagecode/style.svg');
	}
	function style(len, puzzlesize, x, y) {
		if (len in reg) {
			if (x in reg[len]) {
				if (y in reg[len][x]) {
					return reg[len][x][y];
				}
			} else {
				reg[len][x] = {};
			}
		} else {
			reg[len] = {};
			reg[len][x] = {};
		}
		let svg = text2xml(str).getElementsByTagName('svg')[0];
		svg.setAttribute('viewBox', [0, 0, puzzlesize, puzzlesize].join(' '));
		let use = svg.getElementsByTagName('use')[0];
		use.setAttribute('x', - puzzlesize * x);
		use.setAttribute('y', - puzzlesize * y);
		let rect = svg.getElementsByTagName('rect')[0];
		rect.setAttribute('width', puzzlesize);
		rect.setAttribute('height', puzzlesize);
		reg[len][x][y] = svg;
		return reg[len][x][y];
	}
	return {
		initial: initial,
		style: style
	};
})();
