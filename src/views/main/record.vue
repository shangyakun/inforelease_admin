<template>
	<div class="container" >
		<div class="title">
			<h2>{{detail.title}}</h2>
			<div class="info">
				<span>{{detail.createrName}}</span>
				<span>{{detail.updateDate}}</span>
				<span>{{detail.categoryName}}</span>
				<span>已赞（{{detail.likedCount}}）</span>
				<span>已阅（{{detail.seeCount}}）</span>
			</div>
		</div>
		<div class="main clear">
			<el-tabs v-model="activeName" style='' @tab-click="handleClick">
			    <el-tab-pane label="正文" name="1">
			    	<div class="table">
						<div class="htmls" v-html='detail.content'></div>
					</div>
			    </el-tab-pane>
			    <el-tab-pane label="附件" name="2" v-if='fileList.length'>
			    	<div class="annex" v-if='fileList.length'>
			    		<h3>附件：</h3>
			    		<ul class="annexlist">
		    				<li class="annexitem" v-for='item,index of fileList' :key='index'>
		    					<img class="img"  src="../../assets/annex.png" alt="">
		    					<span class="annexname">{{item.attachment_server_name}}</span>
		    					<a @click='downloadAnnex(index)' href="javascript:;">&nbsp;下载&nbsp;</a>
		    					<a href="javascript:;" @click='deleteAnnex(index)'>&nbsp;删除&nbsp;</a>
		    				</li>
		    			</ul>	
			    	</div>
			    	<div class="" v-if='!fileList.length'>暂无附件</div>
			    </el-tab-pane>
			    <el-tab-pane label="评论" name="3" v-if='commentList.length'>
			    	<h3 class="" style="font-size:16px;">大家的评论:</h3>
			    	<ul class="list" v-if='commentList.length'>
			    		<li v-if class="item" v-for='item,index of commentList' :key='index'>
			    			<div class="name">
			    				<span>{{item.commentName}}</span>
			    				<span class="time">{{item.createTime}}</span>
			    			</div>
			    			<div class="article">
			    				<span class="">{{item.commentContent}}12lasnda sknk</span>
			    			</div>
			    		</li>
			    	</ul>
			    	<div class="" v-if='!commentList.length'>暂无评论</div>
			    </el-tab-pane>
			    <el-tab-pane label="访问记录"  name="4">
		    		<div class="table">
			    		<el-table
					    :data="visitData"
					    border
					    style="width: 100%;">
						    <el-table-column
						      prop="visitUserName"
						      label="姓名"
						      >
						    </el-table-column>
						    <el-table-column
						      prop="visitTime"
						      label="访问时间"
						      >
						    </el-table-column>
						    <el-table-column
						      prop="source"
						      label="访问来源"
						      >
						    </el-table-column>
						</el-table>
						<el-pagination
					      @size-change="handleSizeChange"
					      @current-change="handleCurrentChange"
					      :current-page.sync="pageNum"
					      :page-sizes="[10, 20, 30, 40]"
					      :page-size="pageSize"
					      layout="sizes, prev, pager, next"
					      :total="totalCount">
					    </el-pagination>
					</div>
			    </el-tab-pane>
		    	<el-tab-pane label="下载记录" name="5">
		    		<div class="table">
		    			<el-table
					    :data="downloadData"
					    border
					    style="width: 100%;">
						    <el-table-column
						      prop="downloadUserName"
						      label="姓名"
						      >
						    </el-table-column>
						    <el-table-column
						      prop="downloadTime"
						      label="下载时间"
						      >
						    </el-table-column>
						    <el-table-column
						      prop="source"
						      label="下载途径"
						      >
						    </el-table-column>
						</el-table>
						<el-pagination
					      @size-change="handleSizeChange"
					      @current-change="handleCurrentChange"
					      :current-page.sync="pageNum"
					      :page-sizes="[10, 20, 30, 40]"
					      :page-size="pageSize"
					      layout="sizes, prev, pager, next"
					      :total="totalCount">
					    </el-pagination>
					</div>		
		    	</el-tab-pane>
		  </el-tabs>
		</div>
	</div>

