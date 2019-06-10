// Function based on: https://stackoverflow.com/a/32648488
var GET_GLOBALS = function ()
{
    var output = [ ];
    var keys=Object.keys( window );
    for (var i in keys)
    {
        if (typeof window[keys[i]] != 'function'){
            output.push({
                key: keys[i],
                value: window[keys[i]]
            });
        }
    }

    return output;
};