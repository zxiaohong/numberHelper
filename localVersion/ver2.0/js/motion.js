/**
 * Created by Eva on 2016/11/15.
 */
$(function () {
	// 币种切换菜单显示隐藏
	var faAngleRight, faAngleDown, listBox, menuWrap, currentMenu;
	var menuTit = $(".menu_title");
	menuTit.click(function () {
		var $this = $(this)[0];
		$.each(menuTit, function (index, item) {
			item.id = index;
		});
		$(".transfer_content").eq($this.id).show().siblings().hide();
		$(".conversion_history").hide();
		$(".right_main").show();
		if ($(this).hasClass("current")) {
			faAngleRight = $(this).find(".fa-angle-right");
			faAngleDown = $(this).find(".fa-angle-down");
			menuWrap = $(this).parent();
			listBox = menuWrap.find(".list_box");
			if (faAngleRight.css("display") === "none" && listBox.css("display") === "block") {
				faAngleDown.hide();
				faAngleRight.show();
				listBox.hide();
			} else {
				faAngleRight.hide();
				faAngleDown.show();
				listBox.show();
			}
		} else {
			//取消"具有当前样式"菜单的样式，隐藏list
			currentMenu = $(".menu_title").parent().find(".current");
			currentMenu.find(".fa-angle-down").hide();
			currentMenu.find(".fa-angle-right").show();
			currentMenu.parent().find(".list_box").hide();
			$(".menu_title").removeClass("current");
			//给被点击的菜单添加样式
			$(this).addClass("current");
			faAngleRight = $(this).find(".fa-angle-right");
			faAngleDown = $(this).find(".fa-angle-down");
			menuWrap = $(this).parent();
			listBox = menuWrap.find(".list_box");
			if (faAngleRight.css("display") === "none" && listBox.css("display") === "block") {
				faAngleDown.hide();
				faAngleRight.show();
				listBox.hide();
			} else {
				faAngleRight.hide();
				faAngleDown.show();
				listBox.show();
			}
		}
	});
	
	//点击list图标 左侧边栏显示隐藏
	var leftSidebar = $("#left_sidebar");
	var rightContent = $("#right_content");
	$(".list_icon").click(function () {
		if (leftSidebar.css("width") == "168px") {
			rightContent.animate({width: '1024px'}, "fast");
			leftSidebar.animate({width: '0px'}, "fast");
		} else {
			leftSidebar.animate({width: '168px'}, "fast");
			rightContent.animate({width: '856px'}, "fast");
		}
	});
	
	//点击币种切换菜单币种列表 切换转换模式
	var currencyL = $(".menu_list a");
	currencyL.click(function () {
		$(".menu_list").find("a[class='active']").removeClass('active');
		
		$(this).addClass("active");
		if ($(this).parent().parent().hasClass("money_list")) {
			var currencyTxt = $(this).text();
			$(".money-subtitle").text(currencyTxt);
		}
	});
	//文本语音朗读
	var ttsDiv = $("#bdtts_div_id");
	var ttsAudio, ttsText, lang, language;
	var bbCButton = $("#oprIcon .fa-volume-up");
	var bbMButton = $("#doIcon .fa-volume-up");
	bbCButton.click(function () {
		ttsText = $("#numToChar").text();
		ttsText = encodeURI(ttsText);
		language = $(".money-subtitle").text();
		if (language == "CNY" || language === "HKY") {
			lang = "zh";
		} else if (language === "JPY") {
			lang = "jp"
		}
		ttsAudio = "<audio id='tts_audio'>" +
			"<source src=\"http://tts.baidu.com/text2audio?lan=" + lang + "&ie=UTF-8&spd=2&text=" + ttsText + "\" type=\"audio/mpeg\">" +
			"</audio>";
		// ttsAudio = "<audio id='tts_audio'>" +
		// 	"<source src=\"http: //translate.google.com/translate_tts?tl="+lang+"&q="+ ttsText +"\" type=\"audio/mpeg\">"+
		// 	"</audio>";
		//ttsSrc="http: //translate.google.com/translate_tts?tl="+lang+"&q="+ttsText;
		ttsDiv.html(ttsAudio);
		$("#tts_audio")[0].play();
	});
	bbMButton.click(function () {
		ttsText = $("#numToMoney").text();
		ttsText = encodeURI(ttsText);
		language = $(".money-subtitle").text();
		if (language == "CNY" || language === "HKY") {
			lang = "zh";
		} else if (language === "JPY") {
			lang = "jp"
		}
		ttsAudio = "<audio id='tts_audio'>" +
			"<source src=\"http://tts.baidu.com/text2audio?lan=" + lang + "&ie=UTF-8&spd=2&text=" + ttsText + "\" type=\"audio/mpeg\">" +
			"</audio>";
		//ttsSrc="http: //translate.google.com/translate_tts?tl="+lang+"&q="+ttsText;
		ttsDiv.html(ttsAudio);
		$("#tts_audio")[0].play();
	});
	//复制文本到剪切板
	var clipboard, $copysuc;
	$("#oprIcon .fa-files-o").click(function (e) {
		clipboard = new Clipboard('#copyTIcon');
		clipboard.on('success', function () {
			$copysuc = $("<span class='copy-t-tips'>☺ Have been copied to the clipboard</span>");
			$("#num-t-cash").find(".copy-t-tips").remove().end().append($copysuc);
			$(".copy-t-tips").fadeOut(3000);
		});
	});
	$("#doIcon .fa-files-o").click(function (e) {
		clipboard = new Clipboard('#copyMIcon');
		clipboard.on('success', function () {
			$copysuc = $("<span class='copy-m-tips'>☺ Have been copied to the clipboard</span>");
			$("#num-m-cash").find(".copy-m-tips").remove().end().append($copysuc);
			$(".copy-m-tips").fadeOut(3000);
		});
	});
	//点击custom区域左侧input框激活，显示icon 显示输入格式提示
	var tooltips;
	$(".custom_input_l").click(function () {
		
		var parent = $(this).parent();
		if (parent.children().hasClass("tooltips")) {
			parent.find(".tooltips").remove();
		}
		tooltips = "<span class='tooltips'>Please enter correct replacement, such as <i class='higTips'>%壹=①%</i></span>";
		parent.append(tooltips);
		$(this).css({
			background: '#fff',
			border: "1px solid #ccc",
			'margin-top': '2px'
		});
		parent.find('.custom_check').css("visibility", "visible");
	}).blur(function () {
		var checkReg = /^%.+=.+%$/;
		var customInputVal = $(this).val();
		var parent = $(this).parent();
		if (!checkReg.test(customInputVal)) {
			if (parent.children().hasClass("tooltips")) {
				parent.find(".tooltips").remove();
			}
			tooltips = "<span class='tooltips'><span style='font-weight:700;color:#ff0000;'>Invalid value !</span> Please enter correct replacement, such as <i class='higTips'>%壹=①%</i></span>";
			parent.append(tooltips);
		}
	});
	
	
	//dateTime模块 点击右上角active按钮购买激活插件
	//获取当前日期时间
	function getCurrentDateTime() {
		var now = new Date();
		var month = now.getMonth() + 1 > 10 ? now.getMonth() + 1 : "0" + now.getMonth() + 1;
		var date = now.getDate() > 10 ? now.getDate() : '0' + now.getDate();
		var hour = now.getHours() > 10 ? now.getHours() : "0" + now.getHours();
		var minute = now.getMinutes() > 10 ? now.getMinutes() : "0" + now.getMinutes();
		var sec = now.getSeconds() > 10 ? now.getSeconds() : "0" + now.getSeconds();
		var millisec = now.getMilliseconds();
		var currentTime = now.getFullYear() + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + sec + ":" + millisec;
		return currentTime;
	}
	
	
	var $iap = window["APP_IAP"];
	var curPluginID = BS.b$.App.getAppId() + ".plugin.DateTime.Format"; /// 定义当前的商品或者插件ID
	
	/// 启动订阅，用于程序启动或者恢复购买的时候，异步来检测指定商品的数量，根据数量来更新界面
	//界面更新函数
	function dateTimeActive() {
		$(".date_disable").css({opacity: '1.0', cursor: "auto"});
		$(".date_time_ipt").removeProp('disabled');
		$('.setting').removeProp('disabled');
		$(".locale_select").removeProp('disabled');
		$(".active_btn").hide();
		$("#dateTimePicker").val(getCurrentDateTime());
		setTable();
	}
	
	$iap.bind(curPluginID, function () {
		console.log("call bind function");
		var curCount = $iap.getCount(curPluginID);
		if (curCount > 0) {
			//TODO: 说明这个插件已经激活了，你下面要编写对应的界面
			dateTimeActive();
		}
	});
	
	$(".active_btn").click(function () {
		var $iap = window["APP_IAP"];
		
		var curPluginID = BS.b$.App.getAppId() + ".plugin.DateTime.Format"; /// 定义当前的商品或者插件ID
		
		var params = {
			message: 'Only ' + $iap.getPrice(curPluginID) + ',Do you want to unlock it?',
			title: 'Confirm Information',
			buttons: ['Ok', 'Cancel'],
			alertType: "Alert"
		};
		var returnValue = BS.b$.Notice.alert(params);//弹窗
		
		if (returnValue === 0 || !BS.b$.pN) {//"确定"
			
			
			/// 先声明一下，购买成功的操作，和购买失败后的操作
			var fn_BuySuccess = function (productId, obj) {
				var curCount = $iap.getCount(productId);
				// 购买成功后，检查现在的数量，符合激活标准的发，界面元素做相应变化
				if (curCount > 0) {
					dateTimeActive();
				}
			};
			
			var fn_BuyFail = function (productId, obj) {
				//
				// TODO：购买失败后的处理
				var params = {
					message: 'Failed purchase ！',
					title: 'Information',
					buttons: ['Ok'],
					alertType: "Alert"
				};
				BS.b$.Notice.alert(params);
			};
			
			////////////////////////////////////////////////////////////////////
			/// 启动购买
			$iap.buy(curPluginID, 1, fn_BuySuccess, fn_BuyFail);
			
		} else {
			return;
		}
	});
	
	$(".restore_btn").click(function () {
		
		var $iap = window["APP_IAP"];
		
		var curPluginID = BS.b$.App.getAppId() + ".plugin.DateTime.Format"; /// 定义当前的商品或者插件ID
		
		/// 先声明一下，恢复购买成功的操作，和恢复购买失败后的操作
		var fn_resotreSuccess = function (productArray) {
			/**
			 * 恢复成功后，得到商品的ID及数量，根据这些信息更新界面相关的元素
			 */
			if ($.RTYUtils.isArray(productArray)) {
				$.each(productArray, function (index, productObj) {
					var productId = productObj.productIdentifier; /// 商品或者插件ID
					var quantity = productObj.quantity;           /// 商品或者插件的已经购买的数量
					
					if (productId == curPluginID) {
						if (quantity > 0) {
							//TODO: 更新界面相关元素
							dateTimeActive();
						}
					}
				});
			}
		};
		
		var fn_resotreFail = function () {
			var params = {
				message: 'Failed restore ！',
				title: 'Information',
				buttons: ['Ok'],
				alertType: "Alert"
			};
			BS.b$.Notice.alert(params);
		};
		
		$iap.restore(fn_resotreSuccess, fn_resotreFail);
	});
	
	
	//日期时间选择
	//默认 english
	$("#dateTimePicker").datetimepicker({
		changeYear: true,
		changeMonth: true,
		showSecond: true,
		showMillisec: true,
		dateFormat: 'yy-mm-dd',
		timeFormat: 'hh:mm:ss:l',
		showButtonPanel: true,
		monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
		beforeShow: function (input) {
			setTimeout(function () {
				var buttonPane = $(input)
					.datepicker("widget")
					.find(".ui-datepicker-buttonpane");
				
				$("<button>", {
					class: "ui-datepicker-clear ui-state-default ui-priority-primary ui-corner-all",
					text: 'Clear',
					click: function () {
						// $("#dateTimePicker").val("");
						$.datepicker._clearDate("#dateTimePicker");
					}
				}).appendTo(buttonPane);
			}, 0);
		}
	});
	//用户输入时间 格式提示
	var regExp = /^(\d{4})-(\d{2})-(\d{2}) ((\d{2}):(\d{2}):(\d{2}):(\d{3})?)?$/;
	$("#dateTimePicker").blur(function () {
		if (!regExp.test($("#dateTimePicker").val())) {
			$(".dateTips").text("请输入正确的时间 格式如 YYYY-MM-DD hh:mm:ss:lll")
		} else {
			$(".dateTips").text("");
		}
	});
	
	
	//选择语种
	var options = "";
	var localeItems = $.RTYUtils.googleLangIDMaps;
	$.each(localeItems, function (key, item) {
		options = "<option value=" + key + ">" + item.localName + "</option>";
		$(".locale_select").append(options);
	});
	//根据语种加载表格中的项
	
	var lagKey;
	var langs = {};
	
	$.ajax({
		url: "../ver2.0/common/sdkjs/data.json",
		type: "GET",
		dataType: "json",
		data: "{}",
		headers: {'ContentType': 'application/json;charset=utf-8'},
		success: function (data) {
			langs = data;
		},
		error: function (err) {
			console.log(err);
			console.log(err.responseText);
		}
	});
	$("#locale_select").change(function () {
		var comment = $(".comment");
		lagKey = $(this).val();
		$.each(langs, function (key, item) {
			if (lagKey === key) {
				$("#idx").text(item["no"]);
				$("#key").text(item["key"]);
				$("#val").text(item["val"]);
				$("#comment").text(item["comment"]);
				comment.eq(0).text(item["fullYear"]);
				comment.eq(1).text(item["fullMonth"]);
				comment.eq(2).text(item["fullDate"]);
				comment.eq(3).text(item["fullHours"]);
				comment.eq(4).text(item["fullMinutes"]);
				comment.eq(5).text(item["fullSeconds"]);
				comment.eq(6).text(item["milliSeconds"]);
				comment.eq(7).text(item["fullDay"]);
				comment.eq(8).text(item["timeZoneOffset"]);
			}
		});
	});
	//日期转换为时间戳函数
	function datetimeToUnix(datetime) {
		var tmp_datetime = datetime.replace(/:/g, '-');
		tmp_datetime = tmp_datetime.replace(/ /g, '-');
		var arr = tmp_datetime.split("-");
		var now = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5], arr[6]));
		return parseInt(now.getTime());
	}
	
	// 时间戳拆分
	function unixDepart(timeUnix) {
		var timeStamp = new Date(timeUnix);
		//console.log(timeStamp);
		var fullYear = timeStamp.getFullYear();
		var fullMonth = timeStamp.getMonth() + 1 > 10 ? timeStamp.getMonth() + 1 : '0' + timeStamp.getMonth() + 1;
		var fullHours = timeStamp.getHours();
		var fullMinutes = timeStamp.getMinutes();
		var fullSeconds = timeStamp.getSeconds();
		var milliseconds = timeStamp.getMilliseconds();
		var day = timeStamp.getDay();
		var weekArr = ["7", "1", "2", "3", "4", "5", "6"];
		var fullDay = weekArr[day];
		var fullDate = timeStamp.getDate();
		var timezoneOffset = timeStamp.getTimezoneOffset();
		var UTCYear = timeStamp.getUTCFullYear();
		var UTCMonth = timeStamp.getUTCMonth() + 1 > 10 ? timeStamp.getUTCMonth() + 1 : '0' + timeStamp.getUTCMonth() + 1;
		var UTCHours = timeStamp.getUTCHours();
		var UTCMinutes = timeStamp.getUTCMinutes();
		var UTCSeconds = timeStamp.getUTCSeconds();
		var UTCMilliseconds = timeStamp.getUTCMilliseconds();
		var UTCDay = timeStamp.getUTCDay();
		var UTCWeekDay = weekArr[UTCDay];
		var UTCDate = timeStamp.getUTCDate();
		return Utils = {
			"fullYear": fullYear,
			"fullMonth": fullMonth,
			"fullHours": fullHours,
			"fullMinutes": fullMinutes,
			"fullSeconds": fullSeconds,
			"milliseconds": milliseconds,
			"fullDay": fullDay,
			"fullDate": fullDate,
			"timezoneOffset": timezoneOffset,
			"UTCYear": UTCYear,
			"UTCMonth": UTCMonth,
			"UTCHours": UTCHours,
			"UTCMinutes": UTCMinutes,
			"UTCSeconds": UTCSeconds,
			"UTCMilliseconds": UTCMilliseconds,
			"UTCDay": UTCWeekDay,
			"UTCDate": UTCDate
		}
	}
	
	function setTable() {
		var datetime = $("#dateTimePicker").val();
		//if(!!datetime){
		var timeStr = datetimeToUnix(datetime);
		var dateUtils = unixDepart(timeStr);
		$("#fullYear").text(dateUtils.fullYear);
		$("#fullMonth").text(dateUtils.fullMonth);
		$("#fullHours").text(dateUtils.fullHours);
		$("#fullMinutes").text(dateUtils.fullMinutes);
		$("#fullSeconds").text(dateUtils.fullSeconds);
		$("#milliSeconds").text(dateUtils.milliseconds);
		$("#fullDay").text(dateUtils.fullDay);
		$("#fullDate").text(dateUtils.fullDate);
		$("#timezoneOffset").text(dateUtils.timezoneOffset);
		$("#UTCYear").text(dateUtils.UTCYear);
		$("#UTCMonth").text(dateUtils.UTCMonth);
		$("#UTCHours").text(dateUtils.UTCHours);
		$("#UTCMinutes").text(dateUtils.UTCMinutes);
		$("#UTCSeconds").text(dateUtils.UTCSeconds);
		$("#UTCMilliseconds").text(dateUtils.UTCMilliseconds);
		$("#UTCDay").text(dateUtils.UTCDay);
		$("#UTCDate").text(dateUtils.UTCDate);
	}
	
	//}
	
	//点击setting按钮将时间拆分
	$(".setting").click(setTable);
	
});
