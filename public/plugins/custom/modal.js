$.modal = function(options){
    var template =
                    '<div class="bootbox modal fade" tabindex="-1" role="dialog" aria-hidden="false">' +
                        '<div class="modal-dialog modal-{{size}}">' +
                            '<div class="modal-content">' +
                                '<div class="modal-header">' +
                                '<button type="button" class="bootbox-close-button close" data-dismiss="modal">×</button>' +
                                '<h4 class="modal-title"><i class="{{icon}}"></i>{{title}}</h4>' +
                            '</div>' +
                            '<div class="modal-body">' +
                                '<div class="bootbox-body">' +
                                //'{{content}}' +
                                '</div>' +
                            '</div>' +
                            '<div class="modal-footer">' +
                                '<button data-bb-handler="cancel" type="button" data-dismiss="modal" class="btn btn-default"><i class="icon-remove bigger-110"></i>取消</button>' +
                                '<button data-bb-handler="confirm" type="button" class="btn btn-primary"><i class="icon-ok bigger-110"></i>确定</button></div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';

    var settings = $.extend({
        title: "modal",//标题
        backdrop: "static",//点击遮罩层是否关闭模态框。为false时不关闭，且没有遮罩层；为"static"时不关闭，但有遮罩层
        keyboard: false,//键盘上的 esc 键被按下时关闭模态框
        show: false,//模态框初始化之后就立即显示出来
        remote: false,//如果提供的是 URL，将利用 Global.js中的getModule方法从此 URL 地址加载要展示的内容（只加载一次）并插入 .modal-body 内
        //opener:null,//改模态框的打开者
        content: "",//模态框内容，将添加到.modal-body 内，和remote远程加载的内容共存
        remoteFirst: false,//是否有限加载remote
        size: "",//模态框尺寸，可选。有sm：小尺寸，lg：大尺寸。默认为中尺寸
        onShown: null,//此事件在模态框已经显示出来（并且同时在 CSS 过渡效果完成）之后被触发
        onHidden: null,//此事件在模态框被隐藏（并且同时在 CSS 过渡效果完成）之后被触发。
        beforeShow: null,//显示之前调用
        resetOnHidden: false,//隐藏模态框时是否清空所有表单数据
    }, options);

    var $modal = $($.getResultFromTemplate(template, settings));

    $modal.find(".bootbox-body").html(settings.content);

    $modal.show = function(){
        this.modal("show");
    }

    $modal.hide = function(){
        this.modal("hide");
    }

    return $modal.modal(settings);
}