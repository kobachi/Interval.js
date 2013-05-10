/**
 * Interval.js v1.0
 * Copyright(C) by 2012 kobachi
 */
(function(){
	if(typeof window.Interval != "undefined"){
		return;
	}
	/**
	 * var int = new Interval(0, 10);
	 * var int = new Interval("[", 5, 10, ")");
	 * var int = new Interval(new Date(0), new Date());
	 * int.isEmpty()
	 * int.contains(5);
	 * int.toArray()
	 * int.toArray(step);
	 * int.forEach(function(val){}, 0.3);
	 * Protptype extend:
	 *     (7).in(int)
	 *     new Date(50000).in(int)
	 */
	window.Interval = function(){
		if(this == window) throw new Error("Interval is not a function");
		var start = "(";
		var end = ")";
		var min = 0;
		var dmin = null;
		var max = 0;
		var dmax = null;
		switch(arguments.length){
			case 2:
				min = arguments[0];
				max = arguments[1];
				break;
			case 4:
				start = arguments[0];
				min = arguments[1];
				max = arguments[2];
				end = arguments[3];
				break;
		}
		//type mode check
		var dateMode = false;
		//min or max is not a number
		if(typeof min != "number" || typeof max != "number"){
			if(min instanceof Date && max instanceof Date){
				//min & max is Date
				dateMode = true;
				dmin = min;
				dmax = max;
				min = dmin.getTime();
				max = dmax.getTime();
			}
			else{
				throw new Error("Specified min / max pair is not supported value type set.");
			}
		}

		/**
		 * Gets summary of this interval
		 */
		this.toString = function(){
			return start + ((dateMode) ? dmin : min) + ", " + ((dateMode) ? dmax : max) + end;
		};

		/**
		 * Gets minimum value of interval
		 */
		this.getMin = function(){
			return (dateMode) ? dmin : min;
		};
		/**
		 * Gets maximum value of interval
		 */
		this.getMax = function(){
			return (dateMode) ? dmax : max;
		};

		/**
		 * Returns which is this interval empty or not
		 */
		this.isEmpty = function(){
			if(max < min){
				return true;
			}
			if(start == "(" || end == ")"){
				if(min == max){
					return true;
				}
			}
			return false;
		};

		/**
		 * Returns which is this interval contains specified value
		 */
		this.contains = function(value){
			if(value instanceof Interval){
				return (this.contains(value.getMin()) && this.contains(value.getMax()));
			}
			if(start == "("){
				if(value < min){
					return false;
				}
			}
			else{
				if(value <= min){
					return false;
				}
			}
			if(end == ")"){
				if(max < value){
					return false;
				}
			}
			else{
				if(max <= value){
					return false;
				}
			}
			return true;
		};

		/**
		 * Returns array of values contained
		 */
		this.toArray = function(step){
			if(typeof step != "number"){
				step = 1;
			}
			var a = new Array();
			this.forEach(function(val){
				a.push(val);
			}, step);
			return a;
		};

		/**
		 * Runs callback function each values in this interval with step
		 */
		this.forEach = function(callback, step){
			if(typeof step != "number"){
				step = 1;
			}
			var value = min;
			if(!this.contains(min)){
				value += step;
			}
			var e = null;
			while(true){
				if(!this.contains(value)){
					break;
				}
				try{
					callback((dateMode) ? new Date(value) : value);
				}
				catch(ex){
					break;
				}
				value += step;
			}
			if(e != null){
				throw e;
			}
		};
	};
	try{
		Number.prototype.isIn = function(interval){
			return interval.contains(this);
		};
	}
	catch(e){}
	try{
		Date.prototype.isIn = function(interval){
			return interval.contains(this);
		};
	}
	catch(e){}
})();