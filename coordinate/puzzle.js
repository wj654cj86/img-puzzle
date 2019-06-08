var latin = {
	script: {
		'A': ['m15,95h11l29.5-90h-11z', 'm85,95h-11l-29.5-90h11z', 'm32,50v10h36v-10z'],
		'B': ['m15,5h10v90h-10z', 'm19,5h35a25,25,180,0,1,0,50h-35v-10h35a15,15,180,0,0,0-30h-35z', 'm19,45h40a25,25,180,0,1,0,50h-40v-10h40a15,15,180,0,0,0-30h-40z'],
		'C': ['m15,50a35,45,180,0,0,70,0a35,45,180,0,0-70,0zm10,0a25,35,180,0,0,50,0a25,35,180,0,0-50,0z'],
		'D': ['m15,5h10v90h-10z', 'm19,5h31a35,45,180,0,1,0,90h-31v-10h31a25,35,180,0,0,0-70h-31z'],
		'E': ['m15,5h10v90h-10z', 'm20,5v10h65v-10z', 'm20,45v10h55v-10z', 'm20,85v10h65v-10z'],
		'F': ['m15,5h10v90h-10z', 'm20,5v10h65v-10z', 'm20,45v10h55v-10z'],
		'G': ['m50,45h32v50h-10v-40h-22z', 'm15,50a35,45,180,0,0,70,0a35,45,180,0,0-70,0zm10,0a25,35,180,0,0,50,0a25,35,180,0,0-50,0z'],
		'H': ['m15,5h10v90h-10z', 'm75,5h10v90h-10z', 'm16,45v10h68v-10z'],
		'I': ['m35,5v10h30v-10z', 'm35,85v10h30v-10z', 'm45,6h10v88h-10z'],
		'J': ['m35,5v10h30v-10z', 'm45,6h10v69a20,20,180,1,1-40,0h10a10,10,180,0,0,20,0z'],
		'K': ['m15,5h10v90h-10z', 'm70.6,5h14.4l-68,65v-13.76z', 'm36.7,40.54l8.31-5.54l40,60h-12z'],
		'L': ['m15,5h10v90h-10z', 'm20,85v10h65v-10z'],
		'M': ['m15,5h10v90h-10z', 'm75,5h10v90h-10z', 'm25,5l29,54l-4,14l-29-54z', 'm75,5l-29,54l4,14l29-54z'],
		'N': ['m15,5h10v90h-10z', 'm75,5h10v90h-10z', 'm25,5l57,83l-7,7l-57-83z'],
		'O': ['m15,50a35,45,180,0,0,70,0a35,45,180,0,0-70,0zm10,0a25,35,180,0,0,50,0a25,35,180,0,0-50,0z'],
		'P': ['m15,5h10v90h-10z', 'm19,5h35a25,25,180,0,1,0,50h-35v-10h35a15,15,180,0,0,0-30h-35z'],
		'Q': ['m50,67l7-7l28,28l-7,7z', 'm15,50a35,45,180,0,0,70,0a35,45,180,0,0-70,0zm10,0a25,35,180,0,0,50,0a25,35,180,0,0-50,0z'],
		'R': ['m15,5h10v90h-10z', 'm19,5h35a25,25,180,0,1,0,50h-35v-10h35a15,15,180,0,0,0-30h-35z', 'm43,50h12l30,45h-12z'],
		'S': ['m85,30a25,35,270,1,0-35,25a15,25,270,1,1-25,15h-10a25,35,270,1,0,35-25a15,25,270,1,1,25-15z'],
		'T': ['m15,5v10h70v-10z', 'm45,6h10v89h-10z'],
		'U': ['m15,5h10v55a25,25,180,0,0,50,0v-55h10v55a35,35,180,0,1-70,0z'],
		'V': ['m15,5h11l29.5,90h-11z', 'm85,5h-11l-29.5,90h11z'],
		'W': ['m15,5h10l17,90h-10z', 'm45,10h10l-13,85h-10z', 'm85,5h-10l-17,90h10z', 'm55,10h-10l13,85h10z'],
		'X': ['m15,5h12l58,90h-12z', 'm15,95h12l58-90h-12z'],
		'Y': ['m15,5h12l27,42v18.67z', 'm85,5h-12l-27,42v18.67z', 'm45,48h10v47h-10z'],
		'Z': ['m15,5v10h70v-10z', 'm15,85v10h70v-10z', 'm15,85l63-77l7,7l-63,77z']
	},
	mask: {
		'C': [1],
		'G': [0, 1]
	}
};

var coordinate = {
	text: {},
	reg: {},
	initial: function (callback) {
		openfiletotext("coordinate/style.svg", function (text) {
			coordinate.text = text;
			let cp = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
			cp.setAttribute('id', 'latinmask');
			let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			path.setAttribute('d', 'M-80-80m50,50l50,30v20h-100v-100h100v20z');
			cp.appendChild(path);
			refpiece.appendChild(cp);
			callback();
		});
	},
	style: function (x, y) {
		if (x in coordinate.reg) {
			if (y in coordinate.reg[x]) {
				return coordinate.reg[x][y];
			}
		} else {
			coordinate.reg[x] = {};
		}

		let svg = text2xml(coordinate.text);

		coordinate.newpath(x, 0, svg);
		coordinate.newpath(y, 1, svg);

		coordinate.reg[x][y] = svg.getElementsByTagName('svg')[0];
		return coordinate.reg[x][y];
	},
	newpath: function (ls, gn, svg) {
		let len = latin.script[ls].length;
		for (let i = 0; i < len; i++) {
			let path = svg.createElementNS('http://www.w3.org/2000/svg', 'path');
			path.setAttribute('d', 'M-80-80' + latin.script[ls][i]);
			if (ls in latin.mask) {
				if (latin.mask[ls][i] == 1) {
					path.setAttribute('clip-path', 'url(#latinmask)');
				}
			}
			svg.getElementsByTagName('g')[gn].appendChild(path);
		}
	}
};
