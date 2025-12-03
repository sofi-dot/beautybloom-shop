const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Раздаем статические файлы из текущей папки
app.use(express.static(__dirname));

// --- БД ---
const db = mysql.createConnection({
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || '1234',
    database: process.env.MYSQLDATABASE || 'beautybloom_db',
    port: process.env.MYSQLPORT || 3306
});

db.connect(err => {
    if (err) {
        console.error('ОШИБКА БД: ' + err.stack);
        return;
    }
    console.log('БД подключена.');
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    db.query(createTableQuery);
});

// --- API ---
app.post('/api/auth/register', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length > 0) return res.json({ success: false, message: 'Пользователь уже существует!' });
        db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, password], (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ success: true, message: 'Вы успешно зарегистрированы!' });
        });
    });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length > 0) res.json({ success: true, message: 'Успешный вход!' });
        else res.json({ success: false, message: 'Неверный email или пароль.' });
    });
});

// --- ГЛАВНАЯ СТРАНИЦА (С исправлением регистра) ---
app.get('/', (req, res) => {
    // Используем маленькую букву 'index.html'
    const filePath = path.join(__dirname, 'index.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("ОШИБКА ОТПРАВКИ ФАЙЛА:", err);
            res.status(500).send("Ошибка: Не могу найти файл index.html");
        }
    });
});

// Запуск (с 0.0.0.0)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Сервер запущен! Порт: ${PORT}`);
});