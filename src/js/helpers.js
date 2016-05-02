//Returns random integer from 1-30 as a string
function rndInt() {
	return Math.floor((Math.random() * 30) + 0).toString();
}

//Shuffles array
function shuffle(a) {
	var j, x, i;
	for (i = a.length; i; i -= 1) {
		j = Math.floor(Math.random() * i);
		x = a[i - 1];
		a[i - 1] = a[j];
		a[j] = x;
	}
}

//Quick changes to elements using id
var el = {
	show: function(id) {
		document.getElementById(id).classList.remove("hidden");
	},
	hide: function(id) {
		document.getElementById(id).classList.add("hidden");
	},
	style: function(id, prop, value) {
		document.getElementById(id).style[prop] = value;
	}
};
