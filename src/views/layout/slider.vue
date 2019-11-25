<template>
	<el-aside width="200px">
		<div class="slider-logo">
            <img src="../../assets/logo.png" class="logo" alt="">
            <span class="system_nam">信息发布系统</span>
        </div>
    	<el-menu
	      	class="sider-menu"
	      	unique-opened
	      	@open="open"
	      	ref='menu'
	      	background-color='#001529'
            text-color='#cdcdcd'
            active-text-color='#fff'
	      	>
	      	<el-menu-item index="1-0-1" @click='all' v-if='isRender("/all")'>  
	        	<span slot="title" :style='$route.query.category==0?"color:#fff;":"#303133"'>全部</span>
	      	</el-menu-item>
      		<el-submenu :index="String(item.id)+'-'+index" v-for='item,index of menu' :key='index'>
		        <template slot="title">
		         	<!-- <i class="el-icon-document"></i> -->
		          	<span :style='$route.query.category==item.id?"color:#fff;":"#303133"'>{{item.category}}</span>
		        </template>
		        <el-submenu :index="String(submenu.id)+'-'+i" v-for='submenu,i of item.childCategory' :key='i'>
		          	<template slot="title"><span :style='$route.query.category==submenu.id?"color:#fff;":"#303133"'>{{submenu.category}}</span></template>
		          	<el-menu-item :index='String(endmenu.id)+"-"+endindex' v-for='endmenu,endindex of submenu.childCategory' :key='endindex' @click='handleclick(endmenu.id,endindex)'>{{endmenu.category}}</el-menu-item>
		        </el-submenu>
		    </el-submenu>
		    <el-menu-item index="1-1-1" @click='$router.push({path:"/classify"})' v-if='isRender("/classify")'>
	        	<span slot="title">分类管理</span>
	      	</el-menu-item>
		    <el-menu-item index="1-2-1" @click='$router.push({path:"/release"})' v-if='isRender("/release")'>
	        	<span slot="title">信息发布</span>
	      	</el-menu-item>
    	</el-menu>
  	</el-aside>
</template>
<script>
	import api from '../../api/api'
	import utils from '../../utils/utils'
	import { mapState } from 'vuex'
	export default{
		name:'',
		data(){
			return {
				menu:[],
				defaultActive:''
			}
		},
		props: ['collapse'],
		watch:{
			$route(to,from){
				// this.defaultActive = String(to.query.category);
			}
		},
		computed:{
			...mapState(['userMenus'])
		},
		methods:{
			isRender(key){
				return this.userMenus.includes(key);
			},
			open(index,indexPath){
				if(indexPath.length===1){
					let oIndex = index.split("-")[1];
					if(!this.menu[oIndex].childCategory.length){
						this.$refs.menu.close(this.defaultActive);
						this.defaultActive = index;
						this.$refs.menu.open(index);
						this.$router.push({path:"/system",query:{category:this.menu[oIndex].id}});
					}
				}else if(indexPath.length===2){
					let oIndex1 = indexPath[0].split("-")[1];
					let oIndex2 = indexPath[1].split("-")[1];
					if(!this.menu[oIndex1].childCategory[oIndex2].childCategory.length){
						this.$refs.menu.close(this.defaultActive);
						this.defaultActive = index;
						this.$refs.menu.open(index);
						this.$router.push({path:"/system",query:{category:this.menu[oIndex1].childCategory[oIndex2].id}});
					}
				}
			},
			handleclick(id,index){
				this.$refs.menu.close(this.defaultActive);
				this.$router.push({path:"/system",query:{category:id}});
				this.defaultActive = id+'-'+index;
			},
			all(){
				this.$router.push({path:"/system",query:{category:0}});
				this.defaultActive = '1-0-1';
			},
			getMenu(){
				api('/category/getCategoryList','GET',{
					workCode:utils.getCookie('username'),
				})
				.then(res=>{
					if(res.data.success){
						this.menu = res.data.data;
						if(this.$route.path=='/system'||this.$route.path=='/'){
							if(this.isRender('/all')){
								this.defaultActive = '1-0-1';
								this.$router.push({path:"/system",query:{category:0}});
							}else{
								this.defaultActive = String(res.data.data[0].childCategory[0].childCategory[0].id);
								this.$router.push({path:"/system",query:{category:res.data.data[0].childCategory[0].childCategory[0].id}});
							}
						}else if(this.$route.path=='/release'){
							if(this.isRender('/release')){
						    	this.defaultActive = '1-2-1';
							}
						}else if(this.$route.path=='/classify'){
						    if(this.isRender('/classify')){
						    	this.defaultActive = '1-1-1';
							}
						}

					};
				})
			}
		},
		mounted(){
			this.getMenu();
		}
	}
</script>
<style>
	.el-menu-item.is-active{
	    background:#1890ff!important
	}
	.el-aside .sider-menu {
	    border: 0;
	}
	.el-aside {
	    color: #333;
	    background:#001529;
	    height: 100%;
	}
	.slider-logo{
	    position: relative;
	    width: 100%;
	    height: 50px;
	    line-height: 50px;
	    background: #001529;
	    padding: 0 20px;
    	overflow: hidden;
	}
	.slider-logo .logo{
	    width: 32px;
	    height: 32px;
	    vertical-align: middle;
	    margin-right: 12px;
	}
	.system_nam{
	    display: inline-block;
	    margin: 0;
	    color: #fff;
	    font-weight: 600;
	    line-height: 50px;
	    font-size: 14px;
	    font-family: Avenir,Helvetica Neue,Arial,Helvetica,sans-serif;
	    vertical-align: middle;
	}
	.side-close{
	    width: 78px !important;
	    transition: all .3s linear;
	}
	.side-open{
	    width: 200px !important;
	    transition: all .3s linear;
	}
</style>

























