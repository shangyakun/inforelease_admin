import Vue from 'vue'
import Vuex from 'vuex'
import {asyncRouter} from '../router/asyncRouters.js'
Vue.use(Vuex)
export default new Vuex.Store({
	state:{
		userStatus:false,
		userMenus:[]
	},
	actions:{
		SET_MENUS({commit},menu){
			return new Promise((resolve,reject)=>{
				let arr = [];
				let muensValue = [];
				for(let i=0;i<menu.length;i++){
					muensValue.push(menu[i].menuValue);
				};
				asyncRouter.forEach( (item, index) => {
					if(muensValue.includes(item.path)){
						arr.push(item);
					}
				});
				commit('SET_MENU',muensValue);
				resolve(arr)
			})
		},
	},
	mutations:{
		SET_USER(state){
			state.userStatus = true;
		},
		SET_MENU(state,menu){
			state.userMenus = menu;
		}
	}
})
 
