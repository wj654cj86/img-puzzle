export default function Stopwatch(obj) {
	switch (typeof obj) {
		case 'object':
			this.obj = obj;
			break;
		case 'string':
			this.obj = document.querySelector('#' + obj);
			break;
		default:
			break;
	}
	if (this.obj == undefined)
		throw 'Object is undefined.';
	this.number = this.obj;
	this.number.innerHTML = '00:00.00';
	this.nowtime = 0;
	this.starttime = 0;
	this.lasttime = 0;
	this.status = 'reset';
	this.run = function (sw) {
		sw.nowtime = sw.lasttime + Date.now() - sw.starttime;
		let m = Math.floor(sw.nowtime / 60000);
		let s = Math.floor(sw.nowtime / 1000) % 60;
		let cs = Math.floor(sw.nowtime / 10) % 100;
		sw.number.innerHTML = m.padStart(2, 0) + ':' + s.padStart(2, 0) + '.' + cs.padStart(2, 0);
	};
	Object.defineProperty(this, 'start', {
		get: function () {
			switch (this.status) {
				case 'start':
					break;
				case 'stop':
					this.starttime = Date.now();
					this.objref = setInterval(this.run, 10, this);
					break;
				case 'reset':
					this.starttime = Date.now();
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
					this.lasttime += Date.now() - this.starttime;
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
					this.lasttime = 0;
					this.nowtime = 0;
					this.number.innerHTML = '00:00.00';
					break;
				case 'stop':
					this.lasttime = 0;
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