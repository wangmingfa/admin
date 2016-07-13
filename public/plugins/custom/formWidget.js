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

    var settings = $.extend({
        id: "",
        name: "",
        style:"",
        selected: 0,
        event: {},
        options: []
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
    var settings = $.extend({
        title: "",
        cls: "form-horizontal",
        onsubmit: "return false",
        elements: []
    }, options);

    var $widget = $($.getResultFromTemplate('<form class="{{cls}}" onsubmint="{{onsubmit}}"></form>', settings));

    settings.elements.forEach(function(element, index){
        //for(var element in settings.element){
        var type = element.type;
        var options = element.options;
        var $element = $[type](options);
        var template = '<div class="form-group">' +
            '<label class="control-label col-sm-2">{{required}}{{title}}</label>' +
            '<div class="col-sm-10 element"></div>' +
            '</div>';
        options.required = options.required ? "<span class='text-danger'>*</span>" : "";
        var $formGroup = $($.getResultFromTemplate(template, options));
        $formGroup.find(".element").append($element);
        $widget.append($formGroup);
        //}
    });

    return $.modal({
        title: settings.title,
        content: $widget,
        size: "lg"
    });
}