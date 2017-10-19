/**
 * Created by Mark on 17/3/23.
 */
$(function() {
    var authorID = 1;
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
            dataType: "json",
            data: data,
            success: function(data){
                callback(data);
            }
        });
    }
    function update_message_list(msg) {
        $("#message_list").html("");
        $.each(msg, function(index, msg) {
            var author = msg.authorID == 1 ? "Sybil" : "Mark";
            $("#message_list").append("<li class='" + author + "'>" + msg.date + "<br><br>" +
                msg.title + "<br>" + msg.body + "</li>");
        });
    }
    ajax_get("/messages",update_message_list);
    $("#submit").click(function(){
        var title = $("#message_title").val();
        var body = $("#message_input").val();
        body = body.replace(/\n\r?/g, '<br/>');
        body = body.replace(/\t/g,'&nbsp');
        ajax_post("/messages",{title:title,body:body,authorID:authorID},function(data) {
            if(data.error){
                console.log(data.error);
                return;
            }
            ajax_get("/messages",update_message_list);
        });
        $("#message_title").val('');
        $("#message_input").val('');
    });
    window.r = function(id){
        authorID = id || 0;
        if(authorID == 0) {
            $(".form").removeClass("Sybil");
            $(".form").addClass("Mark");
        }
        else if(authorID == 1){
            $(".form").removeClass("Mark");
            $(".form").addClass("Sybil");
        }else{
            $(".form").removeClass("Mark");
            $(".form").removeClass("Sybil");
        }
        console.log("change authorID to " + authorID);
        return "Success : " + authorID;
    }
    r(1);
});