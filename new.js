var dataSet = [
    [1,2],
    [5,5],
    [5,2],
    [9,5],
    [9,2],
    [9,5],
    [23,6],
    [8,7],
    [5,1],
    [1,2],
    [4,3],
    [7,9],
    [8,2],
    [56,9],
    [5,3],
    [6,6],
    [2,9],
    [47,8],
    [8,2],
    [98,1],
    [54,8],
];

/**
 * [improvedFilter 给Datatables添加一个过滤器功能]
 * Author - TanBowen
 * @param  {[object]} table [Datatable对象，必须要是1.10以上的datatables]
 */
var improvedFilter = function(table) {
    var filterList={};

    //这个是弹出提示的内容
    var textHtml = '<form class="form-horizontal">' +
        '<div class="controls">' +
        '<select class=" improvedJudge">' +
        '<option value="equal">等于</option>' +
        '<option value="include">包括</option>' +
        '<option value="notequal">不等于</option>' +
        '<option value="notinclude">不包括</option>' +
        '</select>' +
        '</div>' +

        '<div class="controls">' +
        '<input type="text" class="improvedKeyword" placeholder="关键词">' +
        '</div>' +
        '</div class="controls">' +
        '<button class="improved improvedTextSearch btn btn-sm btn-primary">应用</button>' +
        '<button class="improved improvedTextClear btn btn-sm btn-warning">清除</button>' +
        '<button class="improved improvedCancel btn btn-sm">关闭</button>' +
        '</div>' +
        '</form>';

    var numHtml = '<form class="form-horizontal">' +
        '<div class="controls">' +
        '<input type="text" class="improvedMin" placeholder="最小值,1">' +
        '</div>' +

        '<div class="controls">' +
        '<input type="text" class="improvedMax" placeholder="最大值,100">' +
        '</div>'
    '</div class="controls">' +
    '<button class="improved improvedNumSearch btn btn-sm btn-primary">应用</button>' +
    '<button class="improved improvedNumClear btn btn-sm btn-warning">清除</button>' +
    '<button class="improved improvedCancel btn btn-sm">关闭</button>' +
    '</div>' +
    '</form>';

    var textOption = {
        animatation: false,
        html: true,
        placement: 'bottom',
        tigger: 'click',
        title: '文字筛选',
        content: textHtml,
    }

    var numOption = {
        animatation: false,
        html: true,
        placement: 'bottom',
        tigger: 'click',
        title: '数值筛选',
        content: numHtml,
    }

    $('#min, #max').keyup(function() {
        table.draw();
    });

    //遍历表格中的每一列
    table.columns().indexes().flatten().each(function(i) {

        var column = table.column(i);

        //筛选文字
        var filterDiv = $('<span class="filterIcon"><img src="filter.png"></span>');

        //row(1).data()[i]代表第一行第i列的值，如果这个值是数值，就显示数值筛选，否则就显示文字筛选
        if (isNaN(column.row(1).data()[i])) {
            filterDiv.popover(textOption);
        } else {
            filterDiv.popover(numOption);
        }

        filterDiv.appendTo($(column.header()))
            .click(function(event) {

                event.stopPropagation();

                var that = this;

                //用bootstrap自带的弹出提示,不知道为什么firefox不能显示这个框

                //阻止事件冒泡
                $(this).next().click(function(event) {
                    event.stopPropagation();
                })

                //给关闭按钮绑定事件
                $(this).next().find(".improvedCancel").on("click", function(event) {
                    event.preventDefault();
                    $(that).popover('hide'); //关闭弹出框
                });

                //给文字筛选的提交按钮绑定事件
                $(this).next().find(".improvedTextSearch").on("click", function(event) {
                    event.preventDefault();
                    //获取搜索词和逻辑关系
                    var key = $(that).next().find('.improvedKeyword').val();
                    var judge = $(that).next().find(".improvedJudge").find("option:selected").val();
                    // var judge=$(this).siblings('select').find("option:selected").val();
                    //开始判断
                    if (key == '') {
                        table.column(i).search('').draw();
                    } else {
                        switch (judge) {
                            case 'equal':
                                key = '^' + key + '$';
                                //table.fnFilter(key,i,true).fnDraw();
                                table.column(i).search(key, true, false).draw();
                                break;
                            case 'include':
                                table.column(i).search(key).draw();
                                break;
                            case 'notequal':
                                key = '(?!.*' + key + ')^.*$';
                                table.column(i).search(key, true, false).draw();
                                break;
                            case 'notinclude':
                                key = '(?!.*' + key + ')^.*$';
                                table.column(i).search(key, true, false).draw();
                                break;
                        }
                    }
                    $(that).children().prop('src', 'filter2.png');
                });

                //给文字筛选的清除按钮绑定事件，其实就是用空关键词重新搜索一下啦。
                $(this).next().find(".improvedTextClear").on("click", function(event) {
                    event.preventDefault();
                    table.column(i).search('').draw();
                    var key = $(that).next().find('.improvedKeyword').val('');
                    $(that).children().prop('src', 'filter.png');
                });


                //给数值筛选的提交按钮绑定事件，其实就是执行一次没有关键词的搜索啦。
                //因为下面那个函数是每次搜索之后自动执行的。
                $(this).next().find(".improvedNumSearch").on("click", function(event) {
                    event.preventDefault();
                    filterList[i]={
                        max:parseFloat($('.improvedMin').val()),
                        min:parseFloat($('.improvedMax').val()),
                    }
                    table.column(i).search('').draw();
                    $(that).children().prop('src', 'filter2.png');
                });

                //给数值筛选的清除按钮绑定事件，其实就是用空关键词重新搜索一下啦。
                $(this).next().find(".improvedNumClear").on("click", function(event) {
                    event.preventDefault();
                    var key = $(that).next().find('.improvedMin').val('');
                    var key = $(that).next().find('.improvedMax').val('');
                    table.column(i).search('').draw();
                    $(that).children().prop('src', 'filter.png');
                });
            });

        //筛选数字
        //每完成一次搜索都会自动执行下面的函数
        $.fn.dataTable.ext.search.push(
            function(settings, data, dataIndex) {
                if (!isNaN(data[i])) {

                    var min=filterList[i].min;
                    var max=filterList[i].max;

                    var age = parseFloat(data[i]) || 0; // use data for the age column

                    if ((isNaN(min) && isNaN(max)) ||
                        (isNaN(min) && age <= max) ||
                        (min <= age && isNaN(max)) ||
                        (min <= age && age <= max)) {
                        return true;
                    }
                    return false;
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
            "title": "A"
        }, {
            "title": "B"
        }],
        "search": false,
    })

    improvedFilter(table);
})