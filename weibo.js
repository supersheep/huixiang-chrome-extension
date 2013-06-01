$(function(){
    function clipMe(){
        var item = $(this).closest(".WB_detail,.WB_media_expand");
        var text = item.find(".WB_text");
        if(text.length == 2){
            text = text.eq(0);
        }
        text = text.text().trim();
        var time = item.find(".WB_time");
        if(time.length == 2){
            time = time.eq(1);
        }
        var link = "http://weibo.com" + time.attr("href");

        $.post("http://huixiang.im/add/");

        popBox.pop(text+link);
        return false;
    }


    if(!location.host.match("weibo.com")){
        return;
    }

    $("#pl_content_homeFeed,#pl_content_hisFeed,#pl_content_weiboDetail").delegate(".WB_detail,.WB_media_expand","mouseenter",function(){
        var bar = $(this)
            , like = bar.find("[title=赞]").next()
        if(like.length == 2){like = like.eq(1);}
        var spliter = $('<i class="S_txt3">|</i>')
            , link = $('<a href="javascript:;">摘下</a>')
            , clip = bar.data("clip");

        if(!clip){
            spliter.insertAfter(like);
            link.insertAfter(like);
            link.click(clipMe);
            bar.data("clip",$([link[0],spliter[0]]));
        }
    })
    // .delegate(".WB_detail,.WB_media_expand","mouseleave",function(){
    //     var clip = $(this).data("clip");
    //     clip && clip.hide();
    // });
    

});