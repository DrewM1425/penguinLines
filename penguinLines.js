
var createLabels = function(screen, margins, graph)
{
    var labels = d3.select("svg")
        .append("g")
        .classed("labels",true);
        
    labels.append("text")
        .text("Quiz Grades Over Time")
        .classed("title",true)
        .attr("text-anchor","middle")
        .attr("x",margins.left+(graph.width/2))
        .attr("y",margins.top);
    
    labels.append("text")
        .text("Quiz")
        .classed("label",true)
        .attr("text-anchor","middle")
        .attr("x",margins.left+(graph.width/2))
        .attr("y",screen.height);
    
    labels.append("g")
        .attr("transform","translate(20,"+ 
              (margins.top+(graph.height/2))+")")
        .append("text")
        .text("Grades")
        .classed("label",true)
        .attr("text-anchor","middle")
        .attr("transform","rotate(90)");
    
}


var createAxes = function(screen, margins, graph, xScale, yScale)
{
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    
    var axes = d3.select("svg")
        .append("g")
    axes.append("g")
        .attr("transform","translate("+margins.left+","
             +(margins.top+graph.height)+")")
        .call(xAxis)
    axes.append("g")
        .attr("transform","translate("+margins.left+","
             +(margins.top)+")")
        .call(yAxis)
    
}


var drawLines = function(penguins, graph, xScale, yScale)
{
    var lineGenerator = d3.line()
                            .x(function (quiz,i)
                              {return xScale(i);})
                            .y(function (quiz)
                              {return yScale(quiz);})
                            .curve(d3.curveCardinal);
    
    var lines = d3.select("svg")
        .select(".graph")
        .selectAll("g")
        .data(penguins)
        .enter()
        .append("g")
        .classed("line",true)
        .attr("fill","none")
        .attr("stroke","blue")
        .attr("stroke-width", 3)
        .on("mouseover",function(penguin)
        {   
            if(! d3.select(this).classed("off"))
            {
                //line fade
                d3.selectAll(".line")
                .classed("fade",true);
                
                d3.select(this)
                    .classed("fade",false)
                    .raise(); //move to top
                
                d3.select(this)
                    .selectAll("circle")
                    .classed("hide", false);
                
                
                //create tooltips for the penguin pics
                var xPosition = d3.event.pageX + 20;
                var yPosition = d3.event.pageY - 160;


                d3.select("#tooltip")
                    .style("left", xPosition + "px")
                    .style("top", yPosition + "px");


                d3.select("#tooltip #peng")
                    .attr("src", "imgs/" + penguin.picture);

                d3.select("#tooltip").classed("hidden", false);
            }
            
        })
        .on("mouseout",function(penguin)
           {
            if(! d3.select(this).classed("off"))
            {
                d3.selectAll(".line")
                    .classed("fade",false);
                
                d3.select(this)
                    .selectAll("circle")
                    .classed("hide", true);
                
            }
            
            d3.select("#tooltip").classed("hidden", true);
            
        });
        
    
    
    lines.append("path")
        .datum(function(penguin) 
            { return penguin.quizes.map(getQuizzes);})
        .attr("d",lineGenerator);
    
    lines.selectAll("circle")
    		.data(function(penguin) 
            { return penguin.quizes.map(getQuizzes);})
    	.enter()
        .append("circle")
        .attr("class", "hide")
        .attr("fill", "blue")
        .attr("r", 3)
        .attr("cx", function(quiz, i) { return xScale(i); })
        .attr("cy", function(quiz) { return yScale(quiz); });
    
}

var getQuizzes = function(quiz)
{
    return quiz.grade;
}

var getQuizDay = function(quiz)
{
    return quiz.day;
}



var initGraph = function(penguins)
{
    //the size of the screen
    var screen = {width:800, height:550};
    
    //how much space will be on each side of the graph
    var margins = {top:15,bottom:40,left:70,right:40};
    
    //generated how much space the graph will take up
    var graph = 
    {
        width:screen.width-margins.left-margins.right,
        height:screen.height-margins.top-margins.bottom,
    }
    
    //set the screen size
    d3.select("svg")
        .attr("width",screen.width)
        .attr("height",screen.height)
    
    //create a group for the graph
    var g = d3.select("svg")
        .append("g")
        .classed("graph",true)
        .attr("transform","translate("+margins.left+","+
             margins.top+")");
        
    //create scales for all of the dimensions
    var xScale = d3.scaleLinear()
        .domain([0, penguins[0].quizes.length-1])
        .range([0,graph.width])
    
    
    var lowGrade = d3.min(penguins,function(penguin)
    {
        return d3.min(penguin.quizes, getQuizzes);

    });
    
    var highGrade = d3.max(penguins,function(penguin)
    {  
        return d3.max(penguin.quizes,getQuizzes);
    })
    
    var yScale = d3.scaleLinear()
        .domain([lowGrade,highGrade])
        .range([graph.height,margins.top])
    
    createLabels(screen, margins, graph);
    createAxes(screen, margins, graph, xScale, yScale);
    drawLines(penguins,graph,xScale, yScale);
    
}







var penguinPromise = d3.json("classData.json"); //Promise to get the data

var successFcn = function(penguins) //If the data is successfully collected
{
    console.log("Data Collected:",penguins);
    initGraph(penguins);
}

var failureFcn = function(errorMsg) //If there was an error
{
    console.log("Something went wrong",errorMsg);
}

penguinPromise.then(successFcn,failureFcn);