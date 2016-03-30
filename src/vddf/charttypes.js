import { Types } from './schemadetector';

/**
 * Specify the required dimensions for each chart type
 */
export const ChartTypes = {
  bar: {
    Number: 1,
    Category: 1
  },
  'bar.grouped': {
    Number: 1,
    Category: 2
  },
  'bar.stacked': {
    Number: 1,
    Category: 2
  },
  line: {
    Number: 1,
    Category: 1
  },
  pie: {
    Number: 1,
    Category: 1
  },
  donut: {
    Number: 1,
    Category: 1
  },
  scatterplot: {
    Number: 2
  },
  heatmap: {
    Number: 1,
    Category: 2
  },
  treemap: {
    Number: 1,
    Category: 1
  },
  datatable: {
    // nothing
  }
};

// TODO: area and line charts

export default function suggest(schema) {
  let summary = {
    Number: 0,
    Category: 0
  };

  let result = [];

  // Create a summary of available dimensions in the schema
  schema.forEach(c => {
    if (!summary[c.type]) summary[c.type] = 0;

    summary[c.type]++;

    if (Types.isNumber(c.type)) summary.Number++;
    if (c.type === Types.String || c.type === Types.Integer) summary.Category++;
  });

  // Loop through all chart types and check for required dimensions
  // if all pass then we add to suggest list
  for (let type in ChartTypes) {
    const constraint = ChartTypes[type];
    let satisfied = true;

    for (let typeCheck in constraint) {
      satisfied = satisfied && summary[typeCheck] >= constraint[typeCheck];
    }

    if (satisfied) {
      result.push(type);
    }
  }

  return result;
}
