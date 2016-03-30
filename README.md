## Visual DDF ##

When talking about Data Visualizations, most people think of charts, graphs and perhaps some interactivity. 
Visual DDF (vDDF) is a framework that considers visualizations as first-class objects that also act as data sources and sinks.
This enables powerful collaboration where thousands of users can build on the work of one another through the sharing of visualization objects.

This repository includes the vDDF core and vDDF react. **We are publishing data extractor extension and server soon**. Feel free to report issues or send pull request!

### How to build vDDF ###

	* Use `npm install` to install all the dependencies.
	* Run `npm run build` to build `vddf.js`.

After that open `examples/index.html` to interact with your first vDDF

### How to use vDDF ###

To create a vDDF you can load it from the manager using the `load` function. This function can accept a object or an URL to create a vDDF from
a CSV file.

```
vDDF.manager.load({
	data: [
    {year: 2011, revenue: 100},
    {year: 2012, revenue: 125},
    {year: 2013, revenue: 175}
	]
}).then(function(vddf) {
  // now you can interact with vddf
});
```

You can then interact with the vddf object with its API

```
// render vDDF to an element
vddf.render(document.getElementById('target_element'));

// read vDDF data
var data = vddf.fetch();

// read vDDF schema
var schema = vddf.schema;

// update vDDF data
vddf.updateData(data);

// get current chart type
var chartType = vddf.chartType;
vddf.chartType = 'bar'; // change to a bar chart
```
