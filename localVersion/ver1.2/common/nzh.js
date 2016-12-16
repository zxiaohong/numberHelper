/* 
 待优化点
 转金额规则规范化 参考 http://baike.baidu.com/link?url=lqGf7GrSnMPYvmrb4qMP_yS9k7aATfDidjsAC3eHv7Sxm76_hbamjuLaZH_g74n0Mr-a9CwIy6ekOIEK3Lt-G_
 */
(function (name, factory) {
	if (typeof process === "object" && typeof module === "object" && typeof module.exports) {
		module.exports = factory();
	} else if (typeof define === 'function' && (define.amd || define.cmd)) {
		define([], factory);
	} else if (typeof window !== "undefined" || typeof self !== "undefined") {
		var global = typeof window !== "undefined" ? window : self;
		global[name] = factory();
	} else {
		throw new Error("加载 " + name + " 模块失败！，请检查您的环境！")
	}
}('Nzh', function () {
	var langs = {
		//中文小写
		s: {
			ch: '零一二三四五六七八九'
			, ch_u: '个十百千万亿'
			, other: '负点'
		},
		//中文大写
		b: {
			ch: '零壹贰叁肆伍陆柒捌玖'
			, ch_u: '个拾佰仟万亿'
			, other: '负点'
			, m_t: '人民币'
			, m_z: '整'
			, m_u: '元角分'
		},
		//繁体小写
		s_hk: {
			ch: '零一二三四五六七八九'
			, ch_u: '個十百千萬億'
			, other: '負點'
		},
		//繁体大写
		b_hk: {
			ch: '零壹貳參肆伍陸柒捌玖'
			, ch_u: '個拾佰仟萬億'
			, other: '負點'
			, m_t: '$'
			, m_z: '整'
			, m_u: '圓角分'
		},
		//日文
		
		s_jp: {
			ch: '零壱弐参肆伍陸漆捌玖'
			, ch_u: '個拾佰仟萬億'
			, other: '負點'
		},
		b_jp: {
			ch: '0123456789'
			, ch_u: ','
			, other: '-.'
			, m_t: '¥'
			, m_z: '-'
			, m_u: ''
		}
	};
	var regs = {
		number: /^([+-])?0*(\d+)(\.(\d+))?$/
		, number_e: /^([+-])?0*(\d+)(\.(\d+))?e(([+-])?(\d+))$/i  //科学计数法
		, is10to19: /^1\d$/
	};
	
	function unshift0(arr, n) {
		if (n == null) n = 1;
		for (; n--;) arr.unshift(0); //在数组前端添加一项0，并返回新数组的长度
	}
	
	function centerarr(barr, sarr) {
		//将barr数组的前sarr.length项替换为sarr中的元素
		for (var i = 0; i < sarr.length; i++) {
			barr.splice(i, 1, sarr[i]);//替换barr中的元素
		}
		//删除sarr中的所有元素，sarr=[],返回另外一个数组其中元素和sarr中的元素相同
		sarr.splice(0, sarr.length);
		
		if (arguments.length > 2) {
			var r = [].slice.call(arguments, 2);
			r.unshift(barr);
			centerarr.apply(null, r);
		}
		return barr;
	}
	
	//科学记数法转10进制
	function e2ten(num) {
		var result = regs.number_e.exec(num.toString());
		if (!result) return num;
		var zs = result[2]            //对应小数点前的整数部分(\d+)
			, xs = result[4] || ""     //对应小数点后，e之前的部分
			, e = result[5] ? +result[5] : 0;  //  对应e之后的幂次部分
		// zs,xs,e
		var zs_a = zs.split(""); //把zs分割成字符串数组 参数为(""),每个字符之间被分割
		var xs_a = xs.split("");
		if (e > 0) {
			if (xs_a.length <= e) {
				xs_a.push((new Array(e - xs_a.length + 1)).join("0"));
				zs_a = zs_a.concat(xs_a);
				xs_a = [];
			} else {
				zs_a = zs_a.concat(xs_a.splice(0, e));
			}
		} else {
			if (zs_a.length <= -e) {
				zs_a.unshift((new Array(-e - zs_a.length + 1)).join("0"));
				xs_a = zs_a.concat(xs_a);
				zs_a = [];
			} else {
				xs_a = zs_a.splice(zs_a.length + e).concat(xs_a);
			}
		}
		zs = zs_a.length ? zs_a.join("") : "0";
		xs = xs_a.length ? xs_a.join("") : "";
		return (result[1] == "-" ? "-" : "") + zs + (xs ? "." + xs : "");
	}
	
	
	function zero_comm(str, char_0, type) {
		str = str.split("");
		if (!type || type == "$") {
			for (var i = str.length; i--;) {
				if (str[i] == char_0) {
					str[i] = ""
				} else {
					break;
				}
			}
		}
		if (!type || type == "nto1") {
			var mark = false;
			for (var i = 0; i < str.length; i++) {
				if (str[i] == char_0) {
					if (mark) str[i] = "";
					mark = true;
				} else {
					mark = false;
				}
			}
		}
		return str.join('');
	}
	
	function getNumbResult(num) {
		var result = regs.number.exec(num.toString());
		if (!result && regs.number_e.test(num.toString())) {
			result = regs.number.exec(e2ten(num.toString()))
		}
		if (result) {
			return {
				int: result[2],
				decimal: result[4],
				minus: result[1] == "-",
				num: result.slice(1, 3).join('')
			}
		}
	}
	
	function toCL(num, m, ww, dg) {
		var result = getNumbResult(num);
		if (!result) {
			return num;
		}
		var ch = this.ch
			, ch_u = this.ch_u
			, ch_o = this.other
			, n0 = ch.charAt(0)  //返回指定位置的字符,这里返回第一个字符" 0 "、"零 "
			, reg = new RegExp(n0 + "*$")   //匹配包含n0的字符串
			, reg1 = new RegExp(n0 + "+", 'g')  //全局匹配包含n0的字符串
			, reg2 = new RegExp("0*$");  //匹配以0结尾的字符串
		//,reg3 = new RegExp(ch_u.charAt(5)+'{2}')
		var _int = result.int
			, _decimal = result.decimal
			, _minus = result.minus;
		var int = ""
			, dicimal = ""
			, minus = _minus ? ch_o.charAt(0) : ''; //符号位
		
		//转换小数部分
		if (_decimal) {
			_decimal = _decimal.replace(reg2, ""); //去除尾部0
			for (var x = 0; x < _decimal.length; x++) {   //小数部分逐个匹配成ch中的数字形式
				dicimal += ch.charAt(+_decimal.charAt(x));
			}
			dicimal = dicimal ? ch_o.charAt(1) + dicimal : "";
		}
		
		//转换整数部分
		
		//一位整数
		if (_int.length == 1) return minus + ch.charAt(+_int) + dicimal;
		
		//两位整数
		if (m && _int.length == 2 && _int.charAt(0) === "1") { //整数部分为10~19的数字处理
			//10的口语化处理
			int = ch_u.charAt(1);// 十或拾
			int += _int.charAt(1) == "0" ? "" : ch.charAt(+_int.charAt(1)); //如果个位数字为0 就返回"十"，如果个位数字不为0，则返回"十几"
		} else if (_int.length <= 4) {
			//小于四位
			for (var i = 0, n = _int.length; n--;) {
				var _num = _int.charAt(i++);
				int += ch.charAt(+_num) + (+_num && n ? ch_u.charAt(n) : '')
			}
		} else {
			//大数递归
			var d = _int.length / 4 >> 0
				, y = _int.length % 4
				, es = y || 4;
			while (y == 0 || !ch_u.charAt(3 + d)) {
				y += 4;
				d--;
			}
			int = toCL.call(this, _int.substr(0, y), m, ww, 1) + ch_u.charAt(3 + d)
				+ (~(_int.substr(y - 1, 2).indexOf("0")) ? n0 : '')
				+ toCL.call(this, _int.substr(y), false, ww, 1)
		}
		//console.log(int);
		//int = int.replace(reg1,n0).replace(reg,'');
		int = zero_comm(int, n0);
		
		// int = zero_comm(int,n0,'$');
		if (!dg && ww && ch_u.length > 5) {
			var dw_w = ch_u.charAt(4), dw_y = ch_u.charAt(5);
			var lasty = int.lastIndexOf(dw_y);
			if (~lasty) {
				int = int.substring(0, lasty).replace(new RegExp(dw_y, 'g'), dw_w + dw_w) + int.substring(lasty);
				
			}
		}
		return minus + int + dicimal;
	}
	
	//转日文金额写法 "￥ xx,xxx,xxx.xx -"
	function formatJPNum(str) {
		var newStr = "";
		var count = 0;
		
		if (str.indexOf(".") == -1) {  //不存在小数
			for (var i = str.length - 1; i >= 0; i--) {
				if (count % 3 == 0 && count != 0) {
					newStr = str.charAt(i) + "," + newStr;
				} else {
					newStr = str.charAt(i) + newStr;
				}
				count++;
			}
			str = "￥" + newStr + ".00" + " -"; //自动补小数点后两位
		}
		else {
			for (var i = str.indexOf(".") - 1; i >= 0; i--) {
				if (count % 3 == 0 && count != 0) {
					newStr = str.charAt(i) + "," + newStr;
				} else {
					newStr = str.charAt(i) + newStr; //逐个字符相接起来
				}
				count++;
			}
			str = "￥" + newStr + (str + "00").substr((str + "00").indexOf("."), 3) + " -";
			
		}
		return str;
	}
	
	//中文转阿拉伯数字
	function unCL(cnnumb) {
		var result = cnnumb.split(this.other.charAt(1));//将cnmunb从点（點或.）分割成字符数组 整数部分和小数部分
		var _int = result[0].replace(this.other.charAt(0), "")   //整数部分，将"负"替换为""
			, _decimal = result[1]    //小数部分
			, _minus = !!~result[0].indexOf(this.other.charAt(0));
		
		var dw_w = this.ch_u.charAt(4), dw_y = this.ch_u.charAt(5);
		_int = _int.replace(new RegExp(dw_w + "{2}", "g"), dw_y); //把"万万"替换为"亿"
		
		var cnarr = _int.split('');
		var rnum = 0, num = 0, _num = 0, dw = 0, maxdw = 0;
		var rnum_a = [], num_a = [], _num_a = [];
		
		function wei(u) {
			return u >= 5 ? (u - 4) * 4 + 4 : u;
		}
		
		for (var i = 0; i < cnarr.length; i++) {
			var chr = cnarr[i];
			var n = 0, u = 0;
			if (~(n = this.ch.indexOf(chr))) {
				//_num = _num*10 + n;
				_num_a.unshift(n);
			} else if (~(u = this.ch_u.indexOf(chr))) {
				if (dw > u) {//正常情况
					unshift0(_num_a, wei(u));
					centerarr(num_a, _num_a);
				} else if (u >= maxdw) {//后跟大单位
					maxdw = u;
					if (i == 0) _num_a = [1];
					centerarr(rnum_a, num_a, _num_a);
					unshift0(rnum_a, wei(u));
				} else {
					dw = u;
					centerarr(num_a, _num_a);
					unshift0(num_a, wei(u));
				}
			} else {
				//return cnnumb;
			}
		}
		centerarr(rnum_a, num_a, _num_a).reverse();
		var decimal = 0;
		if (_decimal) {
			rnum_a.push('.');
			decimal = '0.';
			for (var i = 0; i < _decimal.length; i++) {
				decimal += this.ch.indexOf(_decimal.charAt(i));
				rnum_a.push(this.ch.indexOf(_decimal.charAt(i)));
			}
			decimal = +decimal;
			
		}
		rnum = (rnum + num + _num + decimal) * (_minus ? -1 : 1);
		return rnum_a.join('');
	}
	
	function toMoney(num, ww) {
		var result = getNumbResult(num);
		if (!result) {
			//return '参数错误!'
			return num;
		}
		var _num = result.num
			, _decimal = result.decimal;
		
		var xs_str = _decimal ? '' : this.m_z;
		if (_decimal) {
			for (var i = 0; i < this.m_u.length - 1; i++) {
				xs_str += _decimal.charAt(i) == 0 ? '' : toCL.call(this, _decimal.charAt(i)) + this.m_u.charAt(i + 1);
			}
		}
		if (_num != "0" || xs_str == this.m_z || xs_str == '') {
			return this.m_t + toCL.call(this, _num, null, ww) + this.m_u.charAt(0) + xs_str;
		} else {
			return this.m_t + xs_str;
		}
	}
	
	function getNzhObjByLang(lang_s, lang_b) {
		return {
			encodeS: function (num, m, ww) {
				return toCL.call(lang_s, num, (m == null ? true : m), (ww == null ? Nzh._y2ww : ww));
			},
			encodeB: function (num, m, ww) {
				return toCL.call(lang_b, num, m, (ww == null ? Nzh._y2ww : ww));
			},
			formatJPNum: function (num, m, ww) {
				return formatJPNum.call(lang_b, num);
			},
			decodeS: function (str) {
				return unCL.call(lang_s, str);
			},
			decodeB: function (str) {
				return unCL.call(lang_b, str);
			},
			toMoney: function (num, ww) {
				return toMoney.call(lang_b, num, (ww == null ? Nzh._y2ww : ww));
			}
		}
	}
	
	var Nzh = function (lang) {
		this.lang = lang;
	};
	Nzh.prototype = {
		encode: function () {
			return toCL.apply(this.lang, arguments)
		}
		, decode: function () {
			return unCL.apply(this.lang, arguments)
		}
		, toMoney: function () {
			return toMoney.apply(this.lang, arguments)
		}
	};
	Nzh.langs = langs;
	Nzh._y2ww = true; //默认启用 "万万"
	Nzh.cn = getNzhObjByLang(langs.s, langs.b);
	Nzh.hk = getNzhObjByLang(langs.s_hk, langs.b_hk);
	Nzh.jp = getNzhObjByLang(langs.s_jp, langs.b_jp);
	return Nzh;
}));
