function Stopwatch(obj) {
	switch (typeof obj) {
		case 'object':
			this.obj = obj;
			break;
		case 'string':
			this.obj = document.getElementById(obj);
			break;
		default:
			break;
	}
	if (this.obj == undefined)
		throw 'Object is undefined.';
	// this.obj.innerHTML = '時間計數：<span></span>';
	// this.number = this.obj.getElementsByTagName('span')[0];
	this.number = this.obj;
	this.number.innerHTML = '00:00.00';
	this.nowtime = 0;
	this.status = 'reset';
	this.run = function (sw) {
		sw.nowtime++;
		let m = Math.floor(sw.nowtime / 6000);
		let s = Math.floor(sw.nowtime / 100) % 60;
		let cs = sw.nowtime % 100;
		sw.number.innerHTML = paddingLeft(m, 2) + ':' + paddingLeft(s, 2) + '.' + paddingLeft(cs, 2);
	};
	Object.defineProperty(this, 'start', {
		get: function () {
			switch (this.status) {
				case 'start':
					break;
				case 'stop':
					this.objref = setInterval(this.run, 10, this);
					break;
				case 'reset':
					this.objref = setInterval(this.run, 10, this);
					break;
				default:
					break;
			}
			this.status = 'start';
			return this;
		}
	});
	Object.defineProperty(this, 'stop', {
		get: function () {
			switch (this.status) {
				case 'start':
					clearInterval(this.objref);
					break;
				case 'stop':
					break;
				case 'reset':
					break;
				default:
					break;
			}
			this.status = 'stop';
			return this;
		}
	});
	Object.defineProperty(this, 'reset', {
		get: function () {
			switch (this.status) {
				case 'start':
					clearInterval(this.objref);
					this.nowtime = 0;
					this.number.innerHTML = '00:00.00';
					break;
				case 'stop':
					this.nowtime = 0;
					this.number.innerHTML = '00:00.00';
					break;
				case 'reset':
					break;
				default:
					break;
			}
			this.status = 'reset';
			return this;
		}
	});
}