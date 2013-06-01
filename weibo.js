$(function(){
    function clipMe(){
        var item = $(this).closest(".WB_detail,.WB_media_expand");
        var text = item.find(".WB_text").eq(0).text().trim();
        var link = "http://weibo.com" + item.children(".WB_func").find(".WB_time").eq(0).attr("href");

        popBox.pop(text+link);
        return false;
    }


    if(!location.host.match("weibo.com")){
        return;
    }

    console.log($("#pl_content_homeFeed").delegaate);
    $("#pl_content_homeFeed").delegate(".WB_detail,.WB_media_expand","mouseenter",function(){
        var bar = $(this)
            , like = bar.children(".WB_func").find("[action-type=feed_list_like]").eq(0).next()
            , spliter = $('<i class="S_txt3">|</i>')
            , link = $('<a href="javascript:;">摘下</a>')
            , clip = bar.data("clip");

        if(!clip){
            spliter.insertAfter(like);
            link.insertAfter(like);
            link.click(clipMe);
            bar.data("clip",$([link[0],spliter[0]]));
        }else{
            clip.show();
        }
    }).delegate(".WB_detail,.WB_media_expand","mouseleave",function(){
        var clip = $(this).data("clip");
        clip && clip.hide();
    });
    

});