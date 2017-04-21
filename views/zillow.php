<html>
    <head>
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
        <script>
            $(document).ready(function(){
                $('#btn').click(function(){
                    $.post("zillowAjax.php", $("#testform").serialize(),function(response){
                        $('#answer').html(response);
                    });
                });
            });    
        
        </script>
        
    </head>
    <body>
       <form id='testform'>
<!--
           <label for="street">Street:</label><input type="text" name="street">
           <label for="city">City:</label><input type="text" name="city">
           <label for="state">State:</label><input type="text" name="state">
-->
           <label for="zip">Zip:</label><input type="text" name="zip">
           <input type="button" id="btn" value="Search">        
       </form>
       <div id='answer'></div>
        
    </body>
</html>