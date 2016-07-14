//输入框组件
$.input = function(options){
    var template = '<input class="form-control" id="{{id}}" name="{{name}}" type="{{type}}" maxlength="{{maxlength}}" value="{{value}}" style="{{style}}"/>';
    var settings = $.extend({
        id: "",
        name: "",
        type: "",
        maxlength: "",
        value: "",
        style:"",
        formStyle: false,
        event:{}
    }, options);

    var $widget = $($.getResultFromTemplate(template, settings));

    //绑定事件
    for(var eventName in settings.event){
        var eventResponse = settings.event[eventName];
        $widget.on(eventName, eventResponse);
    }

    return $widget;
}

//文本域组件
$.textarea = function(options){
    var template = '<textarea class="form-control" id="{{id}}" name="{{name}}" maxlength="{{maxlength}}" style="{{style}}">{{value}}</textarea>';
    var settings = $.extend({
        id: "",
        name: "",
        maxlength: "",
        value: "",
        style:"",
        event:{}
    }, options);

    var $widget = $($.getResultFromTemplate(template, settings));

    //绑定事件
    for(var eventName in settings.event){
        var eventResponse = settings.event[eventName];
        $widget.on(eventName, eventResponse);
    }

    return $widget;
}

//下拉框组件

$.select = function(options){
    var template = '<select class="form-control" id="{{id}}" name="{{name}}" style="{{style}}"></select>';

    var settings = $.extend(true, {
        id: "",
        name: "",
        style:"",
        selected: 0,
        event: {},
        options: [],
        remote: {
            url: "",
            method: "GET",
            async: true,
            cache: true,
            data: {},
            dataType: "json",
            beforeSend: null,
            complete: null,
            success: function(result){
                result.forEach(function(data, index){
                    var valueField = settings.remote.valueField || "value";
                    var textField = settings.remote.textField || "text";
                    var template = '<option value="{{' + valueField + '}}">{{' + textField + '}}</option>';
                    var $option = $($.getResultFromTemplate(template, data));
                    $widget.append($option);
                });
                $widget.removeAttr("disabled");
            },
            error: null,
            contentType: "application/x-www-form-urlencoded",
            dataFilter: null,
            valueField: "",
            textField: ""
        }
    }, options);

    var $widget = $($.getResultFromTemplate(template, settings));

    //添加选项
    settings.options.forEach(function(option, index){
        var $option = $($.getResultFromTemplate('<option value="{{value}}">{{text}}</option>', option));
        $widget.append($option);
    });

    //设置选中状态
    $widget.find("option").eq(settings.selected).attr("selected", "selected");
    
    //绑定事件
    for(var eventName in settings.event){
        var eventResponse = settings.event[eventName];
        $widget.on(eventName, eventResponse);
    }

    //远程加载数据
    if(settings.remote.url){
        $widget.attr("disabled", "disabled");
        var ajaxOptions = settings.remote;
        $.ajax(ajaxOptions);
    }

    return $widget;
}

//开关
$.switch = function(options){
    var template = '<label style="margin-top: 5px;">' +
                        '<input name="{{name}}" class="ace ace-switch ace-switch ace-switch-{{type}}" type="checkbox">' +
                        '<span class="lbl"></span>' +
                    '</label>';

    var settings = $.extend({
        name: "",
        type: "",
    }, options)

    var $widget = $($.getResultFromTemplate(template, settings));

    $widget.isOn = function(){
        return this.find("[type='checkbox']").prop("checked");
    }

    return $widget;
}

//弹出框表单
$.modalForm = function(options){
    var settings = $.extend(true, {
        title: "",
        cls: "form-horizontal",
        onsubmit: "return false",
        elements: [],
        hideOnReset: true,
        submit: {
            url: "",
            method: "POST",
            timeout: "",
            async: true,
            cache: true,
            data: {},
            dataType: "json",
            beforeSend: null,
            complete: null,
            success: null,
            error: null,
            contentType: "application/x-www-form-urlencoded",
            dataFilter: null,
        },
    }, options);

    var $widget = $($.getResultFromTemplate('<form class="{{cls}}" onsubmint="{{onsubmit}}"></form>', settings));

    settings.elements.forEach(function(element, index){
        var type = element.type;
        var options = element.options;
        options.id = options.id ? options.id : options.name;
        options.name = options.name ? options.name : options.id;
        var $element = $[type](options);
        var template =
            '<div class="form-group {{hidden}}">' +
                '<label class="control-label col-sm-2">{{required}}{{title}}</label>' +
                '<div class="col-sm-10 element"></div>' +
            '</div>';
        options.hidden = options.type == "hidden" ? "hidden" : "";
        options.required = options.required ? "<span class='text-danger'>*</span>" : "";
        var $formGroup = $($.getResultFromTemplate(template, options));
        $formGroup.find(".element").append($element);
        $widget.append($formGroup);
    });

    var $modal = $.modal({
        title: settings.title,
        content: $widget,
        size: "lg",
        onConfirm: function(){
            //TODO validate

            if(settings.submit.url){
                var ajaxOptions = $.extend({}, settings.submit, {data: $widget.serializeJson()});
                $.ajax(ajaxOptions);
            }
        }
    });

    //隐藏表单时清空表单
    $modal.on("hidden.bs.modal", function(){
        $widget[0].reset();
    });

    //表单赋值函数
    $modal.setValue = function(data, onEvery){
        $.setFormValue(data, $widget, onEvery);
        return this;
    }

    return $modal;
}