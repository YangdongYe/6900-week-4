var w = d3.select('.plot').node().clientWidth,
    h = d3.select('.plot').node().clientHeight;

d3.csv('../data/hubway_trips_reduced.csv',parse,dataLoaded);

function dataLoaded(err,rows){

    var timeSeries = d3.timeSeries()
        .width(w)
        .height(h)
        .timeRange([new Date(2011,6,16),new Date(2013,11,15)])
        .value(function(d){ return d.startTime; })
        .maxValue(60)
        .binSize(d3.time.week);

    var tripsByStation = d3.nest()
        .key(function(d){return d.startStation})
        .entries(rows);

    var plots = d3.select('.container').selectAll('.plot')
        .data(tripsByStation);

//	console.log(plots);

    plots
        .enter()
        .append('div').attr('class','plot');

    plots
        .each(function(d){
            d3.select(this).datum(d.values)
                .call(timeSeries)
                .append('p')
                .text(d.key);

        })

}

function parse(d){
    if(+d.duration<0) return;

    return {
        duration: +d.duration,
        startTime: parseDate(d.start_date),
        endTime: parseDate(d.end_date),
        startStation: d.strt_statn,
        endStation: d.end_statn
    }
}

function parseDate(date){
    var day = date.split(' ')[0].split('/'),
        time = date.split(' ')[1].split(':');

    return new Date(+day[2],+day[0]-1, +day[1], +time[0], +time[1]);
}

