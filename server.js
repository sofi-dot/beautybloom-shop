const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
// Railway сам назначит порт, или используем 3000 локально
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// --- ПОДКЛЮЧЕНИЕ К БАЗЕ ДАННЫХ (УНИВЕРСАЛЬНОЕ) ---
// Используем переменные окружения (для Railway) ИЛИ локальные значения (для дома)
const db = mysql.createConnection({
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || '1234', // Ваш локальный пароль
    database: process.env.MYSQLDATABASE || 'beautybloom_db',
    port: process.env.MYSQLPORT || 3306
});

// Проверка подключения и автоматическое создание таблицы
db.connect(err => {
    if (err) {
        console.error('ОШИБКА подключения к базе данных: ' + err.stack);
        return;
    }
    console.log('Успешное подключение к MySQL (ID ' + db.threadId + ')');
    
    // Создаем таблицу пользователей, если её нет (нужно для чистого запуска на Railway)
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    db.query(createTableQuery, (err) => {
        if(err) console.error("Ошибка создания таблицы:", err);
        else console.log("Таблица users готова к работе.");
    });
});

// --- API МАРШРУТЫ ---

// 1. Регистрация
app.post('/api/auth/register', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length > 0) {
            return res.json({ success: false, message: 'Пользователь с таким email уже существует!' });
        }
        db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, password], (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ success: true, message: 'Вы успешно зарегистрированы!' });
        });
    });
});

// 2. Вход
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length > 0) {
            res.json({ success: true, message: 'Успешный вход!' });
        } else {
            res.json({ success: false, message: 'Неверный email или пароль.' });
        }
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен! Порт: ${PORT}`);
});