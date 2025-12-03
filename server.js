const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000; // Порт, на котором будет работать наш сервер

// Настройки (разрешаем сайту общаться с сервером и читать JSON)
app.use(cors());
app.use(bodyParser.json());

// --- ПОДКЛЮЧЕНИЕ К БАЗЕ ДАННЫХ ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',   // Ваш логин
    password: '1234',        // Ваш пароль
    database: 'beautybloom_db' // Ваша база данных
});

// Проверка подключения
db.connect(err => {
    if (err) {
        console.error('ОШИБКА подключения к базе данных: ' + err.stack);
        return;
    }
    console.log('Успешное подключение к MySQL (ID ' + db.threadId + ')');
});

// --- API МАРШРУТЫ (Команды, которые понимает сервер) ---

// 1. Регистрация
app.post('/register', (req, res) => {
    const { email, password } = req.body;

    // Шаг 1: Проверяем, есть ли уже такой email в базе
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ error: err });

        if (results.length > 0) {
            // Если нашли пользователя с таким email
            return res.json({ success: false, message: 'Пользователь с таким email уже существует!' });
        }

        // Шаг 2: Если не нашли - добавляем нового
        db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, password], (err, result) => {
            if (err) return res.status(500).json({ error: err });
            
            // Отправляем ответ сайту
            res.json({ success: true, message: 'Вы успешно зарегистрированы!' });
        });
    });
});

// 2. Вход
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Ищем пользователя, у которого совпадает И email, И пароль
    db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
        if (err) return res.status(500).json({ error: err });

        if (results.length > 0) {
            // Нашли совпадение!
            res.json({ success: true, message: 'Успешный вход!' });
        } else {
            // Не нашли
            res.json({ success: false, message: 'Неверный email или пароль.' });
        }
    });
});

// Запуск сервера (слушаем порт 3000)
app.listen(PORT, () => {
    console.log(`Сервер запущен! Адрес: http://localhost:${PORT}`);
});