const xlsx = require('xlsx');
const fs = require('fs');

try {
  let output = '';
  const workbook = xlsx.readFile('Custos 3D.xlsx');
  
  workbook.SheetNames.forEach(sheetName => {
    output += `\n=== Sheet: ${sheetName} ===\n\n`;
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
    data.forEach(row => {
      if (row.length > 0) {
        output += row.join(' | ') + '\n';
      }
    });
  });
  
  fs.writeFileSync('excel_utf8.txt', output, 'utf8');
} catch (error) {
  console.error("Error reading excel file:", error);
}
