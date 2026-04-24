// importar.js
const XLSX = require('xlsx');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db');

const workbook = XLSX.readFile('Base.xlsx');
const hoja = workbook.Sheets[workbook.SheetNames[0]];
const datos = XLSX.utils.sheet_to_json(hoja, { defval: "" });

datos.forEach(row => {
    const values = Object.values(row);

    db.run(`
    INSERT INTO datos VALUES (NULL,?,?,?,?,?,?,?,?,?,?,?)
  `, values);
});

console.log("Datos importados");