import store from './store'
import {routes} from './router/asyncRouters'	
import router from './router/index.js'
import api from './api/api'
import utils from './utils/utils'
router.beforeEach((to, from, next) => {
	if(utils.getCookie('username')){
		if(store.state.userStatus){
			next();
		}else{
			var formData = new FormData();
			formData.append('workCode',utils.getCookie('username'));
			formData.append('mark','7aee60ae-01d1-690c-3474-5ef3ee674a5b');
			api('/permission/getMenuByworkCodeAndSystemId','POST',formData,{
				"Content-Type": "multipart/form-data"
			})
			.then(res=>{
				if(res.data.success&&res.data.code===0){
					let data = res.data.data;
					if(!!data){
						data.push({'menuValue':'/edit'},{'menuValue':'/record'})
						store.commit('SET_USER');
						store.dispatch('SET_MENUS',data).then(res=>{
							routes[0].children = res;
							router.addRoutes(routes);
						});
						next('/');
					}
				}
			});
		};
	}else{
		
	}
});