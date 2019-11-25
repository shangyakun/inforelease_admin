<template>
	<div class="container" >
  		<div class="header clear">
  			<span style="">分类管理</span>
  			<el-button class='fr' type="primary" @click='addLevel1'>新增一级分类</el-button>
  		</div>
  		<div class="main">
  			<ul class="list">
  				<li class="t_header clear">
  					<span class="fl" style='font-size: 14px;'>分类列表</span>
  					<span class="fr" style='margin-right: 40px;font-size: 14px;'>操作</span>
  				</li>
  				<li v-for='item,index of tree' :key='index'>
					<div class="item level1 clear" @click='openMenu(index)'>
						<img src="../../assets/arrow_right.png"  :class='item.open?"arrow_down":"arrow"' alt="">
	  					<span class="">{{item.category}}</span>
	  					<span class="fr" style="height: 30px;line-height: 30px;">
	  						<a href="javascript:;" style='color:#202020;margin:0 10px;font-size: 14px;' @click.stop='moveUp(index)'>上移</a>
	  						<a href="javascript:;" style='color:#202020;margin:0 10px;font-size: 14px;' @click.stop='moveDown(index)'>下移</a>
	  						<a href="javascript:;" style='color:#202020;margin:0 10px;font-size: 14px;' @click.stop='addMenu(index)'>新增</a>
	  						<a href="javascript:;" style='color:#202020;margin:0 10px;font-size: 14px;' @click.stop='updateName(index)'>编辑</a>
	  						<a href="javascript:;" style='color:#202020;margin:0 10px;font-size: 14px;' @click.stop='deleteMenu(index)'>删除</a>
	  					</span>
	  				</div>
	  				<ul class="opens" :style='item.open?"height:auto;":"height:0;"'>
	  					<li v-for='level2,level2Index of item.childCategory' :key='level2Index'>
	  						<div class="item level2 clear" @click='openLevle2Menu(index,level2Index)'>
								<img src="../../assets/arrow_right.png"  :class='level2.open?"arrow_down":"arrow"' alt="">
			  					<span class="">{{level2.category}}</span>
			  					<span class="fr" style="height: 30px;line-height: 30px;">
			  						<a href="javascript:;" style='color:#202020;margin:0 10px;font-size: 14px;' @click.stop='moveUp(index,level2Index)'>上移</a>
			  						<a href="javascript:;" style='color:#202020;margin:0 10px;font-size: 14px;' @click.stop='moveDown(index,level2Index)'>下移</a>
			  						<a href="javascript:;" style='color:#202020;margin:0 10px;font-size: 14px;' @click.stop='addMenu(index,level2Index)'>新增</a>
			  						<a href="javascript:;" style='color:#202020;margin:0 10px;font-size: 14px;' @click.stop='updateName(index,level2Index)'>编辑</a>
			  						<a href="javascript:;" style='color:#202020;margin:0 10px;font-size: 14px;' @click.stop='deleteMenu(index,level2Index)'>删除</a>
			  					</span>
			  				</div>
			  				<ul class="opens" :style='level2.open?"height:auto;":"height:0;"'>
			  					<li v-for='level3,level3Index of level2.childCategory' :key='level3Index'>
			  						<div class="item level3 clear">
					  					<span class="">{{level3.category}}</span>
					  					<span class="fr" style="height: 30px;line-height: 30px;">
					  						<a href="javascript:;" style='color:#202020;margin:0 10px;font-size: 14px;' @click.stop='moveUp(index,level2Index,level3Index)'>上移</a>
					  						<a href="javascript:;" style='color:#202020;margin:0 10px;font-size: 14px;' @click.stop='moveDown(index,level2Index,level3Index)'>下移</a>
					  						<!-- <a href="javascript:;" v-if='level3Index!=level2.childCategory.length-1' style='color:#f00;margin:0 10px;font-size: 14px;' @click.stop='addMenu(index,level2Index,level3Index)'>新增</a> -->
					  						<a href="javascript:;" style='color:#ccc;cursor:not-allowed;margin:0 10px;font-size: 14px;'>新增</a>
					  						<a href="javascript:;" style='color:#202020;margin:0 10px;font-size: 14px;' @click.stop='updateName(index,level2Index,level3Index)'>编辑</a>
					  						<a href="javascript:;" style='color:#202020;margin:0 10px;font-size: 14px;' @click.stop='deleteMenu(index,level2Index,level3Index)'>删除</a>
					  					</span>
					  				</div>
			  					</li>
			  				</ul>
	  					</li>
	  				</ul>
  				</li>
  			</ul>
  		</div>
  		<el-dialog
		  title="请输入要增加分类名称"
		  :visible.sync="dialogVisible"
		  width="30%"
		  >
		  <span style="line-height: 40px;color: #F10D3B">添加分类后会重新加载网页！</span>
		  <el-input v-model="title" maxlength='10' placeholder="请输入分类名称"></el-input>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addFun">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="提示"
		  :visible.sync="deleteDialog"
		  width="30%"
		  >
		  <span>删除后会重新加载页面，确定要删除该分类吗？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="deleteDialog = false">取 消</el-button>
		    <el-button type="primary" @click="deleteFun">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="提示"
		  :visible.sync="moveTip"
		  width="30%"
		  >
		  <span>移动成功后会重新加载网页，确定移动</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="moveTip = false">取 消</el-button>
		    <el-button type="primary" @click="comfirm">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="提示"
		  :visible.sync="updateDialog"
		  width="30%"
		  >
		  <span style="line-height: 40px;color: #F10D3B">添加分类后会重新加载网页！</span>
		  <el-input v-model="title" maxlength='10' placeholder="请输入分类名称"></el-input>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="updateDialog = false">取 消</el-button>
		    <el-button type="primary" @click="updateClassTitle">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>
