/**
 * Created by Ian on 2016/12/8.
 */

;
(function (factory) {
	"use strict";
	if (typeof define === "function" && define.amd) {
		define("BS.util", ["jquery"], function () {
			return factory(jQuery || $)
		})
	} else {
		factory(jQuery || $);
	}
	
	if (typeof module === "object" && typeof module.exports === "object") {
		module.exports = factory(jQuery || $)
	}
	
	
}(function ($, undefined) {
	"use strict";
	
	(function ($) {
		window['$'] = $ || {};
		var b$ = {};
		if (window.BS) {
			if (window.BS.b$) {
				b$ = window.BS.b$;
			}
		}
		
		var _u = {
			
			/**
			 * 初始化产品的IAP
			 */
			init: function () {
				/**
				 * Step1: 先要检测是否开启IAP？
				 * Step2：要告知系统哪些插件是可用的
				 *
				 **/
				var enable = b$.IAP.getEnable(); // 检测是否可以开启IAP
				if (enable) {
					b$.IAP.enableIAP({
						productIds: [b$.App.getAppId() + ".plugin.DateTime.Format"],
					}, function (obj) {
						
					});
				}
			},
			
			/**
			 * 获得插件（或者叫商品）的价格
			 *  @param  productId  商品或者插件的ID， 例如： b$.App.getAppId() + ".plugin.DateTime.Format"
			 *  @return "" {String}
			 */
			getPrice: function (productId) {
				if (b$.IAP.getEnable()) {
					return b$.IAP.getPrice(productId);
				}
				
				return "";
			},
			
			/**
			 * 获得插件（或者叫商品）已经购买的数量
			 *  @param  productId  商品或者插件的ID， 例如： b$.App.getAppId() + ".plugin.DateTime.Format"
			 *  @return 0 {Number}
			 */
			getCount: function (productId) {
				if (b$.IAP.getEnable()) {
					return b$.IAP.getUseableProductCount(productId);
				}
				
				return 0;
			},
			
			/**
			 * 恢复购买操作。（对于已经购买的用户，在其他机器上安装，执行此动作，可以激活已经购买的商品或者插件）
			 * @param  CB_success 恢复购买成功回调函数
			 * @param  CB_fail 恢复购买失败回调函数
			 */
			restore: function (CB_success, CB_fail) {
				if (b$.IAP.getEnable()) {
					return b$.IAP.restore(
						function (productList) {
							CB_success && CB_success(productList);
						}, function (info, obj) {
							CB_fail && CB_fail(info, obj);
						});
				}
			},
			
			/**
			 * 激活插件（也叫购买产品）
			 * @param  productId  商品或者插件的ID， 例如： b$.App.getAppId() + ".plugin.DateTime.Format"
			 * @param  quantity  数量
			 * @param  CB_success 购买成功回调函数
			 * @param  CB_fail 购买失败回调函数
			 */
			buy: function (productId, quantity, CB_success, CB_fail) {
				b$.IAP.buyProduct({
						productIdentifier: productId,
						quantity: quantity
					}
					, function (productId, obj) {
						CB_success && CB_success(productId, obj);
					}, function (productId, obj) {
						CB_fail && CB_fail(productId, obj);
					});
			}
		};
		
		window["APP_IAP"] = _u;
		
		//-----------------------------------------------------------------------------------------------------------------
		$(document).ready(function () {
			_u.init();
		});
	}($));
	
	
	return $;
}));
