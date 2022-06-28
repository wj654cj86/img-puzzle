var image = (() => {
	let str = '<svg viewBox="0 0 100 100">'
		+ '<use xlink:href="#refpreview" width="600" height="600" />'
		+ '<rect stroke="#000" stroke-width="4" fill-opacity="0" />'
		+ '</svg>',
		reg = {};
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
		let svg = nodetext2svgnode(str);
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
		style: style
	};
})();
