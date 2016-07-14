$.getResultFromTemplate = function(template, data, onEvery){
    return template.replace(/{{[a-zA-Z_-]{1,}}}/g, function(value, index, oldStr){
        value = value.replace("{{", "").replace("}}", "");
        var result = data[value];
        if(typeof onEvery === "function"){
            result = onEvery(data, value);
        }
        return result === 0 ? result : (result || "");
    });

}