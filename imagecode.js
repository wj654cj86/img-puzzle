let str = '<svg>'
	+ '<use xlink:href="#refpreview" width="600" height="600" />'
	+ '<rect stroke="#000" stroke-width="4" fill="none" />'
	+ '</svg>',
	reg = {};
export default function (len, puzzlesize, x, y) {
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
	let svg = text2svg(str);
	svg.setAttribute('viewBox', [0, 0, puzzlesize, puzzlesize].join(' '));
	let use = svg.querySelector('use');
	use.setAttribute('x', - puzzlesize * x);
	use.setAttribute('y', - puzzlesize * y);
	let rect = svg.querySelector('rect');
	rect.setAttribute('width', puzzlesize);
	rect.setAttribute('height', puzzlesize);
	reg[len][x][y] = svg;
	return reg[len][x][y];
};