<template>
    <div class="container" style='overflow-y: scroll;' v-loading='showLoading'>
        <!-- <video src="http://t.cn/EfQasWc?m=4344251200820820&u=1895286921" autoplay="autoplay" controls="controls"> -->
<!-- </video> -->
        <div style="background: #fff;width:100%;" class="clear">
            <el-col :span="24">
                <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
                    <el-form-item label="标题" prop="title">
                        <el-input 
                            class='input'
                            type="textarea"
                            placeholder="请输入题目" 
                            maxlength='100'
                            style='width: 200px;'
                            v-model="ruleForm.title">
                        </el-input>
                        <span style="vertical-align: bottom;">{{ruleForm.title.length}}/100</span>
                    </el-form-item>
                    <el-form-item label="消息类型">
                            <el-radio v-model="msgType" label="1">普通文档</el-radio>
                            <el-radio v-model="msgType" label="2">图文消息</el-radio>
                            <el-radio v-model="msgType" label="3">H5页面</el-radio>
                            <div class="tips" v-if='msgType==1'>直接发布，但不推送到企微</div>
                            <div class="tips" v-if='msgType==2'>消息发布时，同时作为图文消息推送到企微</div>
                            <div class="tips" v-if='msgType==3'>直接推送H5页面，需配置页面地址，仅支持移动端打开</div>
                    </el-form-item>
                    <el-form-item label="文档分类" prop="category">
                        <el-select @change='changeCategory' v-model="ruleForm.category" placeholder="请选择文档分类">
                            <el-option
                              v-for="item in options"
                              :key="item.id"
                              :label="item.category"
                              :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="H5链接" v-if='msgType==3' prop='h5link'>
                        <el-input 
                            class='input'
                            style='width: 200px;'
                            type="input"
                            placeholder="请输入H5链接地址" 
                            v-model="ruleForm.h5link">
                        </el-input>
                    </el-form-item>
                    
                    <!-- 分割线，下边的是隐藏的 -->

                    <el-upload
                        class="upload-demo"
                        :on-success='uploadSuccess'
                        style='display: none;'
                        ref='upload'
                        :action="baseURL+'/article/docxToHtml'"
                        :before-upload="beforeAvatarUpload"
                        >
                        <el-button size="small" type="primary" ref='uploadClick'>点击上传</el-button>
                    </el-upload>
                    <el-upload
                        class="upload-demo"
                        :on-success='uploadVideoSuccess'
                        style='display: none;'
                        ref='uploadVideo'
                        :action="baseURL+'/article/uploadFile'"
                        :before-upload="beforeVideo"
                        >
                        <el-button size="small" type="primary" ref='uploadVideoClick'>点击上传</el-button>
                    </el-upload>
                    <!-- 分割线，上边的是隐藏的 -->
                    <el-form-item label="正文" prop="content" v-if='msgType!=3'>
                        <el-input 
                            class='input'
                            type="textarea"
                            placeholder="请输入题目" 
                            maxlength='100'
                            v-show='false'
                            v-model='ruleForm.content'>
                        </el-input>
                        <div class="fl edit_container">
                            <quill-editor ref="myTextEditor"
                                v-model="ruleForm.content"
                                :options="editorOption"
                                @change="onEditorChange($event)"
                                class="cfpa-quill-editor">
                                  <div id="toolbar" slot="toolbar">
                                    <button class="ql-bold" title="加粗">Bold</button>
                                    <button class="ql-italic" title="斜体">Italic</button>
                                    <button class="ql-underline" title="下划线">underline</button>
                                    <button class="ql-strike" title="删除线">strike</button>
                                    <button class="ql-blockquote" title="引用"></button>
                                    <button class="ql-code-block" title="代码"></button>
                                    <button class="ql-header" value="1" title="标题1"></button>
                                    <button class="ql-header" value="2" title="标题2"></button>
                                    <button class="ql-list" value="ordered" title="有序列表"></button>
                                    <button class="ql-list" value="bullet" title="无序列表"></button>
                                    <select class="ql-color" value="color" title="字体颜色"></select>
                                    <select class="ql-background" value="background" title="背景颜色"></select>
                                    <select class="ql-align" value="align" title="对齐"></select>
                                    <button class="ql-link" title="超链接"></button>
                                    <button class="ql-image" title="图片"></button>
                                    <span id="custom-button" style="font-size:14px;display: inline-block;margin-top: 4px;" @click='uploadWord' title="word"><i class="fa fa-file-word-o fa-lg"></i></span>
                                    <span id="custom-button" style="font-size:14px;display: inline-block;margin-top: 4px;" title="video" @click='uploadVideo'><i class="fa fa-file-video-o fa-lg"></i></span>
                                  </div>
                            </quill-editor>
                        </div>    
                    </el-form-item>
                    <el-form-item label="封面图片" v-show='msgType!=1' prop='cover'>
                        <el-input 
                            v-show='false'
                            class='input'
                            type="text"
                            v-model='ruleForm.cover'>
                        </el-input>
                        <el-upload
                          class="avatar-uploader"
                          :action="baseURL+'/article/uploadFile'"
                          :show-file-list="false"
                          ref='banner'
                          v-if='!ruleForm.cover'
                          element-loading-text="正在上传封面"
                          v-loading='imgLoading'
                          :before-upload="beforeUploadBanner">
                          <i class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <div class="cover" v-if='ruleForm.cover'>
                            <img :src="ruleForm.cover" alt="" width="240" height="102"> 
                            <div class="mask">
                                <i class="el-icon-delete" @click='removeCover'></i>
                            </div>   
                        </div>
                        <div style="line-height: 18px;margin-top: 5px;">
                            <a href="javascript:;" style="color:#409EFF;text-decoration: underline;" @click='chooseHisCover'>从历史图库中选择></a>
                        </div>
                        <div style="color:#F56C6C;line-height: 18px;margin-top: 5px;">*建议尺寸1200*510的图片！</div>
                    </el-form-item>
                    <el-form-item label="摘要" prop='abstract' v-if='msgType!=1'>
                        <el-input 
                            class='input'
                            style='width: 200px;'
                            type="textarea"
                            placeholder="请输入摘要" 
                            maxlength='70'
                            v-model="ruleForm.abstract">
                        </el-input>
                        <span style="vertical-align: bottom;">{{ruleForm.abstract.length}}/70</span>
                    </el-form-item>
                    <el-form-item label="访问权限" v-if='isRender("permission_button")'>
                            <el-radio v-model="permission" label="0">公开</el-radio>
                            <el-radio v-model="permission" label="1">指定人可见</el-radio>
                    </el-form-item>
                    <el-form-item v-if='userIsOk'>
                        <ul class="textarea" @click='setTree'>
                            <li v-for='item,index of departmentRange' :key='index'>
                                <span>{{item.name}}</span>
                            </li>
                            <li v-for='item,index of userRange' :key='item.id'>
                                <span>{{item.name}}</span>
                            </li>
                        </ul>
                    </el-form-item>
                    <el-form-item label="点赞">
                        <el-radio v-model="like" label="0">关闭</el-radio>
                        <el-radio v-model="like" label="1">开放</el-radio>
                    </el-form-item>
                    <el-form-item label="推送邮件" v-if='msgType==2&&isRender("email_button")'>
                        <el-radio v-model="mail" label="0">关闭</el-radio>
                        <el-radio v-model="mail" label="1">开放</el-radio>
                    </el-form-item>
                    <el-form-item label="评论">
                        <el-radio v-model="comment" label="0">关闭</el-radio>
                        <el-radio v-model="comment" label="1">开放</el-radio>
                    </el-form-item>
                    <el-form-item label='上传附件'>
                        <el-upload
                            class="upload-demo"
                            style='width:300px;'
                            :action="baseURL+'/article/uploadFile'"
                            multiple
                            :on-success='annexSuccess'
                            :before-upload='annexBefore'
                            ref='annex'
                            :show-file-list='showFile'
                            >
                            <el-button size="small" type="primary">选择附件上传</el-button>
                        </el-upload>
                        <ul class="filelist">
                            <li v-for='item,index of fileList' class="file_item" :key='index'>
                                <i class="el-icon-document"></i>
                                <a href="javascript:;">{{item.name}}</a>
                                <i class="el-icon-close fr" @click='handleRemove(index)'></i>
                            </li>
                        </ul>
                    </el-form-item>
                    <el-form-item label='发布'>
                        <span :class="releaseType==1?'active button':'button'" @click="releaseType=1">保存草稿</span>
                        <span :class="releaseType==3?'active button':'button'" @click="chooseSetTimeSend">定时发布</span>
                        <span :class="releaseType==2?'active button':'button'" @click="releaseType=2">立即发布</span>
                    </el-form-item>    
                    <el-form-item label="发布日期" prop='date' v-if='releaseType==3&&msgType!=2'>
                        <el-date-picker
                            v-model="ruleForm.date"
                            type="datetime"
                            :picker-options="pickerOptionOnes"
                            placeholder="选择发布日期" 
                            >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type='primary' @click="submitForm('ruleForm')">确定</el-button>
                        <el-button type='primary' @click="cancle">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </div> 
        <el-dialog
            title="定时推送"
            :visible.sync="dialogVisible"
            width="50%"
            >
            <div prop='date'>
                <el-form label-width="120px">
                    <el-form-item label="定时推送时间：">
                        <el-date-picker
                            size='mini'
                            v-model="sendDate"
                            type="datetime"
                            :picker-options="pickerOptionOnes"
                            placeholder="选择发布日期" 
                            >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="是否二次推送：">
                            <el-radio v-model="sendRepeat" label="0">关闭</el-radio>
                            <el-radio v-model="sendRepeat" label="1">开放</el-radio>
                    </el-form-item>
                    <el-form-item label="二次推送时间：" v-if='sendRepeat==1'>
                        <el-date-picker
                            size='mini'
                            v-model="sendSecondTime"
                            type="datetime"
                            :picker-options="pickerOptionOnes"
                            placeholder="选择推送日期" 
                            >
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancleSetTime">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
        <div class="treewrap" v-show='showTree'>
            <div class="head">
                选择范围
            </div>
            <div class="main clear">
                <div class="tree fl">
                    <el-input
                      placeholder="搜索部门或成员"
                      size='mini'
                      style='width:180px;'
                      suffix-icon="el-icon-search"
                      v-model="filterText">
                    </el-input>
                    <el-tree
                      class="filter-tree"
                      show-checkbox
                      check-strictly
                      node-key='id'
                      @check-change='checkNode'
                      :data="departmentList"
                      :props="defaultProps"
                      :filter-node-method="filterNode"
                      ref="tree2">
                    </el-tree>
                </div>  
                <div class="list fr">
                    <p>已选择的部门或成员</p>
                    <ul class="range">
                        <li v-for='item,index of departmentRange' :key='index'>
                            <span>{{item.name}}</span>
                            <span class="fr" style="margin-right: 20px;" @click='deleteRange(0,index)'>
                                <img class="close" src="../../assets/close.png" alt="">
                            </span>
                        </li>
                        <li v-for='item,index of userRange' :key='item.id'>
                             <span>{{item.name}}</span>
                            <span class="fr" style="margin-right: 20px;" @click='deleteRange(1,index)'>
                                <img class="close" src="../../assets/close.png" alt="">
                            </span>
                        </li>
                    </ul>
                </div>  
            </div>
            <div class="footer">
                <el-button type="primary" size='mini' @click='handleNo'>取消</el-button>
                <el-button type="primary" size='mini' @click='handleOk'>确定</el-button>
            </div>
        </div>
        <el-dialog
          title="选择封面图片"
          :visible.sync="bannerVisible"
          width="50%"
          @opened='bannerDialogOpen'
          >
          <div style="text-align: center;" v-if='bannerVisible'>
                <img id='image' ref='image' style="width: 300px;height:auto;" :src="bannerImg" />
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button class='fl' type="primary" @click="reUpload">重新上传</el-button>
            <el-button @click="cancleCropper">取 消</el-button>
            <el-button type="primary" @click="sureCropper">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
            title="选择历史封面"
            :visible.sync="showCoverList"
            width="800px"
        >
            <div style="text-align: center;">
                <ul class="clear">
                    <li :class="item.checked?'checked cover-item fl':'cover-item fl'" v-for='item,index of coverList' :key='index'>
                        <img @click='checkCover(index)' :src="item.cover" alt="">
                    </li>
                </ul>
                <div class="block clear">
                    <el-pagination
                        class='fl'
                        :current-page="pageNum"
                        @current-change='changePage'
                        layout="prev, pager, next"
                        :total="totalCount">
                    </el-pagination>
                    <span class='fr' style="line-height: 32px;">
                        <el-button size='mini' @click="cancleCover">取 消</el-button>
                        <el-button size='mini' type="primary" @click="okCover">确 定</el-button>
                    </span>
                </div>
            </div>
        </el-dialog>
        <div class="mask" v-if='showTree' @click='showTree=false'></div>
    </div>
