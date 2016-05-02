//This main script is a bit of a mess,
//if I was more organised it would be
//a bit more modular.

//Variables
var save;
var selected;
var rotationInterval;
var timerInterval;
var inRotation = false;

//Get DOM Elements
var puzzle = document.getElementById("puzzle");
var width = puzzle.offsetWidth;
var height = puzzle.offsetHeight;
var container = document.getElementsByClassName("container")[0];
var sidebar = document.getElementById("sidebar");
var minitable = document.querySelectorAll(".minitable td");

//Scale values
var size = Math.min(width, height);
var scales = size / 500;

//Used for shuffling
var defaultMatNums = [0, 1, 2, 3, 4, 5, 6, 7, 8];
var matNums = [];
var matIndex = 0;

//Stores matrices table element
var matrices;

//Program state
var state = "mainmenu";
var stateFunctions = {
	"mainmenu": {
		enter: function() {
			el.show("launch");
			container.classList.add("start");
			puzzle.style.perspective = "5000px";
		},
		leave: function() {
			el.hide("launch");
			container.classList.remove("start");
			puzzle.style.perspective = "initial";
		}
	},
	"editor": {
		enter: function() {
			el.style("menu", "top", "0px");
			el.style("sidebar", "left", "0px");
			puzzle.classList.add("editor");
			resize();
			if(!save) {
				save = {};
				save.type = "3x3";
				save.data = [
					{},{},{},{},{},{},{},{},{}
				];
				save.props = {
					delay: 6000,
                    sequenceType: "random",
                    sequence: []
				};
				setupMatrix(save.data);
				document.getElementsByClassName("new")[0].innerHTML = "Back";
			}
		},
		leave: function() {
			el.style("menu", "top", "-50px");
			el.style("sidebar", "left", "-30%");
			puzzle.classList.remove("editor");
			resize();
		}
	},
	"ready": {
		enter: function() {
			el.show("ready");
			el.hide("puzzle");
		},
		leave: function() {
			el.hide("ready");
			el.show("puzzle");
		}
	},
	"playing": {
		enter: function() {
			el.show("overlay");
			var middleText = document.getElementsByClassName("middleText")[0];
			middleText.innerHTML = "3";
            manageMatNums();
			matrices.style.opacity = 0;
            timer.reset();
			setTimeout(function(){middleText.innerHTML="2";}, 1000);
			setTimeout(function(){middleText.innerHTML="1";}, 2000);
			setTimeout(function() {
				middleText.innerHTML = "";
				matrices.style.opacity = 1;
				revolve();
				rotationInterval = setInterval(revolve, save.props.delay);
				inRotation = true;
                timerInterval = setInterval(timer.draw.bind(timer),30);
			}, 3000);
		},
		leave: function() {
			el.hide("overlay");
			if(inRotation) {
				clearInterval(rotationInterval);
                clearInterval(timerInterval);
				gotoNeutral();
				inRotation = false;
			}
            setTimeout(function() {
                var nodes = document.querySelectorAll(".matrix.hidden");
                for (var i = 0; i < nodes.length; i++) {
                  nodes[i].classList.remove("hidden");
                }
            }, 601);
		}
	},
	"finish": {
		enter: function() {

		},
		leave: function() {

		}
	}
};
stateFunctions.mainmenu.enter();
//Changes the state of the app
function changeState(changeto) {
	stateFunctions[state].leave();
	state = changeto;
	stateFunctions[state].enter();
}

//Append matrix to the document
function setupMatrix(matrix) {
	container.innerHTML = "";
	container.appendChild(Matrix.tabulate(matrix));
	matrices = document.getElementsByClassName("matrices")[0];

	matrices.style.transform = "scale(" + scales + ")";
}
//Generates new matrix to be displayed on startup
setupMatrix(Matrix.random());

//Set view to all matrices
function gotoNeutral() {
	container.style.transform = "translateX(-50%) translateY(-50%)";
	matrices.style.transform = "scale(" + scales + ")";
}
gotoNeutral();

//Set view to specific matrix
function goto(a, b) {
	if (b === undefined) {
		b = Math.floor(a / 3);
		a = a % 3;
	}


	var sf = 3.8;
	xpos = -50 - a * (size) / sf + (size) / sf;
	ypos = -50 - b * (size) / sf + (size) / sf;

	container.style.transform = "translateX(" + xpos + "%) translateY(" + ypos + "%)";
	matrices.style.transform = "scale(" + 4 * scales + ")";
}

