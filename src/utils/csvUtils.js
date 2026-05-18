import Papa from 'papaparse';
import { MONTHS } from './constants';

/**
 * Export the given patient array to a CSV file download.
 */
export function exportToCSV(patients, month, year) {
  const rows = patients.map((p, i) => ({
    '#': i + 1,
    'Patient Name': p.name || '',
    'Age': p.age || '',
    'Gender': p.gender || '',
    'Diagnosis Category': p.diagnosisCategory || '',
    'Diagnosis': p.diagnosis || '',
    'Payment Type': p.paymentType || '',
    'Referring Doctor': p.referringDoctor || '',
    'Contact': p.contact || '',
    'Visit Date': p.visitDate || '',
    'Flags': (p.flags || []).join('; '),
    'Notes': p.notes || '',
  }));

  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `HCG_RO_Patients_${MONTHS[month - 1]}_${year}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Parse a CSV file and return an array of patient-shaped objects.
 * Returns { data, errors }.
 */
export function parseCSV(file) {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data.map((row) => ({
          name: row['Patient Name'] || row['name'] || '',
          age: parseInt(row['Age'] || row['age']) || 0,
          gender: row['Gender'] || row['gender'] || '',
          diagnosisCategory: row['Diagnosis Category'] || row['diagnosisCategory'] || '',
          diagnosis: row['Diagnosis'] || row['diagnosis'] || '',
          paymentType: row['Payment Type'] || row['paymentType'] || 'Cash',
          referringDoctor: row['Referring Doctor'] || row['referringDoctor'] || '',
          contact: row['Contact'] || row['contact'] || '',
          visitDate: row['Visit Date'] || row['visitDate'] || '',
          flags: row['Flags'] ? row['Flags'].split(';').map(f => f.trim()).filter(Boolean) : [],
          notes: row['Notes'] || row['notes'] || '',
        }));
        resolve({ data, errors: results.errors });
      },
    });
  });
}
