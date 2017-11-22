$("#fa-refresh").click(function(){
    alert('bunyi');
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: success,
        dataType: "json"
      });
      
});