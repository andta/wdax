// 所有模块都通过 define 来定义
define(function(require, exports, module) {
	Bmob.initialize("2ddb608bcec0f04b389200311dce7ef4", "aab9208610642810731c21ad3d5fc233");
	var tcount = 10; //每次加载的条数
	var outtime = 20000; //超时
	var url = 'http://192.168.1.83/Mobile/ListPanel'; //loio.wicp.net
	/*
	 * 初始化mui 上拉，下拉两个事件
	 */
	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			down: {
				callback: pulldownRefresh
			},
			up: {
				contentdown: '上拉显示更多',
				contentrefresh: '正在加载...',
				contentnomore: '没有更多文章了',
				callback: pullupRefresh
			}
		}
	});
	/*
	 *下拉刷新，上拉加载 初始化数据
	 */
	if (mui.os.plus) {
		mui.plusReady(function() {
			setTimeout(function() {
				mui('#pullrefresh').pullRefresh().pullupLoading();
			}, 0);
		});
	} else {
		mui.ready(function() {
			mui('#pullrefresh').pullRefresh().pullupLoading();
		});
	}
	/*
	 *下拉刷新具体业务实现
	 */
	function pulldownRefresh() {
		setTimeout(function() {
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed	
		}, 1000);
	};
	/*
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh() {
		mui.plusReady(function() {
			//网络判断
			if (plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
				//设置底部加载更多-停止
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
				mui.toast("当前网络不给力，请稍后再试");
			} else {
				ajax(); //执行请求
			}
		});
	};
	/*
	 *ajax网络请求函数
	 */
	var ajax = function() {
		var cells = document.body.querySelectorAll('.mui-table-view-cell'); //获取所有li元素			
		console.log('调试：当前列表条数 = ' + cells.length);
		//创建新的Bmob.Object子类
		var db = Bmob.Object.extend("bmob_db_wenZhang");
		var query = new Bmob.Query(db);
		//查询条件
		query.ascending("db_key"); //升序排列
		query.skip(cells.length); // 开始查询条数
		query.limit(tcount); // 每次查询返回最多10条数据				
		//查询数据	
		query.find({
			success: success,
			error: throwerror
		});
	};
	/*
	 * 成功响应的回调函数
	 */
	var success = function(results) {
		//控制底部的加载更多，加载完毕显示。参数为true代表没有更多数据了。返回数据如果小于							
		mui('#pullrefresh').pullRefresh().endPullupToRefresh(results.length < 1);
		//获取Ui元素
		var table = document.body.querySelector('.mui-table-view');
		// 循环处理查询到的数据
		for (var i = 0; i < results.length; i++) {
			var object = results[i];
			table.insertAdjacentHTML('beforeend',
				'<li class="mui-table-view-cell mui-media "><a href="javascript:;"  id =' + object.id +
				'><img class="mui-media-object mui-pull-left" src= ' + object.get("db_image") +
				'><div class="mui-media-body"><h5 class="my-css-bt-color">' + object.get("db_title") +
				'</h5><p class="mui-h mui-ellipsis">' + object.get("db_description") +
				'</p></div><div class="mui-media-body mui-bottom  mui-pull-right my-css-xx-font"><span class="iconfont icon-yulan"><span class="my-css-tb-font">' + object.get("db_readCount") +
				'</span></span><span class="iconfont icon-huifu"><span class="my-css-tb-font">' + object.get("db_collectionCount") +
				'</span></span><span class="iconfont icon-xin"><span class="my-css-tb-font">' + object.get("db_commentCount") +
				'</span></span></div></a></li>'
			);
		}
	};
	//异常处理函数
	var throwerror = function(erro) {
		mui.plusReady(function() {
			//异常处理；
			console.log('调试：异常信息 = ' + error.code + " " + error.message);
			mui.toast("抱歉，获取文章列表时发生了异常。");
			//设置底部加载更多-停止
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
		})
	};　　
	/*
	 * 点击文章列表，打开文章内容
	 */
	mui('.mui-table-view').on('tap', 'a', function() {
		//获取文章id
		var wzid = this.getAttribute("id");
		console.log('调试：点击了文章内容。' + wzid);
		var subWebview, template;
		if (subWebview == null) {
			//获取共用父窗体
			template = plus.webview.getWebviewById("default-main");
		}
		if (template) {
			subWebview = template.children()[0];
			subWebview.loadURL('details.html');
			//自定义事件，传递参数
			mui.fire(template, 'updateHeader', {
				title: '文章详情',
				id: wzid
			});
			mui.fire(subWebview, 'updateHeader', {
				title: '文章详情',
				id: wzid
			});
			template.show('slide-in-right', 150); //把新webview窗体显示出来，显示动画效果为速度150毫秒的右侧移入动画
		}
	});
	/*
	 * 父子模板配置--------------------------------------------------------
	 */
	var templates = {};
	var getTemplate = function(name, header, content) {
		//获取父页面标题栏高度，用于动态修改顶部高度！
		var headertop = plus.webview.currentWebview().headertop;
		var template = templates[name];
		if (!template) {
			//预加载共用父模板；
			var headerWebview = mui.preload({
				url: header,
				id: name + "-main",
				styles: {
					popGesture: "hide",
				},
				extras: {
					mType: 'main'
				}
			});
			//预加载共用子webview
			var subWebview = mui.preload({
				url: !content ? "" : content,
				id: name + "-sub",
				styles: {
					top: headertop,
					bottom: '0px',
				},
				extras: {
					mType: 'sub'
				}
			});
			//绑定加载完成事件
			subWebview.addEventListener('loaded', function() {});
			subWebview.hide();
			headerWebview.append(subWebview);
			//iOS平台支持侧滑关闭，父窗体侧滑隐藏后，同时需要隐藏子窗体；
			if (mui.os.ios) { //5+父窗体隐藏，子窗体还可以看到？不符合逻辑吧？
				headerWebview.addEventListener('hide', function() {
					subWebview.hide("none");
				});
			}
			templates[name] = template = {
				name: name,
				header: headerWebview,
				content: subWebview,
			};
		}
		return template;
	};
	var initTemplates = function() {
		getTemplate('default', 'template.html');
	};
	mui.plusReady(function() {
		// 隐藏滚动条
		plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
		//延迟的原因：优先打开启动导航页面，避免资源争夺
		setTimeout(function() {
			//初始化模板
			initTemplates();
		}, 10);
	});
});