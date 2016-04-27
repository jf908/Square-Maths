//This matrix function has a lot to do with
//the interaction between the script and MathJax

var Matrix = {
	nodes: [],
	//Converts a matrix to an AsciiMath formatted 2x2 or 3x3 string
	convert: function(matrix) {
		var text = "";
		var m = matrix.data;
		if(matrix.type) {
			if(matrix.type == "text") {
				text = "`" + (m[0]||"") + "`";
			} else if (matrix.type == "3x3") {
				text =  "`|[" + (m[0]||"") + "," + (m[1]||"") + "," + (m[2]||"") + "],[" +
								(m[3]||"") + "," + (m[4]||"") + "," + (m[5]||"") + "],[" +
								(m[6]||"") + "," + (m[7]||"") + "," + (m[8]||"") + "]|`";
			} else if(matrix.type == "2x2") {
				text =  "`|[" + (m[0]||"") + "," + (m[1]||"") + "],[" +
								(m[2]||"") + "," + (m[3]||"") + "]|`";
			}
		}
		return text;
	},
	//Creates a div with converted text
	create: function(matrix) {
		var m = matrix.data || [];
		var div = document.createElement("div");
		div.appendChild(document.createTextNode(this.convert(matrix)));
		div.classList.add("matrix");
		return div;
	},
	//Returns a table element using an array of matrices
	tabulate: function(matrices) {
		var table = document.createElement("table");
		table.classList.add("matrices");
		var rows = 3;
		var columns = 3;
		for (i = 0; i < rows; i++) {
			var row = document.createElement("tr");
			for (j = 0; j < columns; j++) {
				var cell = document.createElement("td");
				var m = this.create(matrices[i*3+j]);
				this.nodes[i*3+j] = m;
				cell.appendChild(m);
				cell.addEventListener("click", matrixEditClick);
				row.appendChild(cell);
			}
			table.appendChild(row);
		}
		return table;
	},
	//Generates a random set of matrices
	random: function() {
		var matrices = [];
		for(var i=0; i<9;i++) {
			matrices[i] = {};
			if( Math.random()<0.5 ) {
				matrices[i].type = "3x3";
				matrices[i].data = [rndInt(),rndInt(),rndInt(),rndInt(),rndInt(),rndInt(),rndInt(),rndInt(),rndInt()];
			} else {
				matrices[i].type="2x2";
				matrices[i].data = [rndInt(),rndInt(),rndInt(),rndInt()];
			}
		}
		return matrices;
	},
	//Sets and typesets an individual matrix
	update: function(n, m) {
		this.nodes[n].innerHTML = "";
		this.nodes[n].appendChild(document.createTextNode(this.convert(m)));
		MathJax.Hub.Queue(["Typeset",MathJax.Hub,this.nodes[n]]);
	},
	//Typesets all matrices
	updateAll: function() {
		MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
	}
};
