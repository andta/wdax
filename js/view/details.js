// 所有模块都通过 define 来定义
define(function(require, exports, module) {
	Bmob.initialize("2ddb608bcec0f04b389200311dce7ef4", "aab9208610642810731c21ad3d5fc233");
	var wzid = 0;
	//监听自定义事件	
	window.addEventListener("updateHeader", function(e) {
		wzid = e.detail.id;
		console.log('调试：文章页面获取的id = ' + wzid);
	});
	var outtime = 20000; //超时
	var url = 'http://192.168.1.83/Mobile/Details'; //loio.wicp.net
	/*
	 * 初始化Mui
	 */
	mui.init({
		swipeBack: true //启用右滑关闭功能
	});
	mui.plusReady(function() {
		var cells = document.body.querySelectorAll('.mui-content');
		console.log('调试：关于页面是否包含内容 = ' + cells.length);
		if (plus.networkinfo.getCurrentType() == 1) {
			andta.createwebnone();
		} else {
			ajax(); //执行请求							
		}
	});
	//监听自定义事件
	window.addEventListener("LoadingData", function(e) {
		var title = e.detail.title;
		ajax(); //执行请求	
	});
	//处理点击事件，需要打开原生浏览器
	mui('body').on('tap', 'a', function(e) {
		var href = this.getAttribute('href');
		if (href) {
			if (window.plus) {
				console.log('调试：调用打开设备浏览器！');
				plus.runtime.openURL(href);
			} else {
				location.href = href;
			}
		}
	});
	/* 
	 * 关于页面的ajax拉取
	 */
	var ajax = function() {
		//创建新的Bmob.Object子类
		var db = Bmob.Object.extend("bmob_db_wenZhang");
		var query = new Bmob.Query(db);
		//查询条件
		query.ascending("db_key"); //升序排列		
		//查询数据
		query.get(wzid,{
			success: success,
			error: throwerror
		});
	};
	/*
	 * 成功响应的回调函数
	 */
	var count = 0;
	var success = function(results) {
		//获取Div元素
		var table = document.body.querySelector('.mui-content');
		//ajax拉取得html片段response
		console.log('调试：返回数据字节 = ' + results.length);
		//插入代码片段 在 element 元素的最后一个子元素后面。
		var html = results.get("db_details");
		table.insertAdjacentHTML('beforeend', html);
		//加载完成显示
		var template = plus.webview.getWebviewById("default-main"); //获取共用父窗体				
		var subWebview = template.children()[0];
		subWebview.show();
	};
	//异常处理函数
	var throwerror = function(erro) {
		mui.plusReady(function() {
			//异常处理；
			console.log('调试：异常信息 = ' + error.code + " " + error.message);
			mui.toast("抱歉，获取文章内容时发生了异常。");
		})
	};
});