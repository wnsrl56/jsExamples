/**
 * Date : 2017-05-31
 * Time : 오전 9:09
 *
 *  @fileOverview
 *  @author     jun
 *  @requires D3.core(until version d3.v4.js)
 */

Ext.define('Exem.chart.D3BubbleChart', {
    extend: 'Ext.Component',
    layout: 'fit',
    height: '100%',
    width: '100%',
    flex: 1,
    constructor: function () {
        Object.assign(this, arguments[0]);
        this._initProperty();
        this._initLayout();
    },

    _initProperty: function () {
        this.targetSVG = null;
        this.width = null;
        this.height = null;
        this.initFlag = false;
        this.scaledDataList = null;
        this.lineDomain = null;
        this.maxElapsedTime = null;
        this.hideSvg = false;

        this.chartStack = {};
        this.targetDivId = this.baseForm.id;

        this.margin = {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
        };

        this.defaultChartSet = {
            radius: {
                small: 2,
                middle: 4,
                large: 5
            },

            color: {
                small: '#30A9DE',
                middle: '#F0D43A',
                large: '#F23557'
            },

            opacity: {
                small: '0.4',
                middle: '0.3',
                large: '0.2'
            },

            quantile: [
                'small', 'middle', 'large'
            ],

            threshold: [10, 50]
        };

    },

    _initLayout: function () {
        if (!this.baseForm) {
            return;
        }

        this.baseForm.addListener('afterlayout', this.initChart.bind(this));
    },

    setProperty: function () {
        this.margin.top = this.baseForm.getHeight() / 100 * 3;
        this.margin.bottom = this.baseForm.getHeight() / 100 * 4;
        this.margin.left = this.baseForm.getWidth() / 100 * 2;
        this.margin.right = this.baseForm.getWidth() / 100 * 2;

        this.width = this.baseForm.getWidth() - this.margin.left - this.margin.right;
        this.height = this.baseForm.getHeight() - this.margin.top - this.margin.bottom;

        this.xScale = this.setXscale(this.lineDomain);
        this.yScale = this.setYscale(this.lineDomain);
    },

    setExecInfo: function (execInfo) {
        this.execInfo = execInfo;

        this.defaultChartSet.threshold = [this.execInfo.mediumMin, this.execInfo.mediumMax];

        this.maxElapsedTime = this.execInfo.maxElapsedTime;
    },

    initChart: function () {
        if (d3.select('#svg_' + this.targetDivId).empty() === false) {
            return;
        }

        //init base properties
        this.setProperty();

        //set svgId
        this.targetSVG = '#svg_' + this.targetDivId;

        //SET backSvg Id
        this.backSVGid = '#back_' + this.targetDivId;

        this.toolTipDiv = d3.select('#' + this.targetDivId).append("div")
            .attr("class", "d3BubbleChart_tooltip")
            .style("opacity", 0);

        // create svg tag 차트의 직접 데이터 그리는 용도
        this.svgChart = d3
            .select('#' + this.targetDivId)
            .attr('display', 'block')
            .attr('align', 'right')
            .append('svg')
            .attr('width', this.baseForm.getWidth() + this.margin.left + this.margin.right)
            .attr('height', this.baseForm.getHeight() + this.margin.top + this.margin.bottom)
            .attr('id', 'svg_' + this.targetDivId);

        this.backSVG = this.svgChart
            .append('g')
            .attr('id', 'back_' + this.targetDivId)
            .attr('transform', 'translate('+(this.margin.top)+','+(this.margin.left)+')');

        this.yLabel = this.backSVG
            .append("text")
            .text('Wait Time(s)');

        this.xLabel = this.backSVG
            .append("text")
            .text('Cpu Time(s)');

        // svg 위에
        this.initDrawAxis({
            width: this.width,
            height: this.height,
            useTick: false,
            id: this.targetSVG
        });
    },

    initDrawAxis: function (params) {
        if (d3.select(params.id).empty() === true) {
            return;
        }

        this.drawAxisXLine(params.width, params.height);
        this.drawAxisYLine(params.height);
    },

    drawAxisXLine: function () {
        var xScale = this.xScale;
        var axisX = this.setAxisX(xScale);

        this.axisX = d3
            .select(this.backSVGid)
            .append('g')
            .attr('id', 'g_axisX_' + this.targetDivId)
            .attr('class', 'd3BubbleX')
            .call(axisX);

            d3
            .selectAll('#g_axisX_' + this.targetDivId)
            .attr('transform', 'translate(' + (this.margin.left) + ',' + (+this.height - this.margin.bottom ) + ')');

    },

    drawAxisYLine: function () {
        var yScale = this.yScale;
        var axisY = this.setAxisY(yScale);

        this.axisY = d3
            .select(this.backSVGid)
            .append('g')
            .attr('id', 'g_axisY_' + this.targetDivId)
            .attr('class', 'd3BubbleY')
            .call(axisY);

            d3
            .selectAll('#g_axisY_' + this.targetDivId)
            .attr('transform', 'translate(' + (this.margin.left ) + ',' + this.margin.top + ')');

    },
    
    drawChart: function () {
        var x = null;
        var y = null;

        x = d3.scaleIdentity().domain(this.lineDomain).range([0, this.width - this.margin.right - this.margin.left]);
        y = d3.scaleIdentity().domain(this.lineDomain).range([this.height - this.margin.bottom - this.margin.top, 0]);
        
        if (this.scaledDataList){
            this.initSafeBrush(x, y);
            this.initCaptureBrush(x, y);
        }

        this.axisX.remove();
        this.axisY.remove();

        this.xScale = this.setXscale(this.lineDomain);
        this.yScale = this.setYscale(this.lineDomain);

        this.initDrawAxis({
            width: this.width,
            height: this.height,
            useTick: false,
            id: this.targetSVG
        });

        this.createBubble();
    },

    createBubble: function () {
        var targetSVG;
        targetSVG = d3.select(this.backSVGid);
        this.baseInitY = (this.yScale.range()[0] - this.yScale.range()[1]) / (this.yScale.domain()[1] - this.yScale.domain()[0]);

        targetSVG
            .append('g')
            .attr('id' , 'circleArea')
            .attr('transform', 'translate('+ this.margin.left +',' + this.margin.top+')')
            .selectAll('circle')
            .data(this.scaledDataList)
            .enter()
            .append('circle')
            .attr('r', function (d) {
                return (this.baseInitY * d.radius );
            }.bind(this))
            .attr('cx', function (d) {
                d.x = this.xScale(d.cpuTime);
                return this.xScale(d.cpuTime);
            }.bind(this))
            .attr('cy', function (d) {

                d.y = this.yScale(d.waitTime);
                return this.yScale(d.waitTime);
            }.bind(this))
            .style('fill', function (d) {
                return d.color;
            })
            .style('stroke', '1px')
            .style('stroke-opacity', 1)
            .style('opacity', function (d) {
                return d.opacity;
            });

        this.initEventLayer();
    },

    setData: function (data) {

        if (!data.hasOwnProperty(length)) {
            return;
        }

        this.scaledDataList = [];
        this.svgChart.selectAll('circle').remove();


        this.scaledDataList = this.createScaledData(data);

        this.lineDomain = this.setDomain(this.maxElapsedTime);

    },

    /**
     *
     * @param {Array} arrData 
     * @return {Object}
     */
    createScaledData: function (arrData) {
        var target;

        this.maxValue = 0;

        if (arrData.hasOwnProperty('length') === false) {
            return;
        }

        target = this.defaultChartSet;

        return arrData.map(function (d, index) {

            var roundScale = d3
                .scaleThreshold()
                .domain(target.threshold)
                .range(target.quantile);

            var scaledData = roundScale(d.execute);

            if(this.maxValue <= d.cpuTime || this.maxValue <= d.waitTime){
                d.cpuTime >= d.waitTime ? this.maxValue = d.cpuTime : this.maxValue = d.waitTime ;
            }

            return {
                scaled: scaledData,
                execute: d.execute,
                radius: target.radius[scaledData],
                color: target.color[scaledData],
                cpuTime: d.cpuTime,   // use x plot point
                waitTime: d.waitTime, // use y plot point
                elapsedTime: d.elapsedTime, //elapsedTime data
                sqlId: d.sqlId,        // identifier 1
                name : d.name,         // identifier 2
                program : d.program,   // identifier 3
                module : d.module,     // identifier 4
                flag : d.originFlag,
                opacity: target.opacity[scaledData],
                index: index
            };
        }.bind(this) );
    },

    setXscale: function (domain) {
        if (!domain) {
            domain = [-1, 1];
        }

        return d3.scaleLinear().domain(domain).range([0, this.width - this.margin.right - this.margin.left]);
    },

    setYscale: function (domain) {
        if (!domain) {
            domain = [-1, 1];
        }

        return d3.scaleLinear().domain(domain).range([this.height - this.margin.bottom - this.margin.top, 0]);
    },

    setAxisX: function (xScale) {
        return d3.axisBottom(xScale)
            .tickSize(-this.height + this.margin.bottom + this.margin.top)
            .ticks(5);
    },

    setAxisY: function (yScale) {

        return d3.axisLeft(yScale)
            .tickSize(-this.width + this.margin.right + this.margin.left)
            .ticks(5);
    },

    initEventLayer: function () {
        var posX = [], posY = [];

        d3.select(this.targetSVG)
            .selectAll('circle')
            .on('mouseover', this.hover.bind(this))
            .on('mouseout', this.mouseOut.bind(this))
            .on('mousedown', this.elementClickEvent.bind(this));

        if(!this.safeArea){
            posX[0] = this.lineDomain[0];
            posX[1] = this.execInfo.safeZone;
            posY[0] = this.lineDomain[0];
            posY[1] = this.execInfo.safeZone;
        }else{
            posX[0] = this.safeArea.posX[0];
            posX[1] = this.safeArea.posX[1];
            posY[0] = this.safeArea.posY[0];
            posY[1] = this.safeArea.posY[1];

            this.nonSafeEvent = true;
        }

        this.safeBrushNode.call(this.safeBrushSet.move,
            [
                [this.xScale(posX[0]), this.yScale(posY[1])],
                [this.xScale(posX[1]), this.yScale(posY[0])], [this.width, this.height]
            ]);


        if(this.captureArea && Object.keys(this.captureArea).length > 0){
            this.captureBrushNode.call(this.captureBrushSet.move,
                [
                    [this.xScale(this.captureArea.posX[0]), this.yScale(this.captureArea.posY[1])],
                    [this.xScale(this.captureArea.posX[1]), this.yScale(this.captureArea.posY[0])], [this.width, this.height]
                ]);

             this.nonCapturedEvent = true;
        }
    },

    initSafeBrush: function (x, y) {
        this.safeBrushSet = d3.brush()
            .extent([[x.range()[0], y.range()[1]], [x.range()[1], y.range()[0]], [this.width, this.height]])
            .on('brush', this.safeBrushEvent.bind(this))
            .on('end', this.safeBrushEnd.bind(this))
            .handleSize(25);

        this.safeBrushNode = d3.select(this.backSVGid)
            .append('g')
            .attr('class', 'safe_brush')
            .attr('transform', 'translate(' + (+this.margin.left ) + ',' + (+this.margin.top) + ')')
            .call(this.safeBrushSet);
    },

    initCaptureBrush: function (x, y) {
        this.captureBrushSet = d3.brush()
            .extent([[x.range()[0], y.range()[1]], [x.range()[1], y.range()[0]], [this.width, this.height]])
            .on('start', this.captureBrushStart.bind(this))
            .on('brush', this.captureBrushEvent.bind(this))
            .on('end', this.captureBrushEnd.bind(this));

        this.captureBrushNode = d3.select(this.backSVGid)
            .append('g')
            .attr('class', 'capture_brush')
            .attr('transform', 'translate(' + (+this.margin.left ) + ',' + (+this.margin.top) + ')')
            .call(this.captureBrushSet);
    },

    safeBrushEvent: function () {


    },
    
    safeBrushEnd: function () {
        if(this.hideSvg  == true){
            return;
        }

        this.safeChartStack = {};
        this.safeArea = {};
        this.safeSelectionArea = d3.brushSelection(this.safeBrushNode.node());
        this.safeArea.posX = [this.safeSelectionArea[0][0], this.safeSelectionArea[1][0]].map(this.xScale.invert);
        this.safeArea.posY = [this.safeSelectionArea[1][1], this.safeSelectionArea[0][1]].map(this.yScale.invert);

        if(this.nonSafeEvent == true){
            this.nonSafeEvent = false;
            return;
        }

        if (this.safeSelectionArea != null) {
            this.safeCircleList = d3.select(this.targetSVG)
                .selectAll('circle')
                .filter(function (d) {

                    if (
                        d.x >= this.safeSelectionArea[0][0] && d.x <= this.safeSelectionArea[1][0]
                        && d.y >= this.safeSelectionArea[0][1] && d.y <= this.safeSelectionArea[1][1] // square point xStart , xEnd , yStart, yEnd

                        && !this.safeChartStack[d.index]){
                        this.safeChartStack[d.index] = {};
                        Object.assign(this.safeChartStack[d.index], d);

                        return d;
                    }

                }.bind(this));
        }else{
            this.safeCircleList = {};
        }

        if (this.eventFn.safeZoneEvent) {
            this.eventFn.safeZoneEvent.target.call(null, null, {
                data: {
                    list : this.safeCircleList,
                    selectArea : this.safeSelectionArea
                },
                stack : this.safeChartStack,
                scale: {
                    posX: this.safeArea.posX,
                    posY: this.safeArea.posY
                },
                scope: this.eventFn.safeZoneEvent.scope
            });
        }
    },

    captureBrushStart: function () {
        if (this.eventFn.captureBrushStartEvent) {
            this.eventFn.captureBrushStartEvent.target.call(null, null, {
                scope: this.eventFn.captureBrushStartEvent.scope
            });
        }
    },
    
    captureBrushEvent: function () {
        if (this.eventFn.captureBrushBeingEvent) {
            this.eventFn.captureBrushBeingEvent.target.call(null, null, {
                scope: this.eventFn.captureBrushBeingEvent.scope
            });
        }
    },
    
    captureBrushEnd: function () {
        if(this.hideSvg  == true){
            return;
        }

        this.captureArea = {};
        this.chartStack = {};
        this.captureSelectionArea = d3.brushSelection(this.captureBrushNode.node());
        if(this.captureSelectionArea) {
            this.captureArea.posX = [this.captureSelectionArea[0][0], this.captureSelectionArea[1][0]].map(this.xScale.invert);
            this.captureArea.posY = [this.captureSelectionArea[1][1], this.captureSelectionArea[0][1]].map(this.yScale.invert);
        }

        if(this.nonCapturedEvent == true){
            this.nonCapturedEvent = false;
            return;
        }

        if (this.captureSelectionArea  != null) {
            this.circleList = d3.select(this.targetSVG)
                .selectAll('circle')
                .filter(function (d) {
                    if (d.x >= this.captureSelectionArea [0][0] && d.x <= this.captureSelectionArea [1][0]
                        && d.y >= this.captureSelectionArea [0][1] && d.y <= this.captureSelectionArea [1][1] // square point xStart , xEnd , yStart, yEnd
                        && !this.chartStack[d.index]){

                        this.chartStack[d.index] = {};
                        Object.assign(this.chartStack[d.index], d);

                        return d;
                    }
                }.bind(this));
        }else{
            this.circleList = {};
        }

        if (this.eventFn.captureBrushEndEvent) {
            this.eventFn.captureBrushEndEvent.target.call(null, null, {
                data: this.circleList,
                stack: this.chartStack,
                areaPos : this.captureSelectionArea ,
                scope: this.eventFn.captureBrushEndEvent.scope
            });
        }
    },

    elementClickEvent: function (clickData) {
        var data = [];

        d3.event.stopPropagation();
        d3.select(this.targetSVG)
            .selectAll('circle')
            .filter(function (d) {
                return d == clickData;
            }).each(function (d) {
            data.push(d);
        });

        if (this.eventFn.elementClickEvent) {
            this.eventFn.elementClickEvent.target.call(null, null, {
                data : data,
                scope: this.eventFn.elementClickEvent.scope
            });
        }
    },

    hover: function (hvData) {
        var setHtmlText =
            '<div class="bubble-chart-tooltip-row">'
            +   '<div class="bubble-chart-tooltip-label">Elapsed Time/exec</div>'
            +   '<div class="bubble-chart-tooltip-value"> : ' + hvData.elapsedTime + '</div>'
        +   '</div>'
        +   '<div class="bubble-chart-tooltip-row">'
            +   '<div class="bubble-chart-tooltip-label">Wait Time/exec</div>'
            +   '<div class="bubble-chart-tooltip-value"> : ' + hvData.waitTime + '</div>'
        +   '</div>'
        +   '<div class="bubble-chart-tooltip-row">'
            +   '<div class="bubble-chart-tooltip-label">Executions</div>'
            +   '<div class="bubble-chart-tooltip-value"> : ' + hvData.execute + '</div>'
        +   '</div>';

        this.toolTipDiv.transition()
            .duration(200)
            .style("opacity", .9);

        this.toolTipDiv
            .html(setHtmlText)
            .style("left", (d3.event.layerX + 25) + "px")
            .style("top", (d3.event.layerY - 30) + "px");
    },

    mouseOut: function () {
        this.toolTipDiv.transition()
            .duration(500)
            .style("opacity", 0);
    },

    redraw: function () {
        // get chart obj
        // set size
        // circle size compute
        if(this.hideSvg == true){
            return;
        }

        this.svgChart.remove();
        this.toolTipDiv.remove();
        this.axisX.remove();
        this.axisY.remove();
        this.yLabel.remove();
        this.xLabel.remove();
        this.backSVG.remove();

        //set svgId, tooltip Id
        this.targetSVG = '#svg_' + this.targetDivId;
        this.backSVGid = '#back_' + this.targetDivId;

        this.toolTipDiv = d3.select('#' + this.targetDivId).append("div")
            .attr("class", "d3BubbleChart_tooltip")
            .style("opacity", 0);

        // create svg tag 차트의 직접 데이터 그리는 용도
        this.svgChart = d3
            .select('#' + this.targetDivId)
            .attr('display', 'block')
            .attr('align', 'right')
            .attr('margin-top', 10)
            .append('svg')
            .attr('width', this.baseForm.getWidth() - this.margin.right)
            .attr('height', this.baseForm.getHeight() - this.margin.bottom)
            .attr('id', 'svg_' + this.targetDivId);

        this.backSVG = this.svgChart
            .append('g')
            .attr('id', 'back_' + this.targetDivId)
            .attr('transform', 'translate('+(this.margin.left + 5 )+',0)');

        this.setProperty();

        this.initDrawAxis({
            width: this.width,
            height: this.height,
            useTick: false,
            id: this.targetSVG
        });

        this.yLabel = this.svgChart
            .append("text")
            .text('Wait Time(Sec)')
            .attr('transform', 'rotate(-90) translate('+ (-(this.height - this.margin.top)/2 - 35) +','+(this.margin.left +this.margin.right - 16) +')');
        
        this.xLabel = this.svgChart
            .append("text")
            .text('CPU Time(Sec)')
            .attr('transform', 'translate('+((this.width - this.margin.right)/2)+','+(  this.height + 2)+')');

        if (this.scaledDataList){
            this.drawChart();
            this.initEventLayer();
        }
    },

    /**
     *
     * @param {Number} maxValue
     * @returns {Array}
     *
     * @note set domain은 axis의 0 은 -value 로 maxValue 의 5%,
     *       axis의 중간치는 0 ~ maxValue 를 80% 로,
     *       maxValue 에서 ~ axis 끝까지는 maxValue의 15%로 계산
     */
    setDomain : function(maxValue){
        var domain = [];

        if(maxValue == 0){
            return domain = null;
        }

        domain[0] = -(maxValue / 100 * 15);
        domain[1] = maxValue + (maxValue / 100 * 15);

        return domain;
    },

    hide : function(){
        d3.selectAll(this.targetSVG).attr("visibility", "hidden");
        this.hideSvg = true;
    },

    show : function(){
        d3.selectAll(this.targetSVG).attr("visibility", "visible");
        this.hideSvg = false;
    }


});
