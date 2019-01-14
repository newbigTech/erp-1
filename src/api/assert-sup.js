/**
 * Created by Alison on 2017/1/9.
 * 更换api传参方式  Alison  2017/6/28
 */
import {http} from '../lib/http-plus';

//供应商列表
export const url_supplier = 'get|supplier';
export const api_supplier = function (data) {
    return http(url_supplier,data,{contentType:'application/x-www-form-urlencoded', timeout:60000});
}
//供应商等级
export const url_supplier_Level = "get|supplier/level/info";
export const api_supplier_Level = function () {
    return http(url_supplier_Level);
}
//发票类型
export const url_get_invoice = "get|supplier/invoice/info";
export const api_get_invoice = function () {
    return http(url_get_invoice);
}
//支付方式
export const url_supplier_payment = "get|supplier/payment/info";
export const api_supplier_payment = function () {
    return http(url_supplier_payment);
}
//结算方式
export const url_get_balance = "get|supplier/balance/info";
export const api_get_balance = function () {
    return http(url_get_balance);
}
//获取省市区信息
export const url_supplier_area = "get|supplier/area/info";
export const api_supplier_area = function () {
    return http(url_supplier_area);
}
//新增供应商
export const url_add_supplier = "post|supplier";
export const api_add_supplier = function (data) {
    return http(url_add_supplier,data);
}
//删除
export const url_delete_supplier = "delete|supplier/:id";
export const api_delete_supplier = function (id) {
    return http(Url2(url_delete_supplier,{id:id}));
}
//查看
export const url_look_supplier = "get|supplier/:id";
export const api_look_supplier = function (id) {
    return http(Url2(url_look_supplier,{id:id}));
}
//获取洽谈记录
export const url_supplier_discuss_record = 'get|supplier-discuss-record';
export const api_supplier_discuss_record  = function (data) {
    return http(url_supplier_discuss_record ,data)
};
//获取是否贴套牌
export const url_supplier_get_label_deck = 'get|supplier/get-label-deck';
export const api_supplier_get_label_deck  = function (data) {
    return http(url_supplier_get_label_deck ,data)
};
//编辑
export const url_edit_supplier = "get|supplier/:id/edit";
export const api_edit_supplier = function (id) {
    return http(Url2(url_edit_supplier,{id:id}));
};
//更新
export const url_update_supplier = "put|supplier/:id";
export const api_update_supplier = function (id,data) {
    return http(Url2(url_update_supplier,{id:id}),data);
};
//审核供应商
export const url_change_states = "post|supplier/status";
export const api_change_states = function (data) {
    return http(url_change_states,data);
};
//获取供应商
export const url_get_supplier = 'get|supplier-offer/supplier';
export const api_get_supplier = function (data) {
    return http(url_get_supplier,data)
};
// 获取我的模板
export const url_goods_export_template = "get|export-template";
export const api_goods_export_template = function (data) {
    return http(url_goods_export_template,data);
};
//导出
export const url_export_supplier = 'post|supplier/export';
export const api_export_supplier = function (data) {
    return http(url_export_supplier,data)
};
// 获取可供选择的导出字段
export const url_supplier_fields = "get|supplier/export-fields";
export const api_supplier_fields = function (data) {
    return http(url_supplier_fields,data);
};
//采购记录导出
export const url_purchase_order_export = 'post|purchase-order/export';
export const api_purchase_order_export = function (data) {
    return http(url_purchase_order_export,data)
};
//导出fuiou
export const url_supplier_export_fuiou = 'post|supplier/export-fuiou';
export const api_supplier_export_fuiou = function (data) {
    return http(url_supplier_export_fuiou,data)
};
//供应商类型 supplier/type/info
export const url_supplier_type = 'get|supplier/type/info';
export const api_supplier_type = function (data) {
    return http(url_supplier_type,data)
};
//交易类型 supplier/transaction/info
export const url_supplier_transaction = 'get|supplier/transaction/info';
export const api_supplier_transaction = function (data) {
    return http(url_supplier_transaction,data)
};
//获取操作日志
export const url_get_supplier_id_log = 'get|supplier/:id/log';
export const api_get_supplier_id_log = function (id) {
    return http(Url2(url_get_supplier_id_log,{id}))
};
//获取分类列表
export const url_get_categories = "get|categories";
export const api_get_categories = function(){
    return http(url_get_categories);
};
// 获取 开发员
export const url_publish_development = "get|user/development/staffs";
export const api_development  = function() {
    return http(Url2(url_publish_development), {content:""});
};
//获取采购员
export const url_get_buyer = "get|user/buyer/staffs";
export const api_get_buyer = function(data){
    return http(url_get_buyer,data);
};
//修改采购员
export const url_supplier_change_purchaser = 'put|supplier/change-purchaser';
export const api_supplier_change_purchaser = function (data) {
    return http(url_supplier_change_purchaser,data)
};
//供应商采购记录
export const url_get_supplier_get_supplier_purchase = 'get|supplier/get-supplier-purchase';
export const api_get_supplier_get_supplier_purchase = function (data) {
    return http(url_get_supplier_get_supplier_purchase,data)
};

