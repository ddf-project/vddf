/**
 * Export vDDF to csv format
 */
export default function exportCsv(vddf, options) {
  let csv = '';

  // header
  csv += vddf.schema.map(field => `\"${field.name}\"`).join(',') + '\n';

  // row
  vddf.fetch().forEach(row => {
    csv += row.map(field => `\"${field}\"`).join(',') + '\n';
  });

  return csv;
}
