window.MathJax = {
    jax: ["input/AsciiMath", "output/HTML-CSS"],
    extensions: ["asciimath2jax.js"],
    showMathMenu: false,
	"HTML-CSS": {
        imageFont: null
	},
    AuthorInit: function() {
        MathJax.Hub.Register.StartupHook("End", function() {
          MathJax.Hub.processSectionDelay = 0;
        });
    }
};
