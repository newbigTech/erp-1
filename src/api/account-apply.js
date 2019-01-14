/**
 * Created by Administrator on 2017/8/23.
 */
import {http} from '../lib/http-plus';
//获取账号基础信息列表
export const url_get_account = "get|account-apply";
export const api_get_account = function (data) {
    return http(Url2(url_get_account), data);
};

//获取编辑账号基础信息
// export const url_edit_account = "get|account-apply/:id/edit";
// export const api_edit_account = function (id) {
//     return http(Url2(url_edit_account, {id:id}));
// };

//新增账号基础信息
export const url_add_account = "post|account-apply";
export const api_add_account = function (data) {
    return http(Url2(url_add_account), data);
};

//更新账号基础信息
export const url_updata_account = "put|account-apply/:id";
export const api_updata_account = function (id, data) {
    return http(Url2(url_updata_account, {id:id}), data);
};

//更改账号状态
export const url_updata_account_status = "post|account-apply/batch/update";
export const api_updata_account_status = function (data) {
    return http(Url2(url_updata_account_status), data);
};

//获取状态列表
export const url_get_account_status = "get|account-apply/status/info";
export const api_get_account_status = function (data) {
    return http(Url2(url_get_account_status), data);
};

//获取状态btn
export const url_get_account_basics_changes = "get|account-apply/changes";
export const api_get_account_basics_changes = function (data) {
    return http(Url2(url_get_account_basics_changes), data);
};

//获取成员管理信息
export const url_get_account_users = "get|account-users";
export const api_get_account_users = function (data) {
    return http(Url2(url_get_account_users), data);
};

//保存成员管理信息
export const url_post_account_users = "post|account-users";
export const api_post_account_users = function (data) {
    return http(Url2(url_post_account_users), data);
};

//获取密码
export const url_get_password = "get|account-apply/password";
export const api_get_password = function (data) {
    return http(Url2(url_get_password), data);
};

//获取paypal的账号
export const url_get = "get|paypal-account";
export const api_get = function (data) {
    return http(Url2(url_get), data);
};

//获取服务器已绑定的账号列表
export const url_get_already = "get|account-apply/already-bind";
export const api_get_already = function (data) {
    return http(Url2(url_get_already), data);
};



//新*获取注册状态
export const api_get_account_apply_status = ()=>{
    return http("get|account-apply/status");
};

//新*账号申请基本信息（添加）
export const api_add_account_info = (data)=>{
    return http("post|account-apply",data);
};

//新*账号申请基本信息（更新编辑）
export const url_update_base_info = "put|account-apply/:id";
export const api_update_base_info =(id,param)=> {
    return http(Url2(url_update_base_info,{id:id}),param);
};

//新*账号申请列表编辑
export const url_account_apply_list_edit = "get|account-apply/:id";
export const api_account_apply_list_edit =id=> {
    return http(Url2(url_account_apply_list_edit,{id:id}));
};

//新*账号申请审核
export const url_update_audit = "put|account-apply/:id/audit";
export const api_update_audit =(id,param)=> {
    return http(Url2(url_update_audit,{id:id}),param);
};


export const url_update_registration = "put|account-apply/:id/result";
export const api_update_registration =(id,param)=> {
    return http(Url2(url_update_registration,{id:id}),param);
};


//新*注册信息存
export const url_update_register_info = "put|account-apply/:id/register";
export const api_update_register_info =(id,param)=> {
    return http(Url2(url_update_register_info,{id:id}),param);
};

//新*账号申请日志
export const url_get_operation_log = "get|account-apply/:id/log";
export const api_get_operation_log =(id)=> {
    return http(Url2(url_get_operation_log,{id:id}));
};

//新*作废
export const url_update_nullify_status = "put|account-apply/:id/cancellation";
export const api_update_nullify_status =(id,param)=> {
    return http(Url2(url_update_nullify_status,{id:id}),param);
};




