/**
 * Created by Eva on 2016/11/15.
 */
//$(function(){})   //用于存放操作DOM对象的代码，执行其中代码时DOM对象已存在。
//不可用于存放开发插件的代码，因为jQuery对象没有得到传递，外部通过jQuery.method也调用不了其中的方法（函数）。
$(function () {
	
	var numTChar, numTMoney;
	//获取历史记录
	var historyRecord = window.localStorage.localHistory ? JSON.parse(window.localStorage.localHistory) : [];
	var historyRecordItem;
	//console.log(historyRecord);
	//简体中文 大写数字	 大写金额
	function showCNY(num) {
		//noinspection JSUnresolvedVariable
		numTChar = Nzh.cn.encodeB(num);
		numTMoney = Nzh.cn.toMoney(num);
		$("#numToChar").text(numTChar);
		$("#numToMoney").text(numTMoney);
		historyRecordItem = {
			conversionMode: "CNY",
			num: num,
			numToChar: numTChar,
			numToMoney: numTMoney
		};
		historyRecord.push(historyRecordItem);//存储转换记录
	}
	//繁体中文 繁体数字 繁体金额
	function showHKY(num) {
		numTChar = Nzh.hk.encodeB(num);
		numTMoney = Nzh.hk.toMoney(num);
		// console.log(numTChar);
		// console.log(numTMoney);
		$("#numToChar").text(numTChar);
		$("#numToMoney").text(numTMoney.replace('$', '人民币'));
		historyRecordItem = {
			conversionMode: "HKY",
			num: num,
			numToChar: numTChar,
			numToMoney: numTMoney.replace('$', '人民币')
		};
		historyRecord.push(historyRecordItem);//存储转换记录
	}
	
	//日文数字  日文金额
	function showJPY(num) {
		numTChar = Nzh.jp.encodeS(num);
		numTMoney = Nzh.jp.formatJPNum(num);
		$("#numToChar").text(numTChar);
		$("#numToMoney").text(numTMoney);
		historyRecordItem = {
			conversionMode: "JPY",
			num: num,
			numToChar: numTChar,
			numToMoney: numTMoney
		};
		historyRecord.push(historyRecordItem);//存储转换记录
	}
	//执行转换的函数
	function submit() {
		var num = $("#number").val();
		switch ($(".money-subtitle").text()) {
			case "CNY":
				showCNY(num);
				break;
			case "HKY":
				showHKY(num);
				break;
			case "JPY":
				showJPY(num);
				break;
			default:
				break;
		}
		customOutput();
		window.localStorage.localHistory = JSON.stringify(historyRecord);//将转换记录存到缓存中
	}
	//表单验证
	$.validator.addMethod("numeric", function (value, element) {
		var regs = /(^([+-])?0*(\d+)(\.(\d+))?$)|(^([+-])?0*(\d+)(\.(\d+))?e(([+-])?(\d+))$)|(^1\d$)/;
		return this.optional(element) || regs.test(value);
	}, "Please enter a numeric value, and the scientific notation is allowed");
	
	$("#oNumber").validate({
		errorElement: 'span',
		errorClass: 'err-message',
		focusInvalid: false,
		rules: {
			number: {
				required: true,
				numeric: true
			}
		},
		messages: {
			number: {
				required: 'Value cannot be empty',
				numeric: "Value must be digital or  the scientific numbers"
			}
		},
		submitHandler: function (form) {
			submit();
		}
	});
	//点击币种切换菜单执行转行 同时根据自定义规则输出自定义结果
	$(".menu_list").click(function () {
		var conversionHistory = $(".conversion_history");
		if (conversionHistory.css("display") === "block") {
			$(".right_main").css("display", "block");
			conversionHistory.css("display", "none");
			}
		
		if ($(".custom_area").css("display") === "block") {
			if ($("#number").val().length > 0) {
				submit();
				customOutput();
			}
		} else if ($(".library_area").css("display") === "block") {
			if ($("#number").val().length > 0) {
				submit();
			}
			loadLibrary();
			}
	});
	
	
	//自定义输出
	var count;
	
	function customOutput() {
		var reg, index, customTar, customChar;
		var customInput = $(".custom_input_l");
		var customResult = $(".custom_input_r");
		count = 0;
		customInput.each(function () {
			if ($(this).val().length > 0) {
				index = $(this).val().indexOf("=");
				customChar = $(this).val().substring(1, index);//被替换字符
				customTar = $(this).val().substring(index + 1, $(this).val().length - 1);//替换字符
				reg = new RegExp(customChar, 'g');//.replace()方法默认只替换第一次出现的字符，忽略后面相同的字符，将被替换内容定义为正则表达式，可以全部替换
				$(this).parent().find(".custom_input_r").text($("#numToChar").text().replace(reg, customTar));
			} else {
				$(this).parent().find(".custom_input_r").text("");
			}
		});
		customResult.each(function () {
			console.log($(this).text());
			if (!!$(this).text()) {
				count++;
			}
		});
		//表单下方自定义条目
		$(".custom_info span").text(count);
	}
	
	//点击每行的 ✔️ 执行自定义输出  同时增加下方计数器
	$(".fa-check").click(function () {
		var oResult, reg, index, customTar, customChar;
		var parent = $(this).parent().parent();
		var customInput = parent.find(".custom_input_l");
		var customResult = parent.find(".custom_input_r");
		var customInputVal = customInput.val().trim();
		count = 0;
		if (customInputVal.length > 0) {
			index = customInputVal.indexOf("=");
			customChar = customInputVal.substring(1, index);//被替换字符
			customTar = customInputVal.substring(index + 1, customInput.val().length - 1);//替换字符
			reg = new RegExp(customChar, 'g');//.replace()方法默认只替换第一次出现的字符，忽略后面相同的字符，将被替换内容定义为正则表达式，可以全部替换
			customResult.text($("#numToChar").text().replace(reg, customTar));
			//替换成功后样式调整
			$(this).parent().css("visibility", "hidden");
			customInput.css({background: 'transparent', border: "none", 'margin-top': '3px'});
			parent.find(".tooltips").remove();
		}
		//表单下方自定义条目
		//计数器++   自定义了几条
		oResult = $(".custom_input_r");
		oResult.each(function () {
			if ($(this).text().length > 0) {
				count++;
			}
		});
		$(".custom_info span").text(count);
	});
	//取消或删除自定义
	$(".fa-times").click(function () {
		//var oResult;
		var parent = $(this).parent().parent();
		var customInput = parent.find(".custom_input_l");
		var customResult = parent.find(".custom_input_r");
		if (customResult.text().length > 0) {
			count--;
		}
		$(this).parent().css("visibility", "hidden");
		customInput.val("").css({background: 'transparent', border: "none", "margin-top": "3px"});
		customResult.text("");
		parent.find(".tooltips").remove();
		$(".custom_info span").text(count);
	});
	
	//查看历史记录
	function readHistory() {
		var tableDom, sIndex;
		var historyInfo = $(".history_info");
		var information = "";
		var tableContent = "<tr><th class='index'>Serial</th><th class='mode'>Mode</th><th class='_num'>Number</th><th class='convResult'>NumToChar</th><th class='convResult'>NumToMoney</th></tr>";
		var trash = $(".fa-trash-o");
		if (historyRecord.length > 0) {
			if (trash.css("visibility") === "hidden") {
				trash.css("visibility", "visible");
			}
			if (historyRecord.length > 50) {
				sIndex = historyRecord.length - 50;
				historyRecord = historyRecord.slice(sIndex);
			}
			$.each(historyRecord, function (index, item) {
				tableContent += "<tr><td class='index'>" + (index + 1) + "</td><td class='mode'>" + item.conversionMode + "</td><td class='_num'>" + item.num + "</td><td class='convResult'>" + item.numToChar + "</td><td class='convResult'>" + item.numToMoney + "</td></tr>";
			});
			tableDom = "<table class='table'>" + tableContent + "</table>";
			//console.log(tableDom);
			historyInfo.html(tableDom);
		} else {
			trash.css("visibility", "hidden");
			information = "<p class='info'>There is no conversion record yet.</p>";
			historyInfo.html(information);
		}
	}
	
	$(".fa-history").click(function () {
		var conversionHistory = $(".conversion_history");
		if (conversionHistory.css("display") === "none") {
			$(".right_main").hide();
			conversionHistory.show();
			readHistory();
		} else {
			$(".right_main").show();
			conversionHistory.hide();
			$(".fa-trash-o").css("visibility", "hidden");
		}
	});
	
	//1.1版本新增清除历史记录
	
	$(".fa-trash-o").click(function () {
		var params = {
			message: 'Are you sure to clear all history records?',
			title: 'Confirm Information',
			buttons: ['OK', 'Cancel'],
			alertType: "Alert"
		};
		var returnValue = BS.b$.Notice.alert(params);
		if (returnValue === 0) {
			$(".fa-trash-o").css("visibility", "hidden");
			historyRecord = [];
			window.localStorage.clear();
			readHistory();
		} else {
			return;
		}
	});
	
	//1.1版本新增 library数据管理  根据币种显示当前币种的library
	function loadLibrary() {
		var lanMode = $(".money-subtitle").text(); //获取当前币种
		var tbody = $(".library_table").find("tbody");
		tbody.empty();
		//加载 library  管理库
		$.ajax({
			url: "https://raw.githubusercontent.com/Romanysoft/Ref_LAB/master/apps/NumberHelper/db/lib.data.money.format.json",
			type: 'GET',
			dataType: "json",
			beforeSend: function () {
				$(".loading").show();
			},
			complete: function () {
				$(".loading").hide();
			},
			success: function (json) {
				var data = json.data;
				$.each(data, function (index, item) {
					if (item.Mode === lanMode) {
						tbody.append("<tr><td class='l_mode'>" + item.Mode + "</td><td class='l_format'>" + item.Format + "</td><td class='l_example'>" + item.Example + "</td></tr>")
					}
				})
			}
		})
		
	}
	
	$(".libraryTab").click(function () {
		$(".custom_area").hide();
		$(".custom_info").hide();
		$(".library_area").show();
		loadLibrary();
	});
	
	$(".customTab").click(function () {
		$(".custom_area").show();
		$(".custom_info").show();
		$(".library_area").hide();
	})
	
});