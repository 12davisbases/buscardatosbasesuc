const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('./database.db');

// Crear tabla
db.run(`
CREATE TABLE IF NOT EXISTS datos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  col0 TEXT,
  col1 TEXT,
  col2 TEXT,
  col3 TEXT,
  col4 REAL,
  col5 TEXT,
  col6 REAL,
  col7 TEXT,
  col8 TEXT,
  col9 TEXT,
  col10 TEXT
)
`);

// 🔍 Obtener todos
app.get('/datos', (req, res) => {
    db.all("SELECT * FROM datos", [], (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

// 🔍 Buscar (tipo tu buscador)
app.get('/buscar', (req, res) => {
    const q = req.query.q;

    db.all(`
    SELECT * FROM datos WHERE
    col0 LIKE ? OR col1 LIKE ? OR col2 LIKE ? OR col3 LIKE ?
  `, [`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`], (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

// ➕ Agregar
app.post('/datos', (req, res) => {
    const values = Object.values(req.body);

    db.run(`
    INSERT INTO datos (
      col0,col1,col2,col3,col4,col5,col6,col7,col8,col9,col10
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?)
  `, values, function (err) {
        if (err) return res.status(500).json(err);
        res.json({ id: this.lastID });
    });
});

// ✏️ Editar
app.put('/datos/:id', (req, res) => {
    const values = [...Object.values(req.body), req.params.id];

    db.run(`
    UPDATE datos SET
    col0=?,col1=?,col2=?,col3=?,col4=?,col5=?,col6=?,col7=?,col8=?,col9=?,col10=?
    WHERE id=?
  `, values, function (err) {
        if (err) return res.status(500).json(err);
        res.json({ updated: this.changes });
    });
});

// ❌ Eliminar
app.delete('/datos/:id', (req, res) => {
    db.run(`DELETE FROM datos WHERE id=?`, req.params.id, function (err) {
        if (err) return res.status(500).json(err);
        res.json({ deleted: this.changes });
    });
});

app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));

app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente 🚀');
});
