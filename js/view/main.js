// 所有模块都通过 define 来定义
define(function(require, exports, module) {
	//var mui = require('./mui.min');
	/*
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
				top: '45px',
				bottom: '0px',
			}
		}]
	});
	mui.plusReady(function() {
		/*
		// 设置应用非全屏显示！
		plus.navigator.setFullscreen(false); - 获取当前系统状态栏高度
		var heightzt = plus.navigator.getStatusbarHeight();
		// 创建加载内容窗口
		var topoffset = '45px';
		if (plus.navigator.isImmersedStatusbar()) { // 兼容immersed状态栏模式
			// 获取状态栏高度并根据业务需求处理，这里重新计算了子窗口的偏移位置
			topoffset = (Math.round(plus.navigator.getStatusbarHeight()) + 45) + 'px';
		}
		// 使用偏移位置创建子窗口
		wc = plus.webview.create(null, 'doccontent', {
			top: topoffset,
			bottom: '0px',
			bounce: 'vertical',
			bounceBackground: '#FFFFFF'
		});
		*/
	});
	/*
	 * ????
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
		mui.confirm("确认退出？", function(e) {
			if (e.index == 0) {
				plus.runtime.quit();
				console.log('调试：点击了退出按钮！');
			}
		}, '提示！');
	};
});