//Save file event
document.getElementById("save").addEventListener("click", function() {
	a = document.getElementById("download");
	var json = JSON.stringify(save),
		blob = new Blob([json], {type: "application/json"}),
		url = window.URL.createObjectURL(blob);
	a.href = url;
    if(document.getElementById("filename").value) {
        a.download = document.getElementById("filename").value + ".json";
    } else {
        a.download = "Matrix.json";
    }
	a.click();
	window.URL.revokeObjectURL(url);
});
//Load file event
document.getElementById("open").addEventListener("change", function() {
	if (typeof window.FileReader !== 'function') {
	    alert("The file API isn't supported on this browser yet.");
	    return;
	}
	if (!this.files) {
	    alert("This browser doesn't seem to support the `files` property of file inputs.");
	} else if (!this.files[0]) {
	    alert("Please select a file before clicking 'Load'");
	} else {
	    file = this.files[0];
	    fr = new FileReader();
        fr.fileName = file.name;
	    fr.onload = receivedText;
	    fr.readAsText(file);
	}

	function receivedText(e) {
	    lines = e.target.result;
        var obj;
		try {
			obj = JSON.parse(lines);
		} catch(evt) {
			alert("Failed to load file - File is not of the right type.");
		}
		if(obj && obj.type && obj.type=="3x3") {
            document.getElementById("filename").value = e.target.fileName.slice(0,-5);
			save = obj;
            loadProperties();
            setupMatrix(save.data);
			changeState("ready");
            Matrix.updateAll();
		} else {
			alert("File contains the wrong data  or not supported on this version.");
		}
	}
});

//When an input changes
function inp(type, index) {
	var value;
	if(type=="2x2") {
		value = document.querySelectorAll(".\\32 x2 input")[index].value;
	} else if(type=="3x3") {
		value = document.querySelectorAll(".\\33 x3 input")[index].value;
	} else if(type=="text") {
        value = document.querySelectorAll(".text input")[index].value;
    }
	if(!save.data[selected].data) {
		save.data[selected].data = [];
	}
	save.data[selected].data[index] = value;
	Matrix.update(selected, save.data[selected]);
}

//Sidebar stuff
sidebarTypes = {
	"2x2": document.getElementById("2x2"),
	"3x3": document.getElementById("3x3"),
    "text": document.getElementById("text")
};
function changeSidebar(str) {
	if(sidebar.querySelector("#sidebar>:not(.hidden):not(.nohide)")) {
		sidebar.querySelector("#sidebar>:not(.hidden)").classList.add("hidden");
	}
	sidebar.getElementsByClassName(str)[0].classList.remove("hidden");
}
function selectMatrixType(type) {
	selectMatrixTypeView(type);
	save.data[selected].type = type;
	save.data[selected].data = [];
	Matrix.update(selected, save.data[selected]);
}
function selectMatrixTypeView(type) {
	document.getElementsByClassName("input-matrix")[0].reset();
	if(sidebar.querySelector(".input-matrix table:not(.hidden)")) {
		sidebar.querySelector(".input-matrix table:not(.hidden)").classList.add("hidden");
	}
	if(type!="none") {
		sidebarTypes[type].checked = true;
		sidebar.getElementsByClassName(type)[0].classList.remove("hidden");
	}
}
//When matrix is clicked
function matrixEditClick() {
	if(state == "editor") {
		changeSidebar("input-matrix");
		var a = Array.prototype.indexOf.call(this.parentNode.parentNode.childNodes, this.parentNode);
		var b = Array.prototype.indexOf.call(this.parentNode.childNodes, this);
		selected = a*3 + b;
		if(!save.data[selected].type) {
			selectMatrixTypeView("none");
		} else {
			var type = save.data[selected].type;
			selectMatrixTypeView(type);
			var inputs;
			if(type=="2x2") {
				inputs = document.querySelectorAll(".\\32 x2 input");
			} else if(type=="3x3") {
				inputs = document.querySelectorAll(".\\33 x3 input");
			} else if(type=="text") {
                inputs = document.querySelectorAll(".text input");
            }
			if(save.data[selected].data) {
				for(var i=0;i<inputs.length;i++) {
					if(save.data[selected].data[i]) {
						inputs[i].value = save.data[selected].data[i];
					}
				}
			}
		}
	}
}

