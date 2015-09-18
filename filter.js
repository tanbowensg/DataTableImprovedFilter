
/**
 * [improvedFilter 给Datatables添加一个过滤器功能]
 * Author - TanBowen
 * @param  {[object]} table [Datatable对象，必须要是1.10以上的datatables]
 */
var improvedFilter = function(table) {
    // var tempArray;
    var filterNumList = [];
    var tempKeywordList = {};
    var tempKeywordList = {};

    //这个是弹出提示的内容
    var textHtml = '<form class="form-horizontal">' +
        '<div class="controls">' +
        '<select class=" improved-judge">' +
        '<option value="equal" selected="selected">等于</option>' +
        '<option value="include">包括</option>' +
        '<option value="notequal">不等于</option>' +
        '<option value="notinclude">不包括</option>' +
        '</select>' +
        '</div>' +

        '<div class="controls">' +
        '<input type="text" class="improved-keyword">' +
        '</div>' +
        '</div class="controls">' +
        '<button class="improved improved-text-search btn btn-sm btn-primary">应用</button>' +
        '<button class="improved improved-text-clear btn btn-sm btn-warning">清除</button>' +
        '</div>' +
        '</form>';

    var numHtml = '<form class="form-horizontal">' +
        '<div class="controls">' +
        '<input type="text" class="improved-min" placeholder="最小值">' +
        '</div>' +

        '<div class="controls">' +
        '<input type="text" class="improved-max" placeholder="最大值">' +
        '</div>' +
        '<div class="controls">' +
        '<button class="improved improved-num-search btn btn-sm btn-primary">应用</button>' +
        '<button class="improved improved-num-clear btn btn-sm btn-warning">清除</button>' +
        '</div>' +
        '</form>';

    var textOption = {
        animation: false,
        html: true,
        placement: 'bottom',
        tigger: 'click',
        title: '文字筛选',
        content: textHtml,
    }

    var numOption = {
        animation: false,
        html: true,
        placement: 'bottom',
        tigger: 'click',
        title: '数值筛选',
        content: numHtml,
    }

    //将格式去除后，判断其是不是数字
    function isNumber(num) {
        //以免传入纯数字或者undefined导致下面的replace出错
        num = deFormat(num);

        if (!isNaN(num)) {
            return true;
        }

        return false;
    }

    function deFormat(num) {
        if (num === undefined) {
            return NaN;
        }
        if (!isNaN(num)) {
            return num;
        }
        // 一个列表，自动过滤列表里的符号，以免把数据当成文本
        var except = ["￥", "%", ',','¥'];
        for (var j = 0; j < except.length; j++) {
            var reg = new RegExp(except[j],"g");
            num = num.replace(reg, '');
        }
        return num;
    }

    //遍历表格中的每一列
    table.columns().indexes().flatten().each(function(i) {

        var column = table.column(i);

        $(column.header()).on("mouseover", function() {
            $(this).find(".unfiltered").css("visibility", "visible");
        })

        $(column.header()).on("mouseout", function() {
            $(this).find(".unfiltered").css("visibility", "hidden");
        })

        //筛选文字
        var filterDiv = $('<span id="filterIcon' + i + '" class="filterIcon unfiltered"><img src="filter.png"></span>');

        //column.data()[0])代表第一行第i列的值，如果这个值是数值，就显示数值筛选，否则就显示文字筛选
        if (isNumber(column.data()[0])) {
            filterDiv.popover(numOption);
        } else {
            filterDiv.popover(textOption);
        }

        filterDiv.prependTo($(column.header()))
            .click(function(event) {
                event.preventDefault();
                event.stopPropagation();

                var that = this;

                if($('.popover')[0]===undefined){
                    return false
                }

                //阻止事件冒泡
                $(this).next().click(function(event) {
                        event.stopPropagation();
                })

                // 恢复缓存的关键词
                if (tempKeywordList[i] !== undefined && tempKeywordList[i].key !== undefined) {
                    $('.improved-keyword').val(tempKeywordList[i].key);
                    $('.improved-judge').val(tempKeywordList[i].judge);
                } else if (tempKeywordList[i] !== undefined) {
                    $('.improved-min').val(isNaN(tempKeywordList[i].min) ? '' : tempKeywordList[i].min);
                    $('.improved-max').val(isNaN(tempKeywordList[i].max) ? '' : tempKeywordList[i].max);
                }

                //给文字筛选的提交按钮绑定事件
                $(this).next().find(".improved-text-search").on("click", function(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    //获取搜索词和逻辑关系
                    var key = $(that).next().find('.improved-keyword').val();
                    var judge = $(that).next().find(".improved-judge").find("option:selected").val();

                    // 用来缓存设置的关键词，因为popover一旦消失，这个元素就被删除了，所有数据都没了
                    tempKeywordList[i] = {
                        key: key,
                        judge: judge,
                    };

                    //开始判断
                    if (key == '') {
                        table.column(i).search('').draw();
                    } else {
                        switch (judge) {
                            case 'equal':
                                key = '^' + key + '$';
                                table.column(i).search(key, true, false).draw();
                                break;
                            case 'include':
                                table.column(i).search(key).draw();
                                break;
                            case 'notequal':
                                key = '^(?!' + key + '$).+$';
                                table.column(i).search(key, true, false).draw();
                                break;
                            case 'notinclude':
                                key = '(?!.*' + key + ')^.*$';
                                table.column(i).search(key, true, false).draw();
                                break;
                        }
                    }

                    $(that).removeClass("unfiltered").children().prop('src', 'filter2.png');
                    $(that).trigger('click'); //关闭弹出框
                });

                //给文字筛选的清除按钮绑定事件，其实就是用空关键词重新搜索一下啦。
                $(this).next().find(".improved-text-clear").on("click", function(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    tempKeywordList[i] = {
                        key: '',
                        judge: 'equal'
                    };

                    table.column(i).search('').draw();

                    $(that).trigger('click'); //关闭弹出框

                    $(that).addClass("unfiltered").children().prop('src', 'filter.png');

                });

                //给数值筛选的提交按钮绑定事件，其实就是执行一次没有关键词的搜索啦。
                //因为下面那个函数是每次搜索之后自动执行的。
                $(this).next().find(".improved-num-search").on("click", function(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    tempKeywordList[i] = {
                        min: parseFloat($('.improved-min').val()),
                        max: parseFloat($('.improved-max').val()),
                    };

                    table.column(i).search('').draw();

                    $(that).trigger('click'); //关闭弹出框

                    $(that).removeClass("unfiltered").children().prop('src', 'filter2.png');
                });

                //给数值筛选的清除按钮绑定事件，其实就是用空关键词重新搜索一下啦。
                $(this).next().find(".improved-nuc-nlear").on("click", function(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    tempKeywordList[i] = {};

                    table.column(i).search('').draw();

                    $(that).trigger('click'); //关闭弹出框

                    $(that).addClass("unfiltered").children().prop('src', 'filter.png');
                });
            });

        //筛选数字
        //每完成一次搜索都会自动执行下面的函数
        $.fn.dataTable.ext.search.push(
            function(settings, data, dataIndex) {
                var deformtedNum = deFormat(data[i]);
                if (!isNaN(deformtedNum)) {
                    if (deformtedNum === '') {
                        return true
                    }
                    if (tempKeywordList[i] !== undefined) {
                        var min = tempKeywordList[i].min;
                        var max = tempKeywordList[i].max;
                        var age = deformtedNum;
                        if ((isNaN(min) && isNaN(max)) ||
                            (isNaN(min) && age <= max) ||
                            (min <= age && isNaN(max)) ||
                            (min <= age && age <= max)) {
                            return true;
                        }
                        return false;
                    }
                    return true
                } else {
                    return true;
                }
            }
        );
    })
}


$(function() {

    var table = $('#example').DataTable({
        "data": dataSet,
        "columns": [{
            "title": "Engine"
        }, {
            "title": "Browser"
        }, {
            "title": "Platform"
        }, {
            "title": "Version",
            "class": "center"
        }, {
            "title": "Grade",
            "class": "center"
        }],
        "search": false,
    })

    improvedFilter(table);
})