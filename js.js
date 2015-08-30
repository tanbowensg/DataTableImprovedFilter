var dataSet = [
    ['Trident','Internet Explorer 4.0','Win 95+','4','X'],
    ['Trident','Internet Explorer 5.0','Win 95+','5','C'],
    ['Trident','Internet Explorer 5.5','Win 95+','5.5','A'],
    ['Trident','Internet Explorer 6','Win 98+','6','A'],
    ['Trident','Internet Explorer 7','Win XP SP2+','7','A'],
    ['Trident','AOL browser (AOL desktop)','Win XP','6','A'],
    ['Gecko','Firefox 1.0','Win 98+ / OSX.2+','1.7','A'],
    ['Gecko','Firefox 1.5','Win 98+ / OSX.2+','1.8','A'],
    ['Gecko','Firefox 2.0','Win 98+ / OSX.2+','1.8','A'],
    ['Gecko','Firefox 3.0','Win 2k+ / OSX.3+','1.9','A'],
    ['Gecko','Camino 1.0','OSX.2+','1.8','A'],
    ['Gecko','Camino 1.5','OSX.3+','1.8','A'],
    ['Gecko','Netscape 7.2','Win 95+ / Mac OS 8.6-9.2','1.7','A'],
    ['Gecko','Netscape Browser 8','Win 98SE+','1.7','A'],
    ['Gecko','Netscape Navigator 9','Win 98+ / OSX.2+','1.8','A'],
    ['Gecko','Mozilla 1.0','Win 95+ / OSX.1+',1,'A'],
    ['Gecko','Mozilla 1.1','Win 95+ / OSX.1+',1.1,'A'],
    ['Gecko','Mozilla 1.2','Win 95+ / OSX.1+',1.2,'A'],
    ['Gecko','Mozilla 1.3','Win 95+ / OSX.1+',1.3,'A'],
    ['Gecko','Mozilla 1.4','Win 95+ / OSX.1+',1.4,'A'],
    ['Gecko','Mozilla 1.5','Win 95+ / OSX.1+',1.5,'A'],
    ['Gecko','Mozilla 1.6','Win 95+ / OSX.1+',1.6,'A'],
    ['Gecko','Mozilla 1.7','Win 98+ / OSX.1+',1.7,'A'],
    ['Gecko','Mozilla 1.8','Win 98+ / OSX.1+',1.8,'A'],
    ['Gecko','Seamonkey 1.1','Win 98+ / OSX.2+','1.8','A'],
    ['Gecko','Epiphany 2.20','Gnome','1.8','A'],
    ['Webkit','Safari 1.2','OSX.3','125.5','A'],
    ['Webkit','Safari 1.3','OSX.3','312.8','A'],
    ['Webkit','Safari 2.0','OSX.4+','419.3','A'],
    ['Webkit','Safari 3.0','OSX.4+','522.1','A'],
    ['Webkit','OmniWeb 5.5','OSX.4+','420','A'],
    ['Webkit','iPod Touch / iPhone','iPod','420.1','A'],
    ['Webkit','S60','S60','413','A'],
    ['Presto','Opera 7.0','Win 95+ / OSX.1+','-','A'],
    ['Presto','Opera 7.5','Win 95+ / OSX.2+','-','A'],
    ['Presto','Opera 8.0','Win 95+ / OSX.2+','-','A'],
    ['Presto','Opera 8.5','Win 95+ / OSX.2+','-','A'],
    ['Presto','Opera 9.0','Win 95+ / OSX.3+','-','A'],
    ['Presto','Opera 9.2','Win 88+ / OSX.3+','-','A'],
    ['Presto','Opera 9.5','Win 88+ / OSX.3+','-','A'],
    ['Presto','Opera for Wii','Wii','-','A'],
    ['Presto','Nokia N800','N800','-','A'],
    ['Presto','Nintendo DS browser','Nintendo DS','8.5','C/A<sup>1</sup>'],
    ['KHTML','Konqureror 3.1','KDE 3.1','3.1','C'],
    ['KHTML','Konqureror 3.3','KDE 3.3','3.3','A'],
    ['KHTML','Konqureror 3.5','KDE 3.5','3.5','A'],
    ['Tasman','Internet Explorer 4.5','Mac OS 8-9','-','X'],
    ['Tasman','Internet Explorer 5.1','Mac OS 7.6-9','1','C'],
    ['Tasman','Internet Explorer 5.2','Mac OS 8-X','1','C'],
    ['Misc','NetFront 3.1','Embedded devices','-','C'],
    ['Misc','NetFront 3.4','Embedded devices','-','A'],
    ['Misc','Dillo 0.8','Embedded devices','-','X'],
    ['Misc','Links','Text only','-','X'],
    ['Misc','Lynx','Text only','-','X'],
    ['Misc','IE Mobile','Windows Mobile 6','-','C'],
    ['Misc','PSP browser','PSP','-','C'],
    ['Other browsers','All others','-','-','U']
];


