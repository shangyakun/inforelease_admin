<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100vh;
    background: #f7f7f7;
}
.el-tooltip__popper{
    max-width: 40%;
}
.el-form-item__content .ql-toolbar{
    line-height: 20px;
}
.ql-editor iframe{
    height: 300px;
    width: 100%;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 240px;
    height: 102px;
    line-height: 102px;
    text-align: center;
}
.table iframe{
    height: 300px;
}
.htmls {
    padding-bottom: 150px;
}
.htmls p{
    text-align: center;
}
#app .edit_container{
    position: relative;
    padding-top: 42px;
    border: 1px solid #ccc;
    width: 700px;
}
.ql-container{
    border-top: 1px solid #ccc;
}
#app .ql-toolbar.ql-snow  {
    border: none;
}
#app .ql-container.ql-snow{
    border: none;
}
#app #toolbar{
    position: absolute;
    top: 0;
    width: 100%;
    height: 42px;
    border-bottom: 1px solid #ccc;
}
</style>










