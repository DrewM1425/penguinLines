
var createLabels = function()
{
    
    
}


var createAxes = function()
{
    
    
}


var drawLines = function()
{
    
    
}





var initGraph(penguins)
{
    
    
    
    
    
    
}







var penguinPromise = d3.json("classData.json"); //Promise to get the data

var successFcn = function(penguins) //If the data is successfully collected
{
    console.log("Data Collected:",penguins);
}

var failureFcn = function(errorMsg) //If there was an error
{
    console.log("Something went wrong",errorMsg);
}

penguinPromise.then(successFcn,failureFcn);