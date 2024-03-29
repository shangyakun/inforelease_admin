import axios from 'axios'
import qs from 'qs'
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});
export default (url, method, data, headers) => {
    axios.defaults.withCredentials=true;
    if(url.indexOf('permission')>=0){
       axios.defaults.baseURL =globalConfig.permissionURL;
       return axios(Object.assign({
            url: url,
            method: method,
            headers,
            data:data
        }))
    }else if(url.indexOf('uploadFile')>=0){
        axios.defaults.baseURL = globalConfig.baseURL;
        return axios(Object.assign({
            url: url,
            method: method,
            headers
        }, method == 'GET' ? { params: data } : { data:data }));
    } else {
        axios.defaults.baseURL = globalConfig.baseURL;
        return axios(Object.assign({
            url: url,
            method: method,
            headers
        }, method == 'GET' ? { params: data } : { data:qs.stringify(data)}));
    };
};