const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Configurar o banco de dados SQLite para usar um arquivo local
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL, quantity INTEGER)");
});

// Routes
app.post('/api/create', (req, res) => {
    const { name, price, quantity } = req.body;
    db.run("INSERT INTO products (name, price, quantity) VALUES (?, ?, ?)", [name, price, quantity], function(err) {
        if (err) return res.status(500).send(err.message);
        res.status(201).send({ id: this.lastID });
    });
});

app.get('/api/read', (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.send(rows);
    });
});

app.delete('/api/delete/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM products WHERE id = ?", id, function(err) {
        if (err) return res.status(500).send(err.message);
        res.status(200).send({ deleted: this.changes });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});