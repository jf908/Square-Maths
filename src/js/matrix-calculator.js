//Calculator variables
var calculator = {
    el: document.getElementsByClassName("calculator")[0],
    det: document.getElementsByClassName("calculator-determinant")[0],
    inputs:[],
    on: false
};

//Sets inputs to only allow for numbers,.,-
for(var i=0;i<9;i++) {
    document.querySelectorAll(".calculator-input input")[i].addEventListener("keypress", calcEvent);
}
function calcEvent(evt) {
    var key = evt.keyCode;
    key = String.fromCharCode(key);
    var regex = /[0-9]|\.|\-/;
    if (!regex.test(key)) {
        evt.returnValue = false;
        if (evt.preventDefault) evt.preventDefault();
    }
}

//When an input changes
function cal(type, n) {
    var value;
    if(type=="3x3") {
        value = document.querySelectorAll(".calculator-input input")[n].value;
    }
    calculator.inputs[n] = value;
    calculator.det.innerHTML = calculateDeterminant(calculator.inputs);
}
//Calculates the determinant
function calculateDeterminant(inputs) {
    for(var i=0;i<9;i++) {
        if(!inputs[i] || isNaN(parseFloat(inputs[i]))) {
            return "";
        }
    }
    var a = inputs[0]*(inputs[4]*inputs[8]-inputs[5]*inputs[7])-inputs[1]*(inputs[3]*inputs[8]-inputs[5]*inputs[6])+inputs[2]*(inputs[3]*inputs[7]-inputs[4]*inputs[6]);
    return a;
}
//Toggles calculator view
function toggleCalculator() {
    if(calculator.on) {
        calculator.el.classList.remove("open");
    } else {
        calculator.el.classList.add("open");
    }
    calculator.on = !calculator.on;
}
