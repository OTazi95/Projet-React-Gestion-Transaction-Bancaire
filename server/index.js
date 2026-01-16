const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Routes placeholders
// 1. Inscription
app.post('/register', (req, res) => {
    const { fullName, username, password } = req.body;
    const sql = 'INSERT INTO users (fullName, username, password) VALUES (?, ?, ?)';
    db.query(sql, [fullName, username, password], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Utilisateur créé', userId: result.insertId });
    });
});

// 2. Connexion
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ message: 'Identifiants incorrects' });
        res.json({ message: 'Connexion réussie', user: results[0] });
    });
});

// 3. Info Utilisateur (Dashboard)
app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    const sql = 'SELECT id, fullName, username, balance FROM users WHERE id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        res.json(results[0]);
    });
});

// 4. Transactions (Virement, Versement, Retrait)
app.post('/transaction', (req, res) => {
    const { userId, type, amount, description } = req.body;
    // type: 'DEPOSIT', 'WITHDRAWAL', 'TRANSFER'

    // Note: Une transaction réelle nécessiterait des transactions SQL (ACID)
    // Pour ce projet étudiant simple, on fait des requêtes séquentielles

    if (type === 'WITHDRAWAL' || type === 'TRANSFER') {
        // Vérifier le solde d'abord (simplifié)
        const checkBalanceSql = 'SELECT balance FROM users WHERE id = ?';
        db.query(checkBalanceSql, [userId], (err, results) => {
            if (err) return res.status(500).json({ error: err });
            if (results[0].balance < amount) {
                return res.status(400).json({ message: 'Solde insuffisant' });
            }
            processTransaction();
        });
    } else {
        processTransaction();
    }

    function processTransaction() {
        // Mettre à jour le solde
        let updateBalanceSql = '';
        if (type === 'DEPOSIT') {
            updateBalanceSql = 'UPDATE users SET balance = balance + ? WHERE id = ?';
        } else {
            updateBalanceSql = 'UPDATE users SET balance = balance - ? WHERE id = ?';
        }

        db.query(updateBalanceSql, [amount, userId], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            // Enregistrer la transaction
            const transactionSql = 'INSERT INTO transactions (userId, type, amount, description) VALUES (?, ?, ?, ?)';
            db.query(transactionSql, [userId, type, amount, description], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Transaction réussie' });
            });
        });
    }
});

// 5. Historique
app.get('/history/:id', (req, res) => {
    const userId = req.params.id;
    const sql = 'SELECT * FROM transactions WHERE userId = ? ORDER BY date DESC';
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://10.40.30.50:${port}`);
});