//Property functions
var setProps = {
    delay: function(d) {
        return d;
    },
    sequenceType: function(d) {
        if(d=="random") {
            el.hide("prop-sequence");
            document.getElementById("prop-sequence").value = "";
            setProperty("sequence");
            document.getElementById("prop-sequence").style.background = "rgba(0,0,0,.2)";
        } else {
            el.show("prop-sequence");
        }
        return d;
    },
    sequence: function(d) {
        if(validateSequence(d)) {
            document.getElementById("prop-sequence").style.background = "rgba(0,0,0,.2)";
            return d;
        } else {
            document.getElementById("prop-sequence").style.background = "rgba(255,0,0,.1)";
            return "";
        }
    }
};
//Validates if a sequence will work
function validateSequence(text) {
    var set = text.split(",");
    for(var i=0;i<set.length;i++) {
        if(!set[i] || set[i]<1 || set[i]>9) {
            return false;
        }
        set[i] = set[i]-1;
    }
    return set;
}
//Sets a property
function setProperty(prop) {
	save.props[prop] = setProps[prop](document.getElementById("prop-"+prop).value);
}
//Loads properties
function loadProperties() {
    for(var prop in save.props) {
        if(save.props[prop]) {
            document.getElementById("prop-"+prop).value = save.props[prop];
            setProps[prop](save.props[prop]);
        }
    }
}

//Handles window resizes
function resize() {
	width = puzzle.offsetWidth;
	height = puzzle.offsetHeight;
	size = Math.min(width, height);
	scales = size / 500;
	matrices.style.transform = "scale(" + scales + ")";
	if(state=="playing") {
		goto(matNums[matIndex]);
	}
}
window.onresize = resize;

//Sets the sequence order
function manageMatNums() {
    clearMini();
    if(save.props.sequenceType == "custom") {
        var validated = validateSequence(save.props.sequence);
        if(validated) {
            matNums = validated.slice();
            matIndex = matNums.length-1;
        } else {
            matNums = defaultMatNums.slice();
            shuffle(matNums);
        }
    } else {
        matNums = defaultMatNums.slice();
        shuffle(matNums);
    }
}
//Clears the minimap
function clearMini() {
	for (var i = 0; i < minitable.length; i++) {
		minitable[i].classList.remove("select");
	}
}
//Goes to the next matrix in order
function revolve() {
	matIndex += 1;
	if (matIndex == matNums.length) {
		matIndex = 0;
	}

	goto(matNums[matIndex]);
	clearMini();
	minitable[matNums[matIndex]].classList.add("select");

	var nodes = document.querySelectorAll(".matrix.hidden");
	for (var i = 0; i < nodes.length; i++) {
	  nodes[i].classList.remove("hidden");
	}
	setTimeout(function() {
		var nodes = document.querySelectorAll(".matrix");
		for (var i = 0; i < nodes.length; i++) {
			if(i != matNums[matIndex]) {
				nodes[i].classList.add("hidden");
			}
		}
	}, 600);
}

//Auto-hiding finish button during play state
var autohide = document.getElementById("auto-hide");
var mouseIdle;
var shown;
overlay.onmousemove = function() {
	if(!shown && inRotation) {
		if(mouseIdle) {
			clearTimeout(mouseIdle);
		}
		autohide.style.opacity = 1;
	}

	mouseIdle = setTimeout(function() {
		autohide.style.opacity = 0;
	}, 1000);
};

//Regex validation
var regexes = {
    "numbers":/[0-9]/,
    "numbersandcommas":/[0-9]|,/
};
function valid(evt, rgx) {
    if(!regexes[rgx].test(String.fromCharCode(evt.keyCode))) {
        evt.preventDefault();
    }
}

//Timer module
var timer = {
    svg: document.getElementById("timer-border"),
    angle: 0,
    circum: 565.5,
    draw: function() {
        this.angle += (this.circum * 30)/(save.props.delay);
        this.angle %= this.circum;
        this.svg.style.strokeDashoffset = (this.circum-this.angle)+"px";
    },
    reset: function() {
        this.angle = 0;
        this.svg.style.strokeDashoffset = this.circum+"px";
    }
};
