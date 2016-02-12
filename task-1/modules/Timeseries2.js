d3.timeSeries = function(){

    var w = 800,
        h = 600,
        m = {t:50,r:25,b:50,l:25},
        layout = d3.layout.histogram(),
        chartW = w - m.l - m.r,
        chartH = h - m.t - m.b,
        timeRange = [new Date(), new Date()],
        binSize = d3.time.day,
        maxValue,
        scaleX = d3.time.scale().range([0,chartW]).domain(timeRange),
        scaleY = d3.scale.linear().range([chartH,0]).domain([0,maxValue]),
        valueAccessor = function(d){ return d;},
        dataArray;

    function exports(_selection){

        //recompute internal variables if updated
        var bins = binSize.range(timeRange[0],timeRange[1]);
        bins.unshift(timeRange[0]);
        bins.push(timeRange[1]);

        layout
            .range(timeRange)
            .bins(bins);

        chartW = w - m.l - m.r;
        chartH = h - m.t - m.b;

        scaleX.range([0,chartW]).domain(timeRange);

        _selection.each(draw);
    }

    function draw(d){

        var _d = layout(d);
        console.log(layout(d)[0]);

        //找出所有数据的最大值并作为maxValue,但在这里失败了
        var maxData = [_d];
        for (var i=0;i<maxData[0].length;i++) {
            dataArray[i] = maxData[0][i].y;
        }

        maxValue = d3.max(dataArray);
        scaleY.range([chartH,0]).domain([0,maxValue]);

        var line = d3.svg.line()
            .x(function(d){ return scaleX(d.x.getTime() + d.dx/2)})
            .y(function(d){ return scaleY(d.y)})
            .interpolate('basis');
        var area = d3.svg.area()
            .x(function(d){ return scaleX(d.x.getTime() + d.dx/2)})
            .y0(chartH)
            .y1(function(d){ return scaleY(d.y)})
            .interpolate('basis');
        var axisX = d3.svg.axis()
            .orient('bottom')
            .scale(scaleX)
            .ticks(d3.time.year);

        var svg = d3.select(this).selectAll('svg')
            .data([d]);

        var svgEnter = svg.enter().append('svg')
        svgEnter.append('g').attr('class','area').attr('transform','translate('+m.l+','+m.t+')').append('path');
        svgEnter.append('g').attr('class','line').attr('transform','translate('+m.l+','+m.t+')').append('path');
        svgEnter.append('g').attr('class','axis').attr('transform','translate('+m.l+','+(m.t+chartH)+')');

        svg.attr('width',w).attr('height',h);

        svg.select('.line')
            .select('path')
            .datum(_d)
            .attr('d',line);
        svg.select('.area')
            .select('path')
            .datum(_d)
            .attr('d',area);
        svg.select('.axis')
            .call(axisX);
    }

    exports.width = function(_v){
        if(!arguments.length) return w;
        w = _v;
        return this;
    }
    exports.height = function(_v){
        if(!arguments.length) return h;
        h = _v;
        return this;
    }
    exports.timeRange = function(_r){
        if(!arguments.length) return timeRange;
        timeRange = _r;
        return this;
    }
    exports.value = function(_v){
        if(!arguments.length) return layout.value();
        valueAccessor = _v;
        layout.value(_v);
        return this;
    }
    exports.maxValue = function(_y){
        if(!arguments.length) return maxValue;
        maxValue = _y;
        return this;
    }
    exports.binSize = function(_b){
        if(!arguments.length) return binSize;
        binSize = _b;
        return this;
    }

    return exports;
}