<script>
	import api from '../../api/api'
	import utils from '../../utils/utils'
	export default {
		name:'',
		data(){
			return {
				updateDialog:false,
				moveTip:false,
				dialogVisible:false,
				deleteDialog:false,
				tree:[],
				categoryId:'',
				title:'',
				moveType:null,
			};
		},
		methods:{
			comfirm(){//确认上移或者下移
				switch (this.moveType) {
					case 1:
						this.moveUpFun();
						break;
					case 2:
						this.moveDownFun()
						break;
					default:
						break;
				}
			},
			addLevel1(){
				this.dialogVisible = true;
				this.categoryId = 0;
			},
			openLevle2Menu(i,index){
				this.tree[i].childCategory[index].open = !this.tree[i].childCategory[index].open;
			},
			openMenu(i){
				this.tree[i].open = !this.tree[i].open;
			},
			moveUpFun(){//上移时调用的function
				api("/category/upCategory",'POST',{
					categoryId:this.categoryId,
				},{
					'Content-Type': 'application/x-www-form-urlencoded'
				})
				.then(res=>{
					if(res.data.success){
						this.getMenu();
						this.$message({
							type:'success',
							message:"移动成功"
						});
						this.moveTip = false;
						setTimeout(()=>{
							this.$router.go(0);
						},500)
					}
				})
			},
			moveDownFun(){//下移时调用的function
				api("/category/downCategory",'POST',{
					categoryId:this.categoryId,
				},{
					'Content-Type': 'application/x-www-form-urlencoded'
				})
				.then(res=>{
					if(res.data.success){
						this.getMenu();
						this.$message({
							type:'success',
							message:"移动成功"
						});
						this.moveTip = false;
						setTimeout(()=>{
							this.$router.go(0);
						},500)
					}
				})
			},
			addFun(){//新增时调用的function
				if(this.title==''){
					this.$message({
						type:'warning',
						message:"请输入分类名称"
					});
					return;
				};
				api("/category/addCategory",'POST',{
					categoryId:this.categoryId,
					categoryName:this.title,
					workCode:utils.getCookie('username')
				},{
					'Content-Type': 'application/x-www-form-urlencoded'
				})
				.then(res=>{
					if(res.data.success){
						this.getMenu();
						this.$message({
							type:'success',
							message:"新增成功"
						});
						setTimeout(()=>{
							this.$router.go(0);
						},500)
						this.dialogVisible = false;
						this.title = '';
					}
				})
			},
			deleteFun(){//删除时调用的function
				api("/category/delCategory",'POST',{
					categoryId:this.categoryId,
				},{
					'Content-Type': 'application/x-www-form-urlencoded'
				})
				.then(res=>{
					if(res.data.success){
						this.getMenu();
						this.$message({
							type:'success',
							message:"删除成功"
						});
						setTimeout(()=>{
							this.$router.go(0);
						},500)
						this.deleteDialog = false;
					}else{
						this.$message({
							type:'warning',
							message:"删除失败："+res.data.errorMsg
						});
						this.deleteDialog = false;
					}
				})
			},
			moveDown(level1,level2,level3){
				if(typeof level2=='undefined'&&(level1===this.tree.length-1)){
					this.$message({
						type:'warning',
						message:"此分类已经是最后一个了"
					});
					return;
				};
				if(typeof level2!='undefined'&&(level2===this.tree[level1].childCategory.length-1)&&(typeof level3=='undefined')){
					this.$message({
						type:'warning',
						message:"此分类已经是最后一个了"
					});
					return;
				};
				if(typeof level3!='undefined'&&(level3===this.tree[level1].childCategory[level2].childCategory.length-1)){
					this.$message({
						type:'warning',
						message:"此分类已经是最后一个了"
					});
					return;
				};
				this.moveType = 2;
				this.moveTip = true;
				if(typeof level2=='undefined'&& typeof level3=='undefined'){
					this.categoryId = this.tree[level1].id;
					// this.moveDownFun();
				}else if(typeof level2!='undefined'&& typeof level3=='undefined'){
					this.categoryId = this.tree[level1].childCategory[level2].id;
					// this.moveDownFun();
				}else{
					this.categoryId = this.tree[level1].childCategory[level2].childCategory[level3].id;
					// this.moveDownFun();
				};
			},
			moveUp(level1,level2,level3){//上移	
				if(level1==0&&typeof level2=='undefined'){
					this.$message({
						type:'warning',
						message:"此分类已经是第一个了"
					});
					return;
				};
				if(typeof level2!='undefined'&&level2==0&&(typeof level3=='undefined')){
					this.$message({
						type:'warning',
						message:"此分类已经是第一个了"
					});
					return;
				};
				if(typeof level3!='undefined'&&level3==0){
					this.$message({
						type:'warning',
						message:"此分类已经是第一个了"
					});
					return;
				};
				this.moveType = 1;
				this.moveTip = true;
				if(typeof level2=='undefined'&& typeof level3=='undefined'){
					this.categoryId = this.tree[level1].id;
					// this.moveUpFun();
				}else if(typeof level2!='undefined'&& typeof level3=='undefined'){
					this.categoryId = this.tree[level1].childCategory[level2].id;
					// this.moveUpFun();
				}else{
					this.categoryId = this.tree[level1].childCategory[level2].childCategory[level3].id;
					// this.moveUpFun();
				};
			},
			addMenu(level1,level2,level3){//添加分类
				this.dialogVisible = true;
				if(typeof level2=='undefined'&& typeof level3=='undefined'){
					this.categoryId = this.tree[level1].id;
				}else if(typeof level2!='undefined'&& typeof level3=='undefined'){
					this.categoryId = this.tree[level1].childCategory[level2].id;
				}else{
					this.categoryId = this.tree[level1].childCategory[level2].childCategory[level3].id;
				};
			},
			updateClassTitle(){//确认更新分类名称
				api("/category/updateCategoryName",'POST',{
					id:this.categoryId,
					categoryName:this.title
				},{
					'Content-Type': 'application/x-www-form-urlencoded'
				})
				.then(res=>{
					if(res.data.success){
						this.getMenu();
						this.$message({
							type:'success',
							message:"修改成功"
						});
						this.title = '';
						setTimeout(()=>{
							this.$router.go(0);
						},500)
					}else{
						this.$message({
							type:'error',
							message:"修改失败"
						});
					}
				})
			},
			updateName(level1,level2,level3){//更新分类名称
				this.updateDialog = true;
				if(typeof level2=='undefined'&& typeof level3=='undefined'){
					this.categoryId = this.tree[level1].id;
					this.title = this.tree[level1].category
				}else if(typeof level2!='undefined'&& typeof level3=='undefined'){
					this.categoryId = this.tree[level1].childCategory[level2].id;
					this.title = this.tree[level1].childCategory[level2].category
				}else{
					this.categoryId = this.tree[level1].childCategory[level2].childCategory[level3].id;
					this.title = this.tree[level1].childCategory[level2].childCategory[level3].category
				};
			},
			deleteMenu(level1,level2,level3){//删除分类
				if(typeof level2=='undefined'&&this.tree[level1].childCategory.length>0){
					this.$message({
						type:'warning',
						message:"分类内容不为空，不可删除"
					});
					return;
				};
				if(typeof level2!='undefined'&&this.tree[level1].childCategory[level2].childCategory.length>0&&(typeof level3=='undefined')){
					this.$message({
						type:'warning',
						message:"分类内容不为空，不可删除"
					});
					return;
				};
				this.deleteDialog = true;
				if(typeof level2=='undefined'&& typeof level3=='undefined'){
					this.categoryId = this.tree[level1].id;
				}else if(typeof level2!='undefined'&& typeof level3=='undefined'){
					this.categoryId = this.tree[level1].childCategory[level2].id;
				}else{
					this.categoryId = this.tree[level1].childCategory[level2].childCategory[level3].id;
				};
			},
		 	traverseTree(arr){//获取分类
	            arr = arr;
	            let arr1 = [];
	            for(let i=0,iLen=arr.length;i<iLen;i++){
	            	arr[i].open = false;
	                if(arr[i].childCategory&&Array.isArray(arr[i].childCategory)){
	                	for(let j=0;j<arr[i].childCategory.length;j++){
	            			arr[i].childCategory[j].open = false;
	                	};
	                    arr1 = arr[i].childCategory;
	            		this.traverseTree(arr1);
	                }else{
	                    return;
	                }
	            };
	            // this.traverseTree(arr1);
	        },
			getMenu(){
				api('/category/getCategoryList','GET',{
					workCode:utils.getCookie('username'),
				})
				.then(res=>{
					if(res.data.success){
						let data = res.data.data;
						this.traverseTree(data);
						this.tree = data;
					}
				})
			}
		},
		mounted(){
			this.getMenu();
		}
	}
