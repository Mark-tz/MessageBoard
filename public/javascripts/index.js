/**
 * Created by Mark on 17/3/23.
 */
$(function() {
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
        console.log(msg);
        //$("#message_list").append("<li>" + msg.title + " " + msg.date + "<br><br>" + msg.body + "</li>");
        $.each(msg, function(index, msg) {
            $("#message_list").append("<li>" + msg.title + " " + msg.date + "<br><br>" + msg.body + "</li>");
        });
    }
    ajax_get("/messages",update_message_list);
    $("#submit").click(function(){
        var title = $("#message_title").val();
        var body = $("#message_input").val();
        ajax_post("/messages",{title:title,body:body},function(data) {
            if(data.error){
                console.log(data.error);
                return;
            }
            update_message_list(data);
        });
    });
});