</template>
<script>
	import api from '@/api/api'
	import utils from '../../utils/utils'
	export default {
		name:'',
		data(){
			return {
				activeName:'1',
				workcodeOrName:'',
				title:'',
				startTime:'',
				endTime:'',
				status:'',
				detail:'',
				downloadData:[],
				visitData:[],
				pageNum:1,
				pageSize:10,
				totalCount:0,
				commentList:[],
				fileList:[],
			}
		},
		methods:{
			deleteAnnex(index){
				api('/article/delFile','POST',{
                    attachmentUuid:this.fileList[index].uuid,
                    workCode:utils.getCookie('username'),
                    uuid:this.$route.query.uuid,
                },{'Content-Type': 'application/x-www-form-urlencoded'})
                .then(res=>{
                    if(res.data.success){
                    	this.$message({
                    		type:'success',
                    		message:'附件已删除'
                    	})
                    	this.getAttachmentList();
                        // this.fileList = fileList;
                    }
                }) 
			},
			downloadAnnex(index){
			},
			getAttachmentList(){
	            api('/article/getAttachmentList','GET',{
	                uuid:this.$route.query.uuid
	            })
	            .then(res=>{
	                if(res.data.success){
	                    this.fileList = res.data.data;
	                }
	            })
	        },
			getCommentList(){
				api('/article/getCommentRecord','GET',{
					uuid:this.$route.query.uuid
				})
				.then(res=>{
					if(res.data.success){
						this.commentList = res.data.data;
					}
				})
			},
			handleSizeChange(val){
				this.pageSize = val;
				this.pageNum = 1;
				switch (this.activeName) {
					case '4':
						this.getVisitRecord()
						break;
					case '5':
						this.getDownloadCount()
						break;			
					default:
						break;
				};
			},
			handleCurrentChange(val){
				this.pageNum = val;
				switch (this.activeName) {
					case '4':
						this.getVisitRecord()
						break;
					case '5':
						this.getDownloadCount()
						break;			
					default:
						break;
				};
			},
			handleClick(tab, event) {
				switch (this.activeName) {
					case '1':
						this.getDetaile()
						break;
					case '2':
						break;
					case '3':
						// this.getComment()
						break;
					case '4':
						this.pageNum = 1;
						this.pageSize = 10;
						this.totalCount = 0;
						this.getVisitRecord()
						break;
					case '5':
						this.pageNum = 1;
						this.pageSize = 10;
						this.totalCount = 0;
						this.getDownloadCount()
						break;			
					default:
						// statements_def
						break;
				}
		    },
		    getVisitRecord(){//获取访问记录
		    	api('/article/getVisitRecord','GET',{
		    		pageNum:this.pageNum,
		    		pageSize:this.pageSize,
					uuid:this.$route.query.uuid
		    	})
		    	.then(res=>{
		    		if(res.data.success){
		    			this.totalCount = res.data.totalCount;
		    			this.visitData = res.data.data;
		    		}
		    	})
		    },
		    getDownloadCount(){//获取下载记录
		    	api('/article/getDownloadRecord','GET',{
		    		pageNum:this.pageNum,
		    		pageSize:this.pageSize,
					uuid:this.$route.query.uuid
		    	})
		    	.then(res=>{
		    		console.log(res.data)
		    		if(res.data.success){
		    			this.totalCount = res.data.totalCount;
		    			this.downloadData = res.data.data;
		    			console.log(res.data.data);
		    			// this.
		    		}
		    	})
		    },
		    getComment(){//获取评论列表
		    	api('/article/getCommentRecord','GET',{
					uuid:this.$route.query.uuid
		    	})
		    	.then(res=>{
		    		if(res.data.success){
		    			this.visitData = res.data.data;
		    		}
		    	})
		    },
			getDetaile(){//获取正文信息
				api("/article/getArticleDetail",'GET',{
					uuid:this.$route.query.uuid
				})
				.then(res=>{
					if(res.data.success){
						this.detail = res.data.data;
					}
				})
			}
		},
		mounted(){
			this.getDetaile();
			this.getCommentList();
			this.getAttachmentList();
		}
	}
</script>
<style scoped>
	.container{
		width: 100%;
		overflow-y: scroll;
		margin-top: 10px;
     	height: calc(100% - 60px); 
	}
	.title{
		background: #fff;
		margin: 0 10px;
		padding-left: 20px;
	}
	.title h2{
		line-height: 50px;

	}
	.main{
		margin: 10px 10px;
		background: #fff;
		padding: 0 20px;
		min-height: 200px;
	}
	.info span{
		line-height: 24px;
		font-size: 14px;
		color: #999;
		margin-right: 20px;
	}
	.table{
		padding-bottom: 20px;
	}
	.list{
		padding: 10px;
	}
	.item{
		line-height: 16px;
		font-size: 14px;
		padding: 10px 0;
		border-bottom: 1px solid #eee;
	}
	.item .name{
		font-size: 16px;
		margin-bottom: 10px;
	}
	.time{
		margin-left: 20px;
	}
	.annexlist{
		padding: 10px;
	}
	.annexitem{
		padding: 10px;
	}
	.annexitem .img{
		width: 24px;
		vertical-align: middle;
	}
	.annexname{
		display: inline-block;
		vertical-align: middle;
	}
	.annexitem a{
		margin-left: 20px;
		color: #409EFF;
		font-size: 14px;
		display: inline-block;
		vertical-align: middle;
	}
	.annexitem a:hover{
		text-decoration: underline;
	}
	
</style>













