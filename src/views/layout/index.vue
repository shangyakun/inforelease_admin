<template>
	<div id='wrap'>
		<div class="wrapper">
			<el-container class="e-index">
				<syk-menu :collapse='isCollapse'></syk-menu>
				<el-container>
					<el-header class="navbar">
                        <div class="fold">
                            <i class="el-icon-s-unfold"></i>
                            <!-- <span class="bar-name" style="">{{$route.meta.title}}</span> -->
                        </div>
                    </el-header>
					<router-view/>
				</el-container>
			</el-container>
		</div>
	</div>
</template>
<script>
	import sykMenu from './slider.vue'
	export default {
		name:'layout',
		data(){
			return {
				isCollapse:false,
			}
		},
		components:{
			sykMenu
		},
		
	}
</script>
<style>
	.wrapper{
    	margin: 0 auto;
    	min-width: 1200px;
    	height: 100vh;
	}
	.e-index{
		height:100%;
	}
	.navbar{
	    width: 100%;
	    height: 60px;
	    background: #fff;
	    line-height: 60px;
	    padding: 0 10px;
	}
	.fold {
	    line-height: 60px;
	    font-size: 24px;
	}
	.bar-name{
	    display: inline-block;
	    vertical-align: top;
	    font-size: 16px;
	    margin-left: 10px;
	}
</style>

