</script>
<style scoped>
	.container{
		overflow-y: scroll;
     	height: calc(100% - 60px); 
		width: 100%;
	}
	.header{
		background: #fff;
		padding: 10px;
		margin: 15px;
		line-height: 40px;
	}
	.header span{
		font-size: 16px;
	}
	.main{
		background: #fff;
		margin: 15px;
	}
	
	.list {
	}
	.t_header{
		border-bottom: 1px solid #eee;
		padding: 10px 20px;
	}
	.item img{
		vertical-align: middle;
	}
	.item{
		user-select: none;
	}
	.item .arrow{
		height: 24px;
		width: 24px;
		transform-origin: center center;
		transition: all .15s ease;
	}
	.item .arrow_down{
		height: 24px;
		width: 24px;
		transform-origin: center center;
		transform:rotate(90deg);
		transition: all .15s ease;

	}
	.level1{
		cursor: pointer;
		border-bottom: 1px solid #eee;
		padding: 10px 0;
		padding-left: 20px;
	}
	.level2{
		padding: 10px 0;
		padding-left: 40px;
		border-bottom: 1px solid #eee;

	}
	.level3{
		padding: 10px 0;
		padding-left: 95px;
		border-bottom: 1px solid #eee;
	}
	.opens{
		overflow: hidden;
		transition: all .25s ease;
	}
</style>













