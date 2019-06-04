/**  公共变量的定义  **/
var httpRequestUrl = "http://localhost:8080";
var uploaderObjOne = null;
var uploaderObjTwo = null;
var uploaderObjThree = null;
var uploaderObjFour = null;

/**  初始化的方法的定义和执行 **/
demoInit();

function demoInit(){

    //初始化文件上传控件
    uploaderObjOne = WUF.init({
        selectFileId:'pickerOne',
        swf_path:'./Uploader.swf',
        server:httpRequestUrl+'/break/fileUpload',
        fileNumLimit:1,
        fileSizeLimit:1024*1024*5,
        fileSingleSizeLimit:1024*1024*5,
        error:function(type){

        }
    });

    //初始化文件上传控件
    uploaderObjTwo = WUF.init({
        selectFileId:'pickerTwo',
        swf_path:'./Uploader.swf',
        server:httpRequestUrl+'/break/fileUpload',
        fileNumLimit:1,
        fileSizeLimit:1024*1024*50,
        fileSingleSizeLimit:1024*1024*50,
        patchOpction:{
            beforeSendFile:function(file){
                // Deferred对象在钩子回掉函数中经常要用到，用来处理需要等待的异步操作。
                var task = new $.Deferred();
                // 根据文件内容来查询MD5
                uploaderObjTwo.md5File(file).progress(function (percentage) {   // 及时显示进度
                    console.log('计算md5进度:', percentage);
                }).then(function (val) { // 完成
                    console.log('md5 result:', val);
                    file.md5 = val;
                    // 模拟用户id
                    // file.uid = new Date().getTime() + "_" + Math.random() * 100;
                    file.uid = WebUploader.Base.guid();
                    // 进行md5判断
                    $.post(httpRequestUrl+"/break/checkFileMd5", {uid: file.uid, md5: file.md5, "Authorization": localStorage.token},
                        function (data) {
                            console.log(data.status);
                            var status = data.status.value;
                            task.resolve();
                            if (status == 101) {
                                // 文件不存在，那就正常流程
                            } else if (status == 100) {
                                // 忽略上传过程，直接标识上传成功；
                                uploaderObjTwo.skipFile(file);
                                file.pass = true;
                            } else if (status == 102) {
                                // 部分已经上传到服务器了，但是差几个模块。
                                file.missChunks = data.data;
                            }
                        });
                });
                return $.when(task);
            },
            beforeSend:function(block){
                console.log("block")
                var task = new $.Deferred();
                var file = block.file;
                var missChunks = file.missChunks;
                var blockChunk = block.chunk;
                console.log("当前分块：" + blockChunk);
                console.log("missChunks:" + missChunks);
                if (missChunks !== null && missChunks !== undefined && missChunks !== '') {
                    var flag = true;
                    for (var i = 0; i < missChunks.length; i++) {
                        if (blockChunk == missChunks[i]) {
                            console.log(file.name + ":" + blockChunk + ":还没上传，现在上传去吧。");
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        task.reject();
                    } else {
                        task.resolve();
                    }
                } else {
                    task.resolve();
                }
                return $.when(task);
            }
        }
    });

    //初始化文件上传控件
    uploaderObjThree = WUF.init({
        selectFileId:'pickerThree',
        selectFileMultiple:true,
        swf_path:'./Uploader.swf',
        server:httpRequestUrl+'/break/fileUpload',
        fileNumLimit:5,
        fileSizeLimit:1024*1024*25,
        fileSingleSizeLimit:1024*1024*5,
    });

    //初始化文件上传控件
    uploaderObjFour = WUF.init({
        selectFileId:'pickerFour',
        selectFileMultiple:true,
        swf_path:'./Uploader.swf',
        server:httpRequestUrl+'/break/fileUpload',
        fileNumLimit:5,
        chunked: true,
        fileSizeLimit:1024*1024*100,
        fileSingleSizeLimit:1024*1024*100,
        patchOpction:{
            beforeSendFile:function(file){
                // Deferred对象在钩子回掉函数中经常要用到，用来处理需要等待的异步操作。
                var task = new $.Deferred();
                // 根据文件内容来查询MD5
                uploaderObjTwo.md5File(file).progress(function (percentage) {   // 及时显示进度
                    console.log('计算md5进度:', percentage);
                }).then(function (val) { // 完成
                    console.log('md5 result:', val);
                    file.md5 = val;
                    // 模拟用户id
                    // file.uid = new Date().getTime() + "_" + Math.random() * 100;
                    file.uid = WebUploader.Base.guid();
                    // 进行md5判断
                    $.post(httpRequestUrl+"/break/checkFileMd5", {uid: file.uid, md5: file.md5, "Authorization": localStorage.token},
                        function (data) {
                            console.log(data.status);
                            var status = data.status.value;
                            task.resolve();
                            if (status == 101) {
                                // 文件不存在，那就正常流程
                            } else if (status == 100) {
                                // 忽略上传过程，直接标识上传成功；
                                uploaderObjTwo.skipFile(file);
                                file.pass = true;
                            } else if (status == 102) {
                                // 部分已经上传到服务器了，但是差几个模块。
                                file.missChunks = data.data;
                            }
                        });
                });
                return $.when(task);
            },
            beforeSend:function(block){
                console.log("block")
                var task = new $.Deferred();
                var file = block.file;
                var missChunks = file.missChunks;
                var blockChunk = block.chunk;
                console.log("当前分块：" + blockChunk);
                console.log("missChunks:" + missChunks);
                if (missChunks !== null && missChunks !== undefined && missChunks !== '') {
                    var flag = true;
                    for (var i = 0; i < missChunks.length; i++) {
                        if (blockChunk == missChunks[i]) {
                            console.log(file.name + ":" + blockChunk + ":还没上传，现在上传去吧。");
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        task.reject();
                    } else {
                        task.resolve();
                    }
                } else {
                    task.resolve();
                }
                return $.when(task);
            }
        }
    });

}

/**  方法的定义 **/

//开始上传 上传单张图片
function uploaderOne(){
    uploaderObjOne.upload();

}

//开始上传 分片上传单张图片
function uploaderTwo(){
    uploaderObjTwo.upload();
}

//开始上传 上传多张图片
function uploaderThree(){
    uploaderObjThree.upload();
}

//开始上传 分片上传多张图片
function uploaderFour(){
    uploaderObjFour.upload();
}
