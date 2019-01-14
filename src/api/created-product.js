import {http} from '../lib/http-plus';
export const url_save_goods = 'post|goods-pre-dev';
export const api_save_goods = function(data){
    return http(url_save_goods,data)
}

export const url_get_channel = 'get|goods-pre-dev/channel';
export const api_get_channel = function(){
    return http(url_get_channel)
}
