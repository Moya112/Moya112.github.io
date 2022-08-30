// Function called from index.html  when we select a menu option NewSample its chosen option.
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

var wfreq;

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // wfreq for gauge chart
    wfreq = resultArray[0].wfreq; 

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    //Object.entries(result).forEach(([key, value]) => {
    //  PANEL.append("h6").text('${key.toUpperCase()}: ${value}');
    //});
    Object.entries(result).forEach(([key, value]) => {
       PANEL.append("h6").text(key.toUpperCase() + ': ' + value);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // 3. Create a variable that holds the samples array. 
    var bellySamples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleFiltered = bellySamples.filter(sampleObj => sampleObj.id == sample);

    // var sortedSample = sampleFiltered[0].otu_ids.sort((a,b) => a - b).reverse(); 

    //  5. Create a variable that holds the first sample in the array.
    var firstSample =  sampleFiltered[0];

    sampleFiltered[0].sample_values.sort ((a,b) => a  - b).reverse();
    console.log (sampleFiltered);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    
    var otuIds  = sampleFiltered[0].otu_ids.slice (0, 10);
    otuIds.reverse();

    var otuLabels = sampleFiltered[0].otu_labels.slice (0, 10);;
    otuLabels.reverse();

    var sampleValues = sampleFiltered[0].sample_values.slice (0, 10);
    sampleValues.reverse();
  
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks =  otuIds.map(ids => "OTU "+ids);

    // mobile responsive config for all the charts..
    var config = {responsive: true}
  
    // 8. Create the trace for the bar chart. 
    var trace = {
      x: sampleValues,
      y: yticks,
      type: "bar",
      orientation: "h",
      marker : {
         color : otuIds,
         colorscale : "Blues"
      }
    }; 

    var barData = [trace];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        yaxis: otuLabels

     };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar-plot", barData, barLayout, config);

    // Delivetable 2. BUBBLE CHART Create the trace for the bubble chart.
    // otu_ids as the x-axis values,  sample_values as the y-axis values, sample_values as the marker size,
    // otu_ids as the marker colors and otu_labels as the hover-text values.
    var bubbleTrace = {  
        x: firstSample.otu_ids,
        y: firstSample.sample_values,
        text : firstSample.otu_labels, 
        mode : "markers", 
        marker: { 
          color : firstSample.otu_ids,
          size : firstSample.sample_values, 
          colorscale : "Blues",  
        }   
     };
     
    var bubbleData = [bubbleTrace];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {  
        title: "Bacteria  Cultures per Sample",
        hovermode : "closest",
        xaxis: {
          title: {
            text: "OTU IDS" }}      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, config); 

    // Deliverable 3. GAUGE CHART 
    console.log (wfreq); // this variables was gotten in BuildMetadata

    // 4. Create the trace for the gauge chart.
    var gaugeData = [ {
        value : wfreq.toFixed(1),
        title: {
          text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week"
        },
        type : "indicator",
        mode : "gauge+number",
        gauge: {
          axis: { range: [0, 10]}, 
          bar : { color: "white"},
          steps: [
            { range: [0, 2], color: "teal" },
            { range: [2, 4], color: "lightblue" },
            { range: [4, 6], color: "blue" },
            { range: [6, 8], color: "cornflowerblue" },
            { range: [8, 10], color: "royalblue" }
          ],
        }
      }   
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 480, height: 380, margin: { t: 0, b: 0 }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout, config);
  });
}

// 
function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      
      buildMetadata(firstSample);
      buildCharts(firstSample);    
 })}
  
  // Initialize the dashboard
  init(); 