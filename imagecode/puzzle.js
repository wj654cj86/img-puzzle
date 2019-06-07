var imagexml;
var imagereg = {};

function imagexmlinitial(callback) {
	openfileforxml("imagecode/style.svg", function (oReq) {
		imagexml = oReq;
		callback();
	});
}

function imagestyle(len, puzzlesize, x, y) {
	if (len in imagereg) {
		if (x in imagereg[len]) {
			if (y in imagereg[len][x]) {
				return imagereg[len][x][y];
			}
		} else {
			imagereg[len][x] = {};
		}
	} else {
		imagereg[len] = {};
		imagereg[len][x] = {};
	}

	let svg = xhr2xml(imagexml);

	let svgref = svg.getElementsByTagName('svg')[0];
	svgref.setAttribute('viewBox', [0, 0, puzzlesize, puzzlesize].join(' '));

	let useref = svg.getElementsByTagName('use')[0];
	useref.setAttribute('x', - puzzlesize * x);
	useref.setAttribute('y', - puzzlesize * y);

	let rectref = svg.getElementsByTagName('rect')[0];
	rectref.setAttribute('width', puzzlesize);
	rectref.setAttribute('height', puzzlesize);

	imagereg[len][x][y] = svgref;
	return imagereg[len][x][y];
}