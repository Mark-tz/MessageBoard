/**
 * Created by Mark on 17/3/23.
 */
$(function() {
    var authorID = 1;
    var image_stage = document.getElementById("image_stage");
    var image_stage_caption = document.getElementById("image_stage_caption");
    var image_stage_content = document.getElementById("image_stage_content");
    var image_stage_close = document.getElementById("image_stage_close");
    image_stage_close.onclick = function() { 
        image_stage.style.display = "none";
    }
    $(document).keydown(function(key){
        if(key.keyCode == 27)
            image_stage.style.display = "none";
    });
    function ajax_get(url,callback) {
        $.ajax({
            url: url,
            dataType: "json",
            success: function(data){
                callback(data)
            }
        });
    }
    function ajax_post(url,data,callback) {
        $.ajax({
            url: url,
            type:"POST",
            processData: false,
            contentType: false,
            data: data,
            success: function(data){
                callback(data);
            },
            error: function (e) {
                console.log(e);
                alert(e.responseText);
            }
        });
    }
    function update_message_list(msg) {
        $("#message_list").html("");
        $.each(msg, function(index, msg) {
            var author = msg.authorID == 1 ? "Sybil" : "Mark";
            var msgBody = msg.date + "<br><br>" + msg.title + "<br>" + msg.body;
            //console.log(msg.img);
            var msgImage = "";
            if(msg.img.length > 0){
                msgImage = "<div>";//<div><img class='messages_image' alt='" + msg.img[0] + "'height='200' src='image/" + msg.img[0] + "'/></div>";
                for(var i=0;i<msg.img.length;i++){
                    msgImage += "<img class='messages_image' alt='" + msg.img[i] + "'height='100' src='./image/" + msg.img[i] + "'/>";
                }
                msgImage += "</div>";
            }
            var msgAudio = "";
            if(msg.music.length > 0){
                msgAudio = "<div>";//<div><img class='messages_image' alt='" + msg.img[0] + "'height='200' src='image/" + msg.img[0] + "'/></div>";
                for(var i=0;i<msg.music.length;i++){
                    msgAudio += "<audio class='messages_audio' src='./audio/" + msg.music[i] + "' controls='controls'></audio>";
                }
                msgAudio += "</div>";
            }
            $("#message_list").append("<li class='" + author + "'>" + msgBody + msgImage + msgAudio + "</li>");
        });
        $(".messages_image").click(function(){
            image_stage.style.display = "block";
            image_stage_content.src = this.src;
            image_stage_caption.innerHTML = this.alt;
        });
    }
    ajax_get("/messages",update_message_list);
    $("#new_message_form").submit(function(e){
        e.preventDefault();
        var form = this;
        var formData = new FormData(form);
        formData.append("authorID",authorID);
        ajax_post('/upload',formData,function(r){
            form.reset();
            ajax_get("/messages",update_message_list);
        })
    });
    window.r = function(id){
        authorID = id || 0;
        $("#message_audio").hide();
        $("#message_img").hide();
        if(authorID == 0) {
            $(".form").removeClass("Sybil");
            $(".form").addClass("Mark");
            $("#message_audio").show();
            $("#message_img").show();
            $("#new_message_form").show();
        }
        else if(authorID == 1){
            $(".form").removeClass("Mark");
            $(".form").addClass("Sybil");
            $("#new_message_form").show();
        }else{
            $(".form").removeClass("Mark");
            $(".form").removeClass("Sybil");
            $("#new_message_form").hide();
        }
        console.log("change authorID to " + authorID);
        return "Success : " + authorID;
    }
    r(1);
});