$(function () {
 
    var table = $('#example').DataTable({
            "data": dataSet,
        "columns": [
            { "title": "Engine" },
            { "title": "Browser" },
            { "title": "Platform" },
            { "title": "Version", "class": "center" },
            { "title": "Grade", "class": "center" }
        ],
    })

    $('#min, #max').keyup( function() {
            console.log('hhh');
            table.draw();
    });

    table.columns().indexes().flatten().each(function (i) {
        var column = table.column(i);
        //筛选文字
        var select = $('#judge').appendTo($(column.header()));
        var key=$('<input type="text" id="keyword">').appendTo($(column.header()));
        var search=$('<button class="search">提交</button>').appendTo($(column.header()))
            .on("click",function(){
                var key=$(this).siblings('input').val();
                var judge=$("#judge").find("option:selected").val();
                // var judge=$(this).siblings('select').find("option:selected").val();
                if (key==''){
                    table.column(i).search('').draw();
                }
                else{
                    switch (judge){
                        case 'equal':
                        key='^'+key+ '$';
                            //table.fnFilter(key,i,true).fnDraw();
                            table.column(i).search(key, true, false).draw();
                            break;
                        case 'include':
                            table.column(i).search(key).draw();
                            break;
                        case 'notequal':
                            key='(?!.*'+key+')^.*$';
                            table.column(i).search(key, true, false).draw();
                            break;
                        case 'notinclude':
                            key='(?!.*'+key+')^.*$';
                            table.column(i).search(key, true, false).draw();
                            break;
                    }
                }
            })
        //筛选数字
        $.fn.dataTable.ext.search.push(
            function( settings, data, dataIndex ) {
                if (!isNaN(data[3])){
                    var min = parseFloat($('#min').val());
                    var max = parseFloat($('#max').val());
                    var age = parseFloat( data[3] ) || 0; // use data for the age column
             
                    if ( ( isNaN( min ) && isNaN( max ) ) ||
                         ( isNaN( min ) && age <= max ) ||
                         ( min <= age   && isNaN( max ) ) ||
                         ( min <= age   && age <= max ) )
                    {
                        console.log('ok');
                        return true;
                    }
                    return false;
                }
                else{
                    return true;
                }
            }
        );
    })
})

        
         


    // table.columns().indexes().flatten().each(function (i) {

    //    var column = table.column(i);
    //    var $span = $('<span class="addselect">▾</span>').appendTo($(column.header()))
    //    var select = $('<select><option value="">All</option></select>')
    //            .appendTo($(column.header()))
    //            .on('click', function (evt) {
    //                evt.stopPropagation();
    //                var val = $.fn.dataTable.util.escapeRegex(
    //                        $(this).val()
    //                );
    //                column
    //                        .search(val ? '^' + val + '$' : '', true, false)
    //                        .draw();
    //            });
    //    column.data().unique().sort().each(function (d, j) {


    //        select.append('<option value="' + d + '">' + d + '</option>')
    //        $span.append(select)
    //    });


    // });
