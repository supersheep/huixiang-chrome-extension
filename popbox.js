(function(win){

    var WriteBox = {};
    var LIMIT = 140;
    Ev.mixin(WriteBox);

    function init(content){
        var posting = false;

        var hint = content.find(".hint");
        var textarea = content.find("textarea");
        var link = content.find(".link").attr("href");
        var btn = content.find(".btn");
        var sharebtns = content.find(".sharebtn");

        sharebtns.on("click",function(e){
            e.preventDefault();
            $(this).toggleClass("active")
        })
        btn.on("click",function(){
            var val = textarea.val().trim();
            var share = [];
            if(!val.length){
                return false;
            }

            sharebtns.filter('.active').each(function(i,el){
                var type = $(el).attr("data-type");
                share.push(type);
            });
            
            if(!posting){
                posting = true;
                $.ajax({
                    url:"/ajax/add",
                    method:"post",
                    dataType:"json",
                    data:{
                        share:share.join(","),
                        content:val,
                        link:link
                    }
                }).success(function(json){
                    posting = false;
                    if(json.code == 200 || json.code == 300){
                        WriteBox.fire("add",json);
                    }else{
                        WriteBox.fire("err");
                    }
                    WriteBox.fire("done");
                });
            }
        });

        textarea.on("keyup",function(){
            if($(this).val().length == LIMIT){
                hint.show();
            }else{
                hint.hide();
            }
        });

        textarea.get(0).focus()
    }

    WriteBox.LIMIT = LIMIT;
    WriteBox.init = init;


    var body = $("body");
    var $win = $(window);

    var wrap_html = '<div class="huixiang-mbox-win"><div class="close">x</div><div class="mbox-content"></div></div>';
    var instance = null;

    function Mbox(opt){
        if(instance){
            return instance;
        }

        var content = $(opt.content);
        var wrap = $(wrap_html);
        wrap.find(".mbox-content").append(content);
        wrap.find(".close").on("click",function(){
            instance.close();
        });
        this._elem = wrap;
        this._offset = opt._offset || {top:0,left:0};
        this._opened = false;
        instance = this;
        return this;
    }

    Mbox.success = function(text){
        if(!instance){return}
        instance._elem.find(".mbox-content").html('<div class="msg-box"><i class="succ"></i>'+text+'</div>');
        instance.position();
    }

    Mbox.error = function(text){
        if(!instance){return}
        instance._elem.find(".mbox-content").html('<div class="msg-box"><i class="err"></i>'+text+'</div>');
        instance.position();
    }

    Mbox.close = function(){
        instance && instance.close();
    }

    Mbox.prototype = {
        opened:function(){
            return this._opened;
        },
        _create_overlay:function(){
            var self = this;
            this._overlay = $('<div class="huixiang-mbox-overlay"></div>').appendTo(body);
            this._overlay.css({
                opacity:0
            }).animate({
                opacity:.2
            }).on("click",function(){
                self.close();
            });
        },
        position:function(){
            var elem = this._elem;
            this._elem.css({
                top:($win.height() - elem.height()) / 2 + this._offset.top,
                left:($win.width() - elem.width()) / 2 + this._offset.left
            });
        },
        find:function(selector){
            return this._elem.find(selector)
        },
        open:function(){
            var self = this;
            if(!this._opened){
                this._opened = true;
                this._create_overlay();
                this._elem.css({
                    zIndex:51
                }).appendTo(body);
                this.position();
                $win.on("resize",function(){
                    self.position();
                });
            }
            return this;
        },
        close:function(){
            var self = this;
            var overlay = this._overlay;
            instance = null;
            if(this._opened){
                this._opened = false;
                overlay.animate({
                    opacity:0
                },{
                    complete:function(){
                        overlay.remove()
                    }
                });
                this._elem.animate({
                    opacity:0
                },{
                    complete:function(){
                        self._elem.remove()
                    }
                });
            }
        }
    }


    win.popBox = {
        pop:function(text,link){
            var html = '<div class="box-text">'
                +'<textarea class="textarea" value="' + text + '" placeholder="记一句..." maxlength="' + WriteBox.LIMIT + '">' + text + '</textarea>'
                +'</div>'
                +'<div class="box-bottom">'
                +'<div class="hint" style="display:none;">最多只能输入'+WriteBox.LIMIT+'个字</div><a class="btn" href="#">好了</a>'
                // +'<div class="share">'
                //   +'<span class="lbl">分享：</span>'
                //     +'<a href="#toweibo" id="toweibo" data-type="weibo" class="sharebtn"></a>'
                //     +'<a href="#todouban" id="todouban" data-type="douban" class="sharebtn"></a>'
                // +'</div>'
                +'</div>';
            var content = $(html);
            var write_box = new Mbox({
                content:content
            }).open();
            WriteBox.init(content);
            WriteBox.on("add",function(json){
                Mbox.success("添加成功");
                setTimeout(function(){
                    location.href="/piece/"+json.msg.id
                },250);
            });
            WriteBox.on("err",function(){
                Mbox.fail("发送错误");
            });
            WriteBox.on("done",function(id){
                setTimeout(function(){
                    Mbox.close();
                },1000);
            });
        }
    }



})(window);