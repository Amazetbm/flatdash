(function($)
{
    $.fn.hasClassRegEx = function(regex)
    {
        var classes = $(this).attr('class');
         
        if(!classes || !regex) return false;
         
        classes = classes.split(' ');
         
        for(var i=0, len=classes.length; i&lt;len, i++)
            if(classes[i].match(regex)) return true;
        
        return false;
    }; 
})(jQuery);