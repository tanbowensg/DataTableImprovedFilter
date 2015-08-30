/**
 * [improvedFilter 给Datatables添加一个过滤器功能]
 * Author - TanBowen
 * @param  {[object]} tableID [tableID]
 */

var dataSet = [
    ['Trident', 'Internet Explorer 4.0', 'Win 95+', '4', 'X'],
    ['Trident', 'Internet Explorer 5.0', 'Win 95+', '5', 'C'],
    ['Trident', 'Internet Explorer 5.5', 'Win 95+', '5.5', 'A'],
    ['Trident', 'Internet Explorer 6', 'Win 98+', '6', 'A'],
    ['Trident', 'Internet Explorer 7', 'Win XP SP2+', '7', 'A'],
    ['Trident', 'AOL browser (AOL desktop)', 'Win XP', '6', 'A'],
    ['Gecko', 'Firefox 1.0', 'Win 98+ / OSX.2+', '1.7', 'A'],
    ['Gecko', 'Firefox 1.5', 'Win 98+ / OSX.2+', '1.8', 'A'],
    ['Gecko', 'Firefox 2.0', 'Win 98+ / OSX.2+', '1.8', 'A'],
    ['Gecko', 'Firefox 3.0', 'Win 2k+ / OSX.3+', '1.9', 'A'],
    ['Gecko', 'Camino 1.0', 'OSX.2+', '1.8', 'A'],
    ['Gecko', 'Camino 1.5', 'OSX.3+', '1.8', 'A'],
    ['Gecko', 'Netscape 7.2', 'Win 95+ / Mac OS 8.6-9.2', '1.7', 'A'],
    ['Gecko', 'Netscape Browser 8', 'Win 98SE+', '1.7', 'A'],
    ['Gecko', 'Netscape Navigator 9', 'Win 98+ / OSX.2+', '1.8', 'A'],
    ['Gecko', 'Mozilla 1.0', 'Win 95+ / OSX.1+', 1, 'A'],
    ['Gecko', 'Mozilla 1.1', 'Win 95+ / OSX.1+', 1.1, 'A'],
    ['Gecko', 'Mozilla 1.2', 'Win 95+ / OSX.1+', 1.2, 'A'],
    ['Gecko', 'Mozilla 1.3', 'Win 95+ / OSX.1+', 1.3, 'A'],
    ['Gecko', 'Mozilla 1.4', 'Win 95+ / OSX.1+', 1.4, 'A'],
    ['Gecko', 'Mozilla 1.5', 'Win 95+ / OSX.1+', 1.5, 'A'],
    ['Gecko', 'Mozilla 1.6', 'Win 95+ / OSX.1+', 1.6, 'A'],
    ['Gecko', 'Mozilla 1.7', 'Win 98+ / OSX.1+', 1.7, 'A'],
    ['Gecko', 'Mozilla 1.8', 'Win 98+ / OSX.1+', 1.8, 'A'],
    ['Gecko', 'Seamonkey 1.1', 'Win 98+ / OSX.2+', '1.8', 'A'],
    ['Gecko', 'Epiphany 2.20', 'Gnome', '1.8', 'A'],
    ['Webkit', 'Safari 1.2', 'OSX.3', '125.5', 'A'],
    ['Webkit', 'Safari 1.3', 'OSX.3', '312.8', 'A'],
    ['Webkit', 'Safari 2.0', 'OSX.4+', '419.3', 'A'],
    ['Webkit', 'Safari 3.0', 'OSX.4+', '522.1', 'A'],
    ['Webkit', 'OmniWeb 5.5', 'OSX.4+', '420', 'A'],
    ['Webkit', 'iPod Touch / iPhone', 'iPod', '420.1', 'A'],
    ['Webkit', 'S60', 'S60', '413', 'A'],
    ['Presto', 'Opera 7.0', 'Win 95+ / OSX.1+', '-', 'A'],
    ['Presto', 'Opera 7.5', 'Win 95+ / OSX.2+', '-', 'A'],
    ['Presto', 'Opera 8.0', 'Win 95+ / OSX.2+', '-', 'A'],
    ['Presto', 'Opera 8.5', 'Win 95+ / OSX.2+', '-', 'A'],
    ['Presto', 'Opera 9.0', 'Win 95+ / OSX.3+', '-', 'A'],
    ['Presto', 'Opera 9.2', 'Win 88+ / OSX.3+', '-', 'A'],
    ['Presto', 'Opera 9.5', 'Win 88+ / OSX.3+', '-', 'A'],
    ['Presto', 'Opera for Wii', 'Wii', '-', 'A'],
    ['Presto', 'Nokia N800', 'N800', '-', 'A'],
    ['Presto', 'Nintendo DS browser', 'Nintendo DS', '8.5', 'C/A<sup>1</sup>'],
    ['KHTML', 'Konqureror 3.1', 'KDE 3.1', '3.1', 'C'],
    ['KHTML', 'Konqureror 3.3', 'KDE 3.3', '3.3', 'A'],
    ['KHTML', 'Konqureror 3.5', 'KDE 3.5', '3.5', 'A'],
    ['Tasman', 'Internet Explorer 4.5', 'Mac OS 8-9', '-', 'X'],
    ['Tasman', 'Internet Explorer 5.1', 'Mac OS 7.6-9', '1', 'C'],
    ['Tasman', 'Internet Explorer 5.2', 'Mac OS 8-X', '1', 'C'],
    ['Misc', 'NetFront 3.1', 'Embedded devices', '-', 'C'],
    ['Misc', 'NetFront 3.4', 'Embedded devices', '-', 'A'],
    ['Misc', 'Dillo 0.8', 'Embedded devices', '-', 'X'],
    ['Misc', 'Links', 'Text only', '-', 'X'],
    ['Misc', 'Lynx', 'Text only', '-', 'X'],
    ['Misc', 'IE Mobile', 'Windows Mobile 6', '-', 'C'],
    ['Misc', 'PSP browser', 'PSP', '-', 'C'],
    ['Other browsers', 'All others', '-', '-', 'U']
];
var improvedFilter = function(tableId) {
    $.fn.dataTable.ext.search=[];
    var table = $("#" + tableId).DataTable(); //
    var tempArray;
    var functionID;
    var filterNumList = [];
    var tempKeywordList = {};
    var tempKeynumList = {};
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
        '</div>' +
        '</form>';

    var numHtml = '<form class="form-horizontal">' +
        '<div class="controls">' +
        '<input type="text" class="improvedMin" placeholder="最小值,1">' +
        '</div>' +

        '<div class="controls">' +
        '<input type="text" class="improvedMax" placeholder="最大值,100">' +
        '</div>' +
        '<div class="controls">' +
        '<button class="improved improvedNumSearch btn btn-sm btn-primary">应用</button>' +
        '<button class="improved improvedNumClear btn btn-sm btn-warning">清除</button>' +
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

        //将格式去除后，判断其是不是数字
    function isNumber(num) {
        //以免传入纯数字或者undefined导致下面的replace出错
        if (num === undefined) {
            return false;
        }

        if (!isNaN(num)) {
            return true;
        }

        return false;
    }

    function deFormat(num) {
        if (num === undefined) {
            return 0;
        }
        var except = ["￥", "%", ','];
        for (var j = 0; j < except.length; j++) {
            num = num.replace(except[j], '');
        }
        return num;
    }

    //遍历表格中的每一列
    table.columns().indexes().flatten().each(function(i) {

        var column = table.column(i);

        // 判断表格的标题是不是复选框，如果是就不添加过滤器了
        if ($(column.header()).children()[0].innerHTML.indexOf('checkbox') !== -1) {
            return;
        }

        $(column.header()).on("mouseover", function() {
            $(this).find(".unfiltered").css("visibility", "visible");
        })

        $(column.header()).on("mouseout", function() {
            $(this).find(".unfiltered").css("visibility", "hidden");
        })

        //筛选文字
        var filterDiv = $('<span id="filterIcon' + i + '" class="filterIcon unfiltered"><img src="Resources/image/filter.png"></span>');

        // function transformToArray (obj){
        //     var array=[];
        //     for (var item in obj){
        //         array.push(obj[item]);
        //     }
        //     return array;
        // }

        // //因为如果用ajax对象生成datatable的花，row(1).data()是一个对象，data()[i]是undefiened,而不是一个数组，为了循环的方便，还是把它弄成数组
        // // if (column.row(1).data()[i]===undefined){
        // //     tempArray=transformToArray(column.row(1).data());
        // // }

        //row(1).data()[i]代表第一行第i列的值，如果这个值是数值，就显示数值筛选，否则就显示文字筛选
        // if (isNaN(tempArray[i])) {
        if (isNumber(column.data()[1])) {
            filterDiv.popover(numOption);
        } else {
            filterDiv.popover(textOption);
        }

        filterDiv.prependTo($(column.header()).children())
            .click(function(event) {
                event.stopPropagation();
                functionID=i;
                var that = this;
                //用bootstrap自带的弹出提示,不知道为什么firefox不能显示   这个框

                //阻止事件冒泡
                $(this).next().click(function(event) {
                        event.stopPropagation();
                    })
                    // 恢复缓存的关键词
                if (tempKeywordList[i] !== undefined) {
                    $('.improvedKeyword').val(tempKeywordList[i].key);
                    $('.improvedJudge').val(tempKeywordList[i].judge);
                } else if (tempKeynumList[i] !== undefined) {
                    $('.improvedMin').val(tempKeynumList[i].min === NaN ? '' : tempKeynumList[i].min);
                    $('.improvedMax').val(tempKeynumList[i].max === NaN ? '' : tempKeynumList[i].max);
                }

                //给文字筛选的提交按钮绑定事件
                $(this).next().find(".improvedTextSearch").on("click", function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    //获取搜索词和逻辑关系
                    var key = $(that).next().find('.improvedKeyword').val();
                    var judge = $(that).next().find(".improvedJudge").find("option:selected").val();
                    // 用来缓存设置的关键词，因为popover一旦消失，这个元素就被删除了，所有数据都没了
                    var tempList = {
                        key: key,
                        judge: judge,
                    };
                    tempKeywordList[i] = tempList;
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
                                key = '^(?!' + key + '$).+$';
                                table.column(i).search(key, true, false).draw();
                                break;
                            case 'notinclude':
                                key = '(?!.*' + key + ')^.*$';
                                table.column(i).search(key, true, false).draw();
                                break;
                        }
                    }



                    $(that).removeClass("unfiltered").children().prop('src', 'Resources/image/filter2.png');
                    $(that).popover('toggle'); //关闭弹出框
                });

                //给文字筛选的清除按钮绑定事件，其实就是用空关键词重新搜索一下啦。
                $(this).next().find(".improvedTextClear").on("click", function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    table.column(i).search('').draw();
                    var key = $(that).next().find('.improvedKeyword').val('');
                    $(that).addClass("unfiltered").children().prop('src', 'Resources/image/filter.png');
                    tempKeywordList[i] = {};
                    $(that).popover('toggle'); //关闭弹出框
                });


                //给数值筛选的提交按钮绑定事件，其实就是执行一次没有关键词的搜索啦。
                //因为下面那个函数是每次搜索之后自动执行的。
                $(this).next().find(".improvedNumSearch").on("click", function(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    tempKeynumList[i] = {
                        min:parseFloat($('.improvedMin').val()),
                        max:parseFloat($('.improvedMax').val()),
                    };

                    table.column(i).search('').draw();

                    $(that).removeClass("unfiltered").children().prop('src', 'Resources/image/filter2.png');
                    $(that).popover('toggle'); //关闭弹出框
                });

                //给数值筛选的清除按钮绑定事件，其实就是用空关键词重新搜索一下啦。
                $(this).next().find(".improvedNumClear").on("click", function(event) {
                    event.preventDefault();
                    $(that).next().find('.improvedMin').val('');
                    $(that).next().find('.improvedMax').val('');
                    table.column(i).search('').draw();
                    tempKeynumList[i] = {};
                    $(that).addClass("unfiltered").children().prop('src', 'Resources/image/filter.png');
                    $(that).popover('toggle'); //关闭弹出框
                });
            });

        //筛选数字
        //每完成一次搜索都会自动执行下面的函数
        $.fn.dataTable.ext.search.push(
            function(settings, data, dataIndex) {
                if (!isNaN(data[i])) {
                    if (data[i] === '') {
                        return true
                    }
                    if(tempKeynumList[i]!==undefined){
                        var min = parseFloat(tempKeynumList[i].min);
                        var max = parseFloat(tempKeynumList[i].max);
                        var age = parseFloat(data[functionID]) || 0; // use data for the age column

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