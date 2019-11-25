<template>
	<div class="container" >
		<el-row>
		  	<el-col :span="24">
		  		<div class="grid-content">
					<el-form ref="form" inline label-width="80px">
					  	<el-form-item label="文档标题">
					    	<el-input v-model="title" @keyup.enter.native='query'></el-input>
					  	</el-form-item>
					  	<el-form-item label="发布者">
					    	<el-input v-model="workcodeOrName" @keyup.enter.native='query'></el-input>
					  	</el-form-item>
					  	<el-form-item label="发布状态">
						    <el-select v-model="status" placeholder="请选择发布状态">
						      <el-option label="全部" value=""></el-option>
						      <el-option label="草稿" value="1"></el-option>
						      <el-option label="已发布" value="2"></el-option>
						      <el-option label="定时发布" value="3"></el-option>
						    </el-select>
					  	</el-form-item>
					  	<el-form-item label="发布日期">
					      	<el-date-picker 
					      		type="date" 
					      		placeholder="选择日期"
                        		value-format="yyyy-MM-dd"
                        		:picker-options="pickerOptionsStart"
					      		v-model="startTime">
					      	</el-date-picker>
					      	<span>至</span>
					      	<el-date-picker 
					      		type="date" 
					      		placeholder="选择日期"
					      		:picker-options="pickerOptionsEnd"
                        		value-format="yyyy-MM-dd"
					      		v-model="endTime">
					      	</el-date-picker>
					  	</el-form-item>
					  	<el-form-item label="">
						    <el-button type="primary" @click='query'>查询</el-button>
						</el-form-item>
					</el-form>
				</div>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span='24' style='padding:20px;'>
				<el-table
				    :data="tableData"
				    border
				    style="width: 100%;">
				    <el-table-column
				      show-overflow-tooltip
				      prop="title"
				      label="文档标题"
				      >
				      <template slot-scope="scope">
				        <el-button @click="handleClick(scope.row)" type="text" size="small">{{scope.row.title}}</el-button>
				      </template>
				    </el-table-column>
				    <el-table-column
				      prop="categoryName"
				      label="分类"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="type"
				      label="状态"
				      width='100'
				      >
				      <template slot-scope="scope">
				      	<div v-if='scope.row.type==4||scope.row.type==2'>已发布</div>
				      	<div v-if='scope.row.type==1'>草稿</div>
				      	<div v-if='scope.row.type==3'>定时发布</div>
				      </template>
				    </el-table-column>
				    <el-table-column
				      prop="updateDate"
				      label="发布时间"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="createrName"
				      label="发布者"
				      width='100'
				      >
				    </el-table-column>
				    <el-table-column
				      prop="seeCount"
				      label="浏览数"
				      width='100'
				      >
				    </el-table-column>
				    <el-table-column
				      fixed="right"
				      label="操作"
				      >
				      <template slot-scope="scope">
				      	<span class="top" v-if='scope.row.goTop==0' @click='goTop(scope.row,scope.$index)' style='background:#ccc ;'>顶</span>
				      	<span class="top" v-if='scope.row.goTop==1' @click='goTop(scope.row,scope.$index)' style='background:#409EFF ;'>顶</span>
				        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
				        <el-button type="text" size="small" @click='edit(scope.row)'>编辑</el-button>
				        <el-button type="text" size="small" @click='deleteClick(scope.row)'>删除</el-button>
				      </template>
				    </el-table-column>
				</el-table>
				<el-pagination
					v-if='totalCount>10'
				   	@size-change="handleSizeChange"
				   	@current-change="handleCurrentChange"
				   	:current-page.sync="pageNum"
				   	:page-sizes="[10, 20, 30, 40]"
				    :page-size="pageSize"
				    layout="sizes, prev, pager, next"
				    :total="totalCount">
				</el-pagination>
			</el-col>
		</el-row>
		<el-dialog
		  title="提示"
		  :visible.sync="dialog"
		  width="30%"
		  >
		  <span>确定要删除该文章吗？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialog = false">取 消</el-button>
		    <el-button type="primary" @click="delArticle">确 定</el-button>
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
			let _this = this;
			return {
				dialog:false,
				totalCount:0,
				pageSize:10,
				pageNum:1,
				workcodeOrName:'',
				title:'',
				startTime:'',
				endTime:'',
				status:'',
				tableData: [],
				category:'',
				uuid:'',
				pickerOptionsStart: {
		          	disabledDate(time) {
		          		if(!!_this.endTime){
			            	return time.getTime() > new Date(_this.endTime).getTime()
		          		}else{
		          			return;
		          		}
		          	}
        		},
        		pickerOptionsEnd: {
		          	disabledDate(time) {
		          		if(!!_this.startTime){
			            	return time.getTime() < new Date(_this.startTime).getTime()-(24*60*60*1000);
		          		}else{
		          			return;
		          		}
		          	}
        		},
			}
		},
		watch:{
			$route(to,from){
				// this.title = '';
				// this.workcodeOrName = '';
				// this.status = '';
				// this.startTime = '';
				// this.endTime = '';
				// this.pageSize = 10;
				// this.pageNum = 1;
			}
		},
		beforeRouteUpdate(to,from,next){
			this.title = '';
			this.workcodeOrName = '';
			this.status = '';
			this.startTime = '';
			this.endTime = '';
			this.pageSize = 10;
			this.pageNum = 1;
			if(to.query.category==0||to.query.category){
				this.category = to.query.category;
				this.getList();
			};
			next();
		},
		methods:{
			query(){
				this.pageNum = 1;
				this.getList();
			},
			deleteClick(row){
				this.uuid = row.uuid;
				this.dialog = true;
			},
			delArticle(){
				api('/article/delArticle','POST',{
					uuid:this.uuid
				},{
					'Content-Type': 'application/x-www-form-urlencoded'
				})
				.then(res=>{
					if(res.data.success){
						this.dialog = false;	
						setTimeout(()=>{
							this.getList();
							this.$message({
								message:'删除成功',
								type:'success'
							});
						},1000)
					}
				})
			},
			handleSizeChange(val){
				this.pageSize = val;
				this.pageNum = 1;
				this.getList();
			},
			handleCurrentChange(val){
				this.pageNum = val;
				this.getList();
			},
			edit(row){//编辑发布信息
				this.$router.push({path:'/edit',query:{uuid:row.uuid}});
			},
			goTop(row,i){
				api('/article/updateGoTop','GET',{
					uuid:row.uuid,
					goTop:row.goTop==1?0:1
				})
				.then(res=>{
					if(res.data.success){
						setTimeout(()=>{
							if(row.goTop==1){
								this.$message({
									message:'取消置顶成功',
									type:'success'
								});
							}else{
								this.$message({
									message:'置顶成功',
									type:'success'
								});
							}
							this.getList();
						},1000);
					}else{
						this.$message({
							message:'置顶失败'+res.data.errorMsg,
							type:'warning'
						})
					}
				})
			},
			getList(){
				api('/article/getArticleList','GET',{
					pageNum:this.pageNum,
					pageSize:this.pageSize,
					workCode:utils.getCookie('username'),
					startDate:this.startTime,
					endDate:this.endTime?this.endTime+' 23:59:59':'',
					type:this.status,
					name:this.workcodeOrName,
					category:this.category==0?'':this.category,
					title:this.title
				})
				.then(res=>{
					if(res.data.success){
						let data = res.data.data.data;
						if(data&&data.length>0){
							for(let i=0;i<data.length;i++){
								if(data[i].type==1){
									data[i].status = '草稿';
								}else if(data[i].type==2){
									data[i].status = '已发布';
								}else{
									data[i].status = '定时发布';
								};
							};
							this.totalCount = res.data.data.total;
						}else{
							this.totalCount = 0;
						}
						this.$nextTick(function(){
							this.tableData = data;
						})
					}
				})
			},
			handleClick(row){
				this.$router.push({path:'/record',query:{uuid:row.uuid}});
			},
		},
		mounted(){
			this.category = this.$route.query.category;
			this.getList();
		}
	}
</script>
<style scoped>
	.container{
		overflow-y: scroll;
     	height: calc(100% - 60px); 
	}
	.el-row {

		margin:10px 10px 10px;
		background: #fff;
		padding: 15px 5px 0;
	}
	.el-col{
		border-radius: 4px;
	}
	.el-form-item{
		margin-bottom: 10px;
	}
	.table{
		padding: 20px;
	}
	.top{
		padding:2px 8px;
		border-radius: 4px;
		background:#ccc ;
		color:#fff;
		font-size:12px;
		margin-right: 10px;
		display: inline-block;
		width: 40px;
		text-align:center;
		cursor: pointer;
	}
</style>













