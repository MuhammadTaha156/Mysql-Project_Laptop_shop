// server.js
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1515',
    database: 'LaptopShop',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('MySQL Connected to pool...');
    connection.release();
});

app.get('/api/products', (req, res) => {
    const categoryName = req.query.category;
    const supplierName = req.query.supplier;

    let query = `
        SELECT
            P.ProductID AS id,
            P.ProductName AS name,
            P.Description AS description,
            P.Price AS price,
            S.SupplierName AS supplier,
            GROUP_CONCAT(DISTINCT C.CategoryName ORDER BY C.CategoryName SEPARATOR ', ') AS categories
        FROM Products P
        JOIN Suppliers S ON P.SupplierID = S.SupplierID
        LEFT JOIN ProductCategories PC ON P.ProductID = PC.ProductID
        LEFT JOIN Categories C ON PC.CategoryID = C.CategoryID
    `;
    let params = [];
    let conditions = [];

    if (categoryName) {
        conditions.push(`C.CategoryName = ?`);
        params.push(categoryName);
    }
    if (supplierName) {
        conditions.push(`S.SupplierName = ?`);
        params.push(supplierName);
    }

    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
    }

    query += ` GROUP BY P.ProductID`;

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ error: 'Products fetch karne mein masla hua.' });
        }
        res.json(results);
    });
});

app.get('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id, 10);

    if (isNaN(productId)) {
        return res.status(400).json({ error: 'Invalid product ID diya gaya hai.' });
    }

    const query = `
        SELECT
            P.ProductID AS id,
            P.ProductName AS name,
            P.Description AS description,
            P.Price AS price,
            S.SupplierName AS supplier,
            GROUP_CONCAT(DISTINCT C.CategoryName ORDER BY C.CategoryName SEPARATOR ', ') AS categories,
            GROUP_CONCAT(COMP.ComponentName, ': ', COMP.Specification SEPARATOR ', ') AS components
        FROM Products P
        JOIN Suppliers S ON P.SupplierID = S.SupplierID
        LEFT JOIN ProductCategories PC ON P.ProductID = PC.ProductID
        LEFT JOIN Categories C ON PC.CategoryID = C.CategoryID
        LEFT JOIN Components COMP ON P.ProductID = COMP.ProductID
        WHERE P.ProductID = ?
        GROUP BY P.ProductID
    `;

    db.query(query, [productId], (err, result) => {
        if (err) {
            console.error('Error fetching product details:', err);
            return res.status(500).json({ error: 'Product details fetch karne mein masla hua.' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Product nahi mila.' });
        }
        res.json(result[0]);
    });
});

app.get('/api/search', (req, res) => {
    const searchQuery = req.query.q;

    if (!searchQuery) {
        return res.status(400).json({ error: 'Search query provide karein.' });
    }

    const searchTerm = `%${searchQuery}%`;

    const query = `
        SELECT
            P.ProductID AS id,
            P.ProductName AS name,
            P.Description AS description,
            P.Price AS price,
            S.SupplierName AS supplier,
            GROUP_CONCAT(DISTINCT C.CategoryName) AS categories
        FROM Products P
        JOIN Suppliers S ON P.SupplierID = S.SupplierID
        LEFT JOIN ProductCategories PC ON P.ProductID = PC.ProductID
        LEFT JOIN Categories C ON PC.CategoryID = C.CategoryID
        WHERE P.ProductName LIKE ?
           OR P.Description LIKE ?
           OR S.SupplierName LIKE ?
           OR C.CategoryName LIKE ?
        GROUP BY P.ProductID
    `;

    db.query(query, [searchTerm, searchTerm, searchTerm, searchTerm], (err, results) => {
        if (err) {
            console.error('Error searching products:', err);
            return res.status(500).json({ error: 'Search karne mein masla hua.' });
        }
        res.json({
            searchTerm: searchQuery,
            totalResults: results.length,
            results: results
        });
    });
});

app.get('/api/categories', (req, res) => {
    const query = `SELECT CategoryName FROM Categories ORDER BY CategoryName`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching categories:', err);
            return res.status(500).json({ error: 'Categories fetch karne mein masla hua.' });
        }
        res.json(results.map(row => row.CategoryName));
    });
});

app.get('/api/suppliers', (req, res) => {
    const query = `SELECT SupplierName FROM Suppliers ORDER BY SupplierName`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching suppliers:', err);
            return res.status(500).json({ error: 'Suppliers fetch karne mein masla hua.' });
        }
        res.json(results.map(row => row.SupplierName));
    });
});

app.get('/api/users', (req, res) => {
    const query = `
        SELECT
            UserID AS id,
            Name AS name,
            Email AS email
        FROM Users;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ error: 'Users ka data fetch karne mein masla hua.' });
        }
        res.json(results);
    });
});



app.listen(PORT, () => {
    console.log(`Server http://localhost:${PORT} par chal raha hai.`);
});