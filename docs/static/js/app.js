function init(){
    d3.json('samples.json').then(function(data){
        //Extract Data from JSON
        names = data.names;
        metadata = {};
        data.metadata.forEach(entry => metadata[entry.id]=entry);
        samples = {};
        data.samples.forEach(entry => samples[entry.id]=entry);


        //Adds Sample IDs to Selector
        names.forEach(name => d3.select('#selDataset')
                                .append('option')
                                .attr('value',name)
                                .text(name));
        
        
        //Gets Data for Default ID
        current_id = names[0];
        current_metadata = metadata[current_id];
        current_sample = samples[current_id];
        partial_IDs = current_sample.otu_ids.map(x=>parseInt(x));
        full_IDs = current_sample.otu_ids.map(x=>"OTU "+x);
        values = current_sample.sample_values;
        labels = current_sample.otu_labels;


        //Gets Demographic Data
        entries = Object.entries(current_metadata)

        //Assembles Trace and Layout for Horizontal Bar
        barTraces = [{
            type: 'bar' ,
            x: values.slice(0,10).reverse(),
            y: full_IDs.slice(0,10).reverse(),
            orientation: 'h',
            text: labels.slice(0,10).reverse()
        }]

        barLayout = {
            title: `Most Common Species in Subject ${current_id}`
        }

        //Assembles Trace and Layout for Bubble Plot
        bubbleTraces = [{
            type: 'scatter' ,
            mode: 'markers',
            x: partial_IDs,
            y: values,
            marker: {
                size : values,
                color : partial_IDs,
                colorscale : 'Earth'
            },
            text: labels
        }]

        bubbleLayout = {
            title: `Distribution of Species in Sample ${current_id}`
        }

        //Makes Plot
        Plotly.newPlot("bar",barTraces,barLayout);
        Plotly.newPlot("bubble",bubbleTraces,bubbleLayout);
        demoDiv = d3.select("#sample-metadata")
        demoDiv.selectAll('p')
               .data(entries)
               .enter()
               .append('p')
               .text(function(data,idx){return `${data[0]}: ${data[1]}`})

    })
}

function optionChanged(subject){
    //Gets Data for New ID
    current_id = subject;
    current_metadata = metadata[current_id];
    current_sample = samples[current_id];
    partial_IDs = current_sample.otu_ids.map(x=>parseInt(x));
    full_IDs = current_sample.otu_ids.map(x=>"OTU "+x);
    values = current_sample.sample_values;
    labels = current_sample.otu_labels;

    //Updates Bar Plot
    Plotly.update('bar',
        {
            x: [values.slice(0,10).reverse()],
            y: [full_IDs.slice(0,10).reverse()],
            text: [labels.slice(0,10).reverse()]
        },
        {
            title:`Most Common Species in Subject ${current_id}`
        }
    
    )

    //Updates Bubble Plot
    Plotly.update('bubble',
        {
            x: [partial_IDs],
            y: [values],
            marker: [{
                size : values,
                color : partial_IDs,
                colorscale : 'Earth'
            }],
            text: [labels]
        },
        {
            title:`Distribution of Species in Sample ${current_id}`
        }
    )
}

init();