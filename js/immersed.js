(function(w) {
	//动态沉浸式设置
	document.addEventListener('plusready', function() {
		console.log("Immersed-UserAgent: " + navigator.userAgent);
	}, false);

	var immersed = 0;
	var ms = (/Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi).exec(navigator.userAgent);
	if (ms && ms.length >= 3) {
		immersed = parseFloat(ms[2]);
	}
	w.immersed = immersed;
	if (!immersed) {
		return;
	}
	//增加标题栏高度以及设置paddingTop
	var t = document.getElementById('header');
	t && (t.style.height = (t.offsetHeight + immersed) + 'px',t.style.paddingTop = immersed + 'px');
	t = document.getElementById('content');
	t && (t.style.marginTop = immersed + 'px');

})(window);