var latinScript = {
	'A': ['m15,95h11l29.5-90h-11z', 'm85,95h-11l-29.5-90h11z', 'm32,50v10h36v-10z'],
	'B': ['m15,5h10v90h-10z', 'm19,5h35a25,25,180,0,1,0,50h-35v-10h35a15,15,180,0,0,0-30h-35z', 'm19,45h40a25,25,180,0,1,0,50h-40v-10h40a15,15,180,0,0,0-30h-40z'],
	'C': ['m81,25l7.071-7.071a45,45,270,1,0,0,63.64l-7.071-7.071a35,35,270,1,1,0-49.5z'],
	'D': ['m15,5h10v90h-10z', 'm19,5h31a35,45,180,0,1,0,90h-31v-10h31a25,35,180,0,0,0-70h-31z'],
	'E': ['m15,5h70v10h-60v30h50v10h-50v30h60v10h-70z'],
	'F': ['m15,5h70v10h-60v30h50v10h-50v40h-10z'],
	'G': ['m81,25l7.071-7.071a45,45,270,1,0,0,63.64l-7.071-7.071a35,35,270,1,1,0-49.5z', 'm50,45h40v50h-10v-40h-30z'],
	'H': ['m15,5h10v90h-10z', 'm75,5h10v90h-10z', 'm16,45v10h68v-10z'],
	'I': ['m35,5v10h30v-10z', 'm35,85v10h30v-10z', 'm45,6h10v88h-10z'],
	'J': ['m35,5v10h30v-10z', 'm45,6h10v69a20,20,180,1,1-40,0h10a10,10,180,0,0,20,0z'],
	'K': ['m15,5h10v90h-10z', 'm70.6,5h14.4l-68,65v-13.76z', 'm36.7,40.54l8.31-5.54l40,60h-12z'],
	'L': ['m15,5h10v80h60v10h-70z'],
	'M': ['m10,5h10v90h-10z', 'm80,5h10v90h-10z', 'm20,5l34,60l-4,13l-34-60z', 'm80,5l-34,60l4,13l34-60z'],
	'N': ['m15,5h10v90h-10z', 'm75,5h10v90h-10z', 'm25,5l57,83l-7,7l-57-83z'],
	'O': ['m5,50a45,45,180,0,0,90,0a45,45,180,0,0-90,0zm10,0a35,35,180,0,0,70,0a35,35,180,0,0-70,0z'],
	'P': ['m15,5h10v90h-10z', 'm19,5h35a25,25,180,0,1,0,50h-35v-10h35a15,15,180,0,0,0-30h-35z'],
	'Q': ['m50,57l7-7l38,38l-7,7z', 'm5,50a45,45,180,0,0,90,0a45,45,180,0,0-90,0zm10,0a35,35,180,0,0,70,0a35,35,180,0,0-70,0z'],
	'R': ['m15,5h10v90h-10z', 'm19,5h35a25,25,180,0,1,0,50h-35v-10h35a15,15,180,0,0,0-30h-35z', 'm43,50h12l30,45h-12z'],
	'S': ['m85,30a25,35,270,1,0-35,25a15,25,270,1,1-25,15h-10a25,35,270,1,0,35-25a15,25,270,1,1,25-15z'],
	'T': ['m15,5v10h70v-10z', 'm45,6h10v89h-10z'],
	'U': ['m15,5h10v55a25,25,180,0,0,50,0v-55h10v55a35,35,180,0,1-70,0z'],
	'V': ['m15,5h11l29.5,90h-11z', 'm85,5h-11l-29.5,90h11z'],
	'W': ['m5,5h10l20,90h-10z', 'm45,5h10l-20,90h-10z', 'm95,5h-10l-20,90h10z', 'm55,5h-10l20,90h10z'],
	'X': ['m15,5h12l58,90h-12z', 'm15,95h12l58-90h-12z'],
	'Y': ['m15,5h12l27,42v18.67z', 'm85,5h-12l-27,42v18.67z', 'm45,48h10v47h-10z'],
	'Z': ['m15,5v10h70v-10z', 'm15,85v10h70v-10z', 'm15,85l63-77l7,7l-63,77z']
};

var coordinatexml;
var coordinatereg = {};

function coordinatexmlinitial(callback) {
	openfileforxml("coordinate/style.svg", function (oReq) {
		coordinatexml = oReq;
		callback();
	});
}

function latinnew(ls, gn, svg) {
	let len = latinScript[ls].length;
	for (let i = 0; i < len; i++) {
		let path = svg.createElementNS('http://www.w3.org/2000/svg', 'path');
		path.setAttribute('d', 'M-80-80' + latinScript[ls][i]);
		svg.getElementsByTagName('g')[gn].appendChild(path);
	}
}

function coordinatestyle(x, y) {
	if (x in coordinatereg) {
		if (y in coordinatereg[x]) {
			return coordinatereg[x][y];
		}
	} else {
		coordinatereg[x] = {};
	}

	let svg = xhr2xml(coordinatexml);

	latinnew(x, 0, svg);
	latinnew(y, 1, svg);

	coordinatereg[x][y] = svg.getElementsByTagName('svg')[0];
	return coordinatereg[x][y];
}