</template>
<script>
    import { quillEditor,Quill } from "vue-quill-editor"; //调用编辑器
    import { container, ImageExtend, QuillWatch } from '../../assets/index'
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import api from '../../api/api'
    import axios from 'axios'
    import qs from 'qs'
    import utils from '../../utils/utils'
    Quill.register('modules/ImageExtend', ImageExtend);
    import { mapState } from 'vuex'
    import Cropper from 'cropperjs';
    import 'cropperjs/dist/cropper.min.css'
export default {
    data() {
        return {

            bannerVisible:false,
            totalCount:0,
            pageNum:1,
            showCoverList:false,
            dialogVisible:false,
            showLoading:false,
            baseURL:globalConfig.baseURL,
            editorOption: {
                modules: {
                  toolbar: {
                    container: '#toolbar',  // container为工具栏，此次引入了全部工具栏，也可自行配置
                    handlers: {
                      'image': function () {  // 劫持原来的图片点击按钮事件
                        console.log('// 劫持原来的图片点击按钮事件);', this.quill.id);
                        QuillWatch.emit(this.quill.id)
                      }
                    }
                  },
                  history: {
                    delay: 1000,
                    maxStack: 50,
                    userOnly: false
                  },
                  ImageExtend: {
                    loading: true,  // 可选参数 是否显示上传进度和提示语
                    name: 'file',  // 图片参数名
                    size: 40,  // 可选参数 图片大小，单位为M，1M = 1024kb
                    action: globalConfig.baseURL+'/article/uploadFile',  // 服务器地址, 如果action为空，则采用base64插入图片
                    // response 为一个函数用来获取服务器返回的具体图片地址
                    // 例如服务器返回{code: 200; data:{ url: 'baidu.com'}}
                    // 则 return res.data.url
                    response: (res) => {
                        return res.data.url
                    },
                    headers: (xhr) => {},  // 可选参数 设置请求头部
                    start: () => {},  // 可选参数 自定义开始上传触发事件
                    end: () => {},  // 可选参数 自定义上传结束触发的事件，无论成功或者失败
                    error: () => {},  // 可选参数 自定义网络错误触发的事件
                    change: (xhr, formData) => {} // 可选参数 选择图片触发，也可用来设置头部，但比headers多了一个参数，可设置formData
                  }
                },
                imageResize: {
                    displayStyles: {
                        backgroundColor: 'black',
                        border: 'none',
                        color: 'white'
                    },
                    modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
                },
              placeholder: '请编写内容...'
            },
            pickerOptionOnes: {
                disabledDate(time) {
                    return time.getTime()+86400000 < Date.now();
                }
            },
            ruleForm: {
                date:'',
                category:'',//分类id
                title: '',//题目名称
                content:'',
                abstract:'',//摘要
                h5link:'',//h5链接
                cover:'',//封面
                // categoryName:'',//文档分类
            },
            fileList:[],
            fileLength:[],
            permission:'0',//是否指定人公开
            msgType:'1',//文档类型
            like:'0',//是否开启点赞
            mail:'0',//是否推送邮件0不推送，1推送
            sendRepeat:'0',//是否二次推送，0否，1是
            comment:'0',//是否开启评论
            sendSecondTime:'',//二次推送时间
            sendDate:'',//推送时间
            filterText:'',
            rules: {
                title: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                ],
                content:[
                    { required: true, message: '请输入正文内容', trigger: 'blur' },
                ],
                date:[
                    { type: 'date', required: true, message: '请选择发布日期', trigger: 'change' }
                ],
                category:[
                    { required: true, message: '请选择文档类型', trigger: 'change' }
                ],
                abstract:[
                    { required: true, message: '请输入摘要', trigger: 'blur' },
                ],
                h5link:[
                    { required: true, message: '请输入H5链接地址', trigger: 'blur' },
                ]
            },
            uploadData:{
                file:{}
            },
            videoData:{
                file:{}
            },
            options:[],
            releaseType:1,
            imgLoading:false,
            departmentList:[],
            defaultProps: {
                children:'childrenDepartment',
                label: 'departmentname'
            },
            departmentRange:[],
            userRange:[],
            userIsOk:false,//确定人员
            showTree:false,
            showFile:true,
            cropper:null,
            coverList:[],
        }
    },
    components: {
        quillEditor
    },
    computed:{
        ...mapState(['userMenus'])
    },
    watch:{
        permission:function(val){
            if(val==1){
                this.showTree = true;
            }else{
                this.showTree = false;
                this.userRange = [];
                this.userIsOk = false;
                this.departmentRange = [];
                this.$refs.tree2.setCheckedNodes([]);
            }
        },
        filterText:function(val) {
            this.$refs.tree2.filter(val);
        }
    },
    methods: {
        changeCategory(val){
            this.getCoverList(val)
        },
        chooseHisCover(){
            if(this.ruleForm.category===""){
                this.$message({
                    type:'warning',
                    message:'请先选择文档分类'
                });
                return;
            };
            if(this.coverList.length<1){
                this.$message({
                    type:'warning',
                    message:'当前文档类型无历史封面'
                });
                return;
            }
            this.showCoverList = true;
        },
        cancleCover(){
            this.ruleForm.cover = '';
            this.showCoverList = false;
        },
        okCover(){
            let cover = this.coverList.filter(item=>{
                return item.checked;
            });
            this.ruleForm.cover = cover[0].cover
            this.showCoverList = false;
        },
        checkCover(index){
            for(let i=0;i<this.coverList.length;i++){
                this.coverList[i].checked = false;
            };
            this.coverList[index].checked = true;
        },
        bannerDialogOpen(){
            const image = this.$refs.image;
            const cropper = new Cropper(image, {
                aspectRatio: 120 / 51,
                crop(event) {
                },
            });
            this.cropper = cropper;
        },
        reUpload(){
            this.bannerVisible = false;
            document.querySelector('.avatar-uploader .el-upload').click();
        },
        cancleCropper(){
            this.bannerVisible = false;
            this.cropper.reset();
            this.bannerImg = '';
            this.$refs.banner.clearFiles();
        },
        sureCropper(){
            let _this = this
                const file = this.cropper.getCroppedCanvas().toBlob((bolb)=>{
                    const formData = new FormData();
                    // Pass the image file name as the third parameter if necessary.
                    formData.append('file', bolb,'banner.png');
                    api('/article/uploadFile','POST',formData,{ "Content-Type": "multipart/form-data" })
                    .then(res=>{
                        this.bannerVisible = false;
                        if(res.data.success){
                            this.ruleForm.cover = res.data.data.url;
                            this.cropper.reset();
                        }else{
                            this.$message({
                                message: '上传封面图片失败',
                                type: 'warning'
                            });
                            this.cropper.reset();
                            this.$refs.banner.clearFiles();
                        };
                    })
                    .catch((error)=>{
                        this.bannerVisible = false;
                    })
                },'image/png');
        },
        getCoverList(val){
            api('/article/getCoverList','GET',{
                category:val,
                pageNum:this.pageNum,
                pageSize:9
            })
            .then(res=>{
                if(res.data.success){
                    let data = res.data.data;
                    for(let i=0;i<data.length;i++){
                        data[i].checked = false;
                    };
                    this.coverList = data;
                    this.totalCount = res.data.totalCount;
                }else{
                    this.coverList = [];
                    this.totalCount = 0;
                }
            })
            .catch(err=>{
                this.coverList = [];
                this.totalCount = 0;
            })
        },
        changePage(val){
            this.pageNum = val;
            this.getCoverList(this.ruleForm.category);
        },
        isRender(key){
            return this.userMenus.includes(key);
        },
        handleOk(){
            this.showTree = false;
            if(this.departmentRange.length||this.userRange.length){
                this.userIsOk = true;
            }else{
                this.userIsOk = false;
                this.permission = '0';
            }
        },
        handleNo(){
            this.showTree=false;
            if(this.departmentRange.length||this.userRange.length){
                this.userIsOk = true;
            }else{
                this.userIsOk = false;
                this.permission = '0';
            };
        },
        setTree(){
            let list = this.departmentRange.concat(this.userRange);
            this.showTree = true;
        },
        deleteRange(i,index){
            if(i==0){
                let list = [];
                this.departmentRange.splice(index,1);
                for(let i=0;i<this.departmentRange.length;i++){
                    list.push({
                        departmentname:this.departmentRange[i].departmentname,
                        id:this.departmentRange[i].id,
                    })
                };
                list = this.userRange.concat(list)
                this.$refs.tree2.setCheckedNodes(list);
            }else{
                let list = [];
                this.userRange.splice(index,1);
                for(let i=0;i<this.userRange.length;i++){
                    list.push({
                        departmentname:this.userRange[i].departmentname,
                        id:this.userRange[i].id,
                    })
                };
                list = this.departmentRange.concat(list)
                this.$refs.tree2.setCheckedNodes(list);
            }
        },
        checkNode(data){
            this.departmentRange = [];
            this.userRange = [];
            let checkList = this.$refs.tree2.getCheckedNodes();
            if(checkList.length>0){
                for(let i=0;i<checkList.length;i++){
                    if(checkList[i].supdepid!='-1'){
                        this.departmentRange.push({
                            name:checkList[i].departmentname,
                            id:checkList[i].id
                        })
                    }else{
                        this.userRange.push({
                            name:checkList[i].departmentname,
                            id:checkList[i].id
                        })
                    };
                };
            }else{
                this.userIsOk = false;
            }
        },
        filterNode(value, data) {//树形结构过滤方法
            if (!value) return true;
            return data.departmentname.indexOf(value) !== -1;
        },
        cancleSetTime(){
            this.dialogVisible = false;
            this.sendSecondTime = '';
            this.sendDate = '';
        },
        chooseSetTimeSend(){
            if(this.msgType==2){
                this.dialogVisible=true
            }else{
                this.dialogVisible=false;
            }
            this.releaseType = 3;
        },
        annexBefore(file){
            this.showFile = true;
        },
        getAttachmentList(){
            api('/article/getAttachmentList','GET',{
                uuid:this.$route.query.uuid
            })
            .then(res=>{
                if(res.data.success){
                    let data = JSON.stringify(res.data.data);
                    data = data.replace(/attachment_url/g,'url');
                    data = JSON.parse(data);
                    for(let i=0;i<data.length;i++){
                        data[i].name = data[i].attachment_name;
                    };
                    this.fileList = data;
                }
            })
        },
        annexSuccess(res,file,fileList){//上传附件成功
            if(res.success){
                console.log(1)
                res.data.name = res.data.fileName;
                this.fileLength.push(res.data);
            }else{
                this.$message({
                    type:'success',
                    message:'上传附件失败'
                })
            };
            if(this.fileLength.length===fileList.length){
                console.log(0)
                this.showFile = false;
                this.$message({
                    type:'success',
                    message:'上传附件成功'
                });
                this.fileList = this.fileLength.concat(this.fileList);
                this.$refs.annex.clearFiles();  
            };
        },
        annexError(file){//上传附件失败
            this.$message({
                type:'warning',
                message:'网络出现故障'
            });
        },
        handleRemove(index){//删除附件
            // console.log(this.fileList.splice(index,1))
            this.fileList.splice(index,1);
        },
        removeCover(){//移除封面
            this.ruleForm.cover = '';
        },
        // uploadBannerSuccess(res){//上传封面图成功
        //     if(res.success){
        //         this.imgLoading = false;
        //         this.ruleForm.cover = res.data.url;
        //     }else{
        //         this.$message({
        //             message: '上传封面图片失败',
        //             type: 'warning'
        //         });
        //         this.$refs.banner.clearFiles();
        //     }
        // },
        beforeUploadBanner(file){//上传封面之前
            let _this = this;
            let reg = /\.(jpg|png|jpeg)$/;
            if(!reg.test(file.name)){
                this.$message({
                    message: '请选择图片上传',
                    type: 'warning'
                });
                this.$refs.banner.clearFiles();
            };
            let files = file;
            let reader = new FileReader();
            reader.readAsDataURL(files);// 这里也可以直接写参数event.raw
            // 转换成功后的操作，reader.result即为转换后的DataURL ，
            // 它不需要自己定义，你可以console.log(reader.result)看一下
            reader.onload=()=>{
                this.bannerVisible = true;
                this.bannerImg = reader.result;
            }
            // this.imgLoading = true;
            return false;
        },
        updateArticle(){
            let userRange = null;
            let departmentRange = null;
            let date = '';
            let attachment = '';
            let dateRepeat = '';
            if(this.releaseType==3){
                if(this.msgType==2){//是不是图文推送，如果是会有二次推送
                    if(this.sendDate<Date.now()){
                        this.$message({
                            type:'warning',
                            message:'定时推送时间要晚于当前时间'
                        });
                        return;
                    };
                    date = utils.getDateFormatMinute(this.sendDate);
                    if(this.sendRepeat=='1'){
                        dateRepeat = utils.getDateFormatMinute(this.sendSecondTime);
                    }else{
                        dateRepeat = '';
                    };
                }else{
                    if(this.ruleForm.date<Date.now()){
                        this.$message({
                            type:'warning',
                            message:'定时推送时间要晚于当前时间'
                        });
                        return;
                    };
                    date = utils.getDateFormatMinute(this.ruleForm.date);
                };
            }else{
                date = '';
                dateRepeat = '';
                this.sendRepeat = '0';
            };
            if(this.permission=='1'){
                userRange = [];
                departmentRange = [];
                if(this.departmentRange.length){
                    for(let i=0;i<this.departmentRange.length;i++){
                        departmentRange.push(this.departmentRange[i].id)
                    }
                };
                if(this.userRange.length){
                    for(let i=0;i<this.userRange.length;i++){
                        userRange.push(this.userRange[i].id)
                    };
                };
            }else{
                userRange = 0;
                departmentRange = 0;
            };
            if(this.fileList.length>0){
                attachment = JSON.stringify(this.fileList).replace(/fileName/g,'attachment_name').replace(/url/g,'attachment_url').replace(/serverName/g,'attachment_server_name');
            };
            api('/article/updateArticle','POST',{
                title:this.ruleForm.title,
                category:this.ruleForm.category,
                msgType:this.msgType,
                content:this.ruleForm.content,
                commentLimit:this.comment,
                likeLimit:this.like,
                abstract:this.ruleForm.abstract,
                type:this.releaseType,
                creater:utils.getCookie('username'),
                h5url:this.msgType==3?this.ruleForm.h5link:'',
                cover:this.msgType!=1?this.ruleForm.cover:'',
                attachment:attachment,
                sendTime:date,
                mail:this.msgType==2?this.mail:'',
                sendRepeat:this.sendRepeat,
                sendSecondTime:dateRepeat,
                userRange:userRange===0?0:userRange.join(','),
                departmentRange:departmentRange===0?0:departmentRange.join(','),
                uuid:this.$route.query.uuid,
            },{'Content-Type': 'application/x-www-form-urlencoded'})
            .then(res=>{
                if(res.data.success){
                    if(this.releaseType==1){
                        this.$message({
                            message: '保存草稿成功',
                            type: 'success'
                        });
                        setTimeout(()=>{
                            this.$router.go(-1);
                        },1000)
                    }else if(this.releaseType==2){
                        this.$message({
                            message: '发布成功',
                            type: 'success'
                        });
                        setTimeout(()=>{
                            this.$router.go(-1);
                        },1000)
                    }else{
                        this.$message({
                            message: '定时发布成功',
                            type: 'success'
                        });
                        setTimeout(()=>{
                            this.$router.go(-1);
                        },1000)
                    }
                }else{
                   this.$message({
                        message: '发布失败'+res.data.errorMsg,
                        type: 'error'
                    }); 
                }
            })
        },
        traverseTree(arr){
            arr = arr;
            let arr1 = [];
            for(let i=0,iLen=arr.length;i<iLen;i++){
                if(arr[i].childCategory.length>0){
                    arr1 = arr[i].childCategory;
                    this.traverseTree(arr1);
                }else{
                    this.options.push(arr[i]);
                }
            };
        },
        getMenu(){
            api('/category/getCategoryList','GET',{
                workCode:utils.getCookie('username'),
            })
            .then(res=>{
                if(res.data.success){
                    let data = res.data.data;
                    this.traverseTree(data);
                }
            })
        },
        beforeVideo(file){
            let reg = /(mp4|ogg|webm)$/;
            let type = file.type.split('/')[1];
            if(!reg.test(type)){
                this.$message({
                    message: '请上传mp4、ogg、webm格式的视频文件',
                    type: 'warning'
                });
                this.$refs.uploadVideo.clearFiles();
                return false;
            };
            this.videoData.file = file;
        },
        uploadVideoSuccess(res){
            if(res.success){
            const str = '<iframe style="height:300px;" src='+res.data.url+' controls="controls"></iframe>'
                this.ruleForm.content+=str;
            }
        },
        uploadVideo(){//触发上传视屏按钮
            this.$refs.uploadVideoClick.$el.click();
        },
        uploadWord(){//触发上传word按钮
            this.$refs.uploadClick.$el.click();
        },
        uploadSuccess(res){
            console.log(res)
            this.ruleForm.content = res;
            this.$refs.upload.clearFiles();
        },
        beforeAvatarUpload(file){
            let reg = /\.(doc|docx)$/;
            if(!reg.test(file.name)){
                this.$message({
                    message: '请上传word文件',
                    type: 'warning'
                });
                this.$refs.upload.clearFiles();
                return false;
            };
            this.uploadData.file = file;
        },
        onEditorChange(val){
        },
        cancle(){
            this.$router.go(-1);
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if(valid) {
                    this.updateArticle();
                }else {
                    return false;
                }
            });
        },
        updateData(){
            
        },
        getMenu(){
            api('/category/getCategoryList','GET',{
                workCode:utils.getCookie('username'),
            })
            .then(res=>{
                if(res.data.success){
                    let data = res.data.data;
                    this.traverseTree(data);
                    // this.tree = data;
                    this.getDetaile();
                }
            })
        },
        getDetaile(){//获取正文信息
            api("/article/getArticleDetail",'GET',{
                uuid:this.$route.query.uuid
            })
            .then(res=>{
                if(res.data.success){
                    let data = res.data.data;
                    this.ruleForm = {
                        title: data.title,//题目名称
                        content:data.content,
                        h5link:data.h5url,//h5链接
                        cover:data.cover,
                        date:data.type=='3'?data.sendTime*1000:'',
                        category:Number(data.category),//文档分类
                        abstract:data.abstract,
                    };
                    this.getCoverList(data.category);
                    this.msgType = data.msgType;
                    this.mail = String(data.mail);
                    this.releaseType = Number(data.type);
                    this.comment =  data.commentLimit;
                    this.like = data.likeLimit;
                    // this.sendDate = data.sendTime*1000;
                    if(data.departmentRange=='0'||data.userRange=='0'||data.departmentRange===0||data.userRange===0){
                        this.permission = '0';
                    }else{
                        this.permission = '1';
                        this.userIsOk = true;
                    };
                    if(data.type=='3'){
                        this.sendDate = data.sendTime*1000;
                        if(data.sendRepeat=='1'){
                            this.sendRepeat = '1';
                            this.sendSecondTime = data.sendSecondTime*1000;
                        }else{
                            this.sendRepeat = '0';
                        }
                    };
                    let list = String(data.departmentRange).split(',').concat(String(data.userRange).split(','));
                    let objArr = [];
                    for(let i=0;i<list.length;i++){
                        if(list[i].length){
                            objArr.push({
                                id:list[i]
                            })
                        }
                    };
                    setTimeout(()=>{
                        this.$refs.tree2.setCheckedNodes(objArr);
                        let checkList = this.$refs.tree2.getCheckedNodes();
                        if(checkList.length>0){
                            for(let i=0;i<checkList.length;i++){
                                if(checkList[i].supdepid!='-1'){
                                    this.departmentRange.push({
                                        name:checkList[i].departmentname,
                                        id:checkList[i].id
                                    })
                                }else{
                                    this.userRange.push({
                                        name:checkList[i].departmentname,
                                        id:checkList[i].id
                                    })
                                };
                            };
                        };
                    },500);
                }
            })
        },
        getOrg(){
            this.showLoading = true;
            api('/hrm/getOrg','GET')
            .then(res=>{
                this.showLoading = false;
                if(res.data.success){
                    this.departmentList = res.data.data;
                    this.getMenu();
                }
            })
            .catch(err=>{
                this.showLoading = false;
            })
        },
    },
    mounted(){
        this.getOrg();
        this.getAttachmentList();
    }
}
</script>
<style scope>
    .demo-ruleForm{
        background: #fff;
        /* margin: 20px 20px 0; */
        padding: 20px;
    }
    .container{
        width:100%;
        max-height: 90vh;
        background: #f7f7f7;
        padding:20px;
        padding-bottom:0;
        box-sizing: border-box;
    }
    .input{
        width: 320px;
        white-space:normal;
        word-wrap:break-word;
        word-break:break-all;
    }
    .tree-wrap{
        position: absolute;
        width: 240px;
        left: 0;
        top: 40px;
        background: #F2F6FC;
        z-index: 999;
        padding-bottom: 20px;
        text-align: center;
    }
    .tree-wrap .tree{
        background: #F2F6FC;
        color: #000;
    }
    .tree-wrap .tree{
      overflow-y: scroll;
      height: 200px;
    }
    .showdepart{
        height: 200px;
        width: 500px;
        overflow-y: scroll;
        border: 1px solid #eee;
        border-radius: 4px;
        margin-bottom: 10px;
        display: inline-block;
    }
    .showdepart .item{
        padding:4px 20px 3px;
        background: #eee;
        border-radius: 4px;
        margin-left: 10px;
        margin-top: 10px;
        height: 24px;
        line-height: 24px;
    }
    .elitem{
        padding-left:10px;
        position: relative;
    }
    .elitem::before{
        content: '*';
        color: #f56c6c;
        display: inline-block;
        position: absolute;
        left: 0;
        top: 10px;
    }
    .tips{
        color: #999;
    }
   /*  .textarea{
        -webkit-appearance: none;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #606266;
        font-size: inherit;
        height: 20px;
        line-height: 20px;
        outline: 0;
        padding: 0 15px;
        width: 300px;
        -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    } */
    .avatar-uploader{
        width: 240px;
        height: 102px;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .el-form-item__content .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 240px;
        height: 102px;
        line-height: 102px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .cover{
        position: relative;
        border-radius: 5px;
        overflow: hidden;
        width: 240px;
        height: 102px;
    }
    .cover:hover .mask{
        display: block;
    }
    .cover .mask{
        position: absolute;
        display: none;
        line-height: 102px;
        text-align: center;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.5)
    }
    .mask i{
        font-size: 24px;
        color: #fff;
        cursor: pointer;
    }
    .button{
        display: inline-block;
        width: 98px;
        height: 40px;
        line-height: 40px;
        outline: none;
        border: 1px solid #eee;
        border-radius: 4px;
        margin: 0 5px;
        text-align: center;
    }
    .button.active{
        border-color: #409EFF;
        color: #409EFF;
    }
    .cfpa-quill-editor{
        max-height: 500px;
        overflow-y: scroll;
    }
    .treewrap{
        position: fixed;
        top: 200px;
        left: 50%;
        width: 540px;
        margin-left: -200px;
        background: #fff;
        z-index: 99;
        border-radius: 2px;
    }
    .treewrap .head{
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: #222;
        background: #efefef;
        padding-left: 30px;

    }
    .treewrap .tree{
        text-align: center;
        width: 269px;
        height: 350px;
        padding-top: 18px;
        border-right: 1px solid #eee;
    }
    .treewrap .list{
        width: 270px;
        height: 350px;
        padding-top: 18px;
    }
    .treewrap .list p{
        margin-left: 20px;
        height: 28px;
        line-height: 28px;
    }
    .treewrap .footer{
        background: #efefef;
        text-align: right;
        padding: 0 10px;
        height: 50px;
        line-height: 50px;
    }
    .treewrap .filter-tree{
        height: 300px;
        overflow-y: scroll;
        margin-left: 44px;
        background: rgb(242, 242, 242,.5);
        padding-bottom: 10px;
        margin-right: 10px;
        margin-top: 15px;
    }
    .treewrap .range{
        height: 300px;
        overflow-y: scroll;
        margin-top: 15px;
    }
    .treewrap .range li{
        padding-left: 20px;
        line-height: 22px;
        cursor: pointer;
    }
    .treewrap .range li:hover{
        background: rgb(242, 242, 242,.5);
    }
    .close{
        height: 16px;
        vertical-align: middle;
    }
    .mask{
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        background: rgb(0, 0, 0,.3);
        z-index: 10;
    }
    .textarea{
        min-height: 54px;
        width: 480px;
        border: 1px solid #ddd;
        border-radius: 5px;
        max-height: 180px;
        overflow-y: scroll;
        padding: 8px 0;
    }
    .textarea:hover{
        border-color: #409EFF;
    }
    .textarea li{
        padding:4px 8px;
        background: #eee;
        float: left;
        line-height: 14px;
        margin-left: 4px;
        margin-top: 5px;
        border-radius: 4px;
    }
    .filelist{
        width: 300px;
        padding-left: 5px;
    }
    .filelist i{
        color:#909399;
    }
    .filelist .el-icon-close{
        position: absolute;
        top: 5px;
        right: 5px;
        cursor: pointer;
        opacity: .75;
        color: #606266;
        display: none;
    }
    .filelist .file_item{
        position: relative;
        line-height:25px;
        margin-top: 5px;
    }
    .filelist .file_item a{
        color:#606266;
        display: inline-block;
        width: 260px;
        line-height:25px;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .filelist .file_item:hover {
        background-color: #f4f4f4;
    }
    .filelist .file_item:hover .el-icon-close{
        display: block;
    }
    .cover-item{
        width:240px;
        height:102px;
        margin:10px 4px;
        border:2px solid transparent;
    }
    .cover-item:hover{
        border-color: rgb(64, 158, 255);
    }
    .cover-item.checked{
        border-color: rgb(64, 158, 255);
    }
    .cover-item img{
        width: 100%;
        height:100%;
        cursor: pointer;
     }
</style>



















































