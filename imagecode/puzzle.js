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
		let svg = text2xml(str);
		let svgref = svg.getElementsByTagName('svg')[0];
		svgref.setAttribute('viewBox', [0, 0, puzzlesize, puzzlesize].join(' '));
		let useref = svg.getElementsByTagName('use')[0];
		useref.setAttribute('x', - puzzlesize * x);
		useref.setAttribute('y', - puzzlesize * y);
		let rectref = svg.getElementsByTagName('rect')[0];
		rectref.setAttribute('width', puzzlesize);
		rectref.setAttribute('height', puzzlesize);
		reg[len][x][y] = svgref;
		return reg[len][x][y];
	}
	return {
		initial: initial,
		style: style
	};
})();
