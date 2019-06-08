var image = {
	xml: {},
	reg: {},
	initial: function (callback) {
		openfileforxml("imagecode/style.svg", function (oReq) {
			image.xml = oReq;
			callback();
		});
	},
	style: function (len, puzzlesize, x, y) {
		if (len in image.reg) {
			if (x in image.reg[len]) {
				if (y in image.reg[len][x]) {
					return image.reg[len][x][y];
				}
			} else {
				image.reg[len][x] = {};
			}
		} else {
			image.reg[len] = {};
			image.reg[len][x] = {};
		}

		let svg = xhr2xml(image.xml);

		let svgref = svg.getElementsByTagName('svg')[0];
		svgref.setAttribute('viewBox', [0, 0, puzzlesize, puzzlesize].join(' '));

		let useref = svg.getElementsByTagName('use')[0];
		useref.setAttribute('x', - puzzlesize * x);
		useref.setAttribute('y', - puzzlesize * y);

		let rectref = svg.getElementsByTagName('rect')[0];
		rectref.setAttribute('width', puzzlesize);
		rectref.setAttribute('height', puzzlesize);

		image.reg[len][x][y] = svgref;
		return image.reg[len][x][y];
	}
};
