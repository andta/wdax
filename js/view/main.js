// 所有模块都通过 define 来定义
define(function(require, exports, module) {
	//当沉浸式时，subtop顶部高度动态设置
	var subtop = '45px';
	var t = document.getElementById('header');
	if (t.offsetHeight > 44) {
		subtop = '70px';
	};
	/**
	 * 初始化Mui,启用双击监听,预加载sub子页
	 */
	mui.init({
		gestureConfig: {
			doubletap: true
		},
		subpages: [{
			url: 'main_list.html',
			id: 'main_list',
			styles: {
				top: subtop,
				bottom: '0px',
			},
			extras: {
				headertop: subtop//向子页面传值
			}
		}]
	});
	mui.plusReady(function() {
		// 设置应用非全屏显示！
		plus.navigator.setFullscreen(false); //获取当前系统状态栏高度
	});
	/*
	 * 监听表头双击，返回顶部！
	 */
	var contentWebview = null;
	document.querySelector('header').addEventListener('doubletap', function() {
		if (contentWebview == null) {
			contentWebview = plus.webview.currentWebview().children()[0];
		}
		contentWebview.evalJS("mui('#pullrefresh').pullRefresh().scrollTo(0,0,100)");
	});
	/*
	 * 处理右上角关于图标的点击事件；
	 */
	var subWebview = null,
		template = null;
	document.getElementById('about').addEventListener('tap', function() {
		console.log('调试：点击了关于按钮！');
		if (subWebview == null) {
			template = plus.webview.getWebviewById("default-main"); //获取共用父窗体
		}
		if (template) {
			subWebview = template.children()[0];
			subWebview.loadURL('about.html');
			mui.fire(template, 'updateHeader', { //修改共用父模板的标题
				title: '关于'
			});
			template.show('slide-in-right', 150); //把新webview窗体显示出来，显示动画效果为速度150毫秒的右侧移入动画
		}
	});
	/*
	 * 程序退出事件
	 */
	mui.back = function() {
		plus.nativeUI.confirm("确认退出？", function(e) {
			if (e.index == 0) {
				plus.runtime.quit();
				console.log('调试：点击了退出按钮！');
			}
		}, '提示！');
	};
});