document.addEventListener('DOMContentLoaded', async () => {
    let db;

    // Inicializar o banco de dados SQLite no navegador
    const SQL = await initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}` });
    db = new SQL.Database();

    // Criar tabela de produtos
    db.run(`CREATE TABLE products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL, quantity INTEGER)`);

    const form = document.getElementById('crud-form');
    const tableBody = document.querySelector('#data-table tbody');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const price = parseFloat(document.getElementById('price').value);
        const quantity = parseInt(document.getElementById('quantity').value);

        // Inserir produto no banco de dados
        db.run(`INSERT INTO products (name, price, quantity) VALUES (?, ?, ?)`, [name, price, quantity]);

        loadTableData();
        form.reset();
    });

    function loadTableData() {
        const result = db.exec(`SELECT * FROM products`);
        tableBody.innerHTML = '';

        if (result.length > 0) {
            const rows = result[0].values;
            rows.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row[0]}</td>
                    <td>${row[1]}</td>
                    <td>${row[2]}</td>
                    <td>${row[3]}</td>
                    <td>
                        <button onclick="deleteRow(${row[0]})">Excluir</button>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        }
    }

    window.deleteRow = (id) => {
        // Deletar produto do banco de dados
        db.run(`DELETE FROM products WHERE id = ?`, [id]);
        loadTableData();
    };

    loadTableData();
});