const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Раздаем статические файлы
app.use(express.static(__dirname));

// Логирование для дебага
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// --- БД с улучшенной обработкой ошибок ---
console.log('Проверка переменных окружения:');
console.log('MYSQLHOST:', process.env.MYSQLHOST ? 'установлено' : 'не установлено');
console.log('MYSQLUSER:', process.env.MYSQLUSER ? 'установлено' : 'не установлено');
console.log('MYSQLDATABASE:', process.env.MYSQLDATABASE || 'не установлено, использую beautybloom_db');

const dbConfig = {
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || '1234',
    database: process.env.MYSQLDATABASE || 'beautybloom_db',
    port: process.env.MYSQLPORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
};

const db = mysql.createPool(dbConfig);

// Проверка подключения к БД
db.getConnection((err, connection) => {
    if (err) {
        console.error('ОШИБКА ПОДКЛЮЧЕНИЯ К БД:', err.message);
        console.error('Код ошибки:', err.code);
        console.error('Номер ошибки:', err.errno);
        console.error('Состояние SQL:', err.sqlState);
    } else {
        console.log('БД успешно подключена!');
        
        // Создание таблицы пользователей
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        connection.query(createTableQuery, (err) => {
            if (err) {
                console.error('Ошибка создания таблицы:', err);
            } else {
                console.log('Таблица users проверена/создана');
            }
            connection.release();
        });
    }
});

// --- API ---
app.post('/api/auth/register', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email и пароль обязательны' 
        });
    }
    
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Ошибка при проверке пользователя:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Ошибка сервера' 
            });
        }
        
        if (results.length > 0) {
            return res.json({ 
                success: false, 
                message: 'Пользователь уже существует!' 
            });
        }
        
        db.query('INSERT INTO users (email, password) VALUES (?, ?)', 
            [email, password], 
            (err, result) => {
                if (err) {
                    console.error('Ошибка при регистрации:', err);
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Ошибка сервера' 
                    });
                }
                
                res.json({ 
                    success: true, 
                    message: 'Вы успешно зарегистрированы!' 
                });
            }
        );
    });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email и пароль обязательны' 
        });
    }
    
    db.query('SELECT * FROM users WHERE email = ? AND password = ?', 
        [email, password], 
        (err, results) => {
            if (err) {
                console.error('Ошибка при входе:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Ошибка сервера' 
                });
            }
            
            if (results.length > 0) {
                res.json({ 
                    success: true, 
                    message: 'Успешный вход!' 
                });
            } else {
                res.json({ 
                    success: false, 
                    message: 'Неверный email или пароль.' 
                });
            }
        }
    );
});

// Тестовый endpoint для проверки работы сервера
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok',
        timestamp: new Date().toISOString(),
        message: 'Сервер работает'
    });
});

// --- ОБРАБОТКА HTML СТРАНИЦ ---
const htmlPages = ['index.html', 'product.html', 'cart.html', 'contact.html'];

htmlPages.forEach(page => {
    const route = page === 'index.html' ? '/' : `/${page.replace('.html', '')}`;
    
    app.get(route, (req, res) => {
        const filePath = path.join(__dirname, page);
        console.log(`Запрос страницы: ${page}, путь: ${filePath}`);
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error(`Ошибка отправки ${page}:`, err);
                res.status(404).send('Страница не найдена');
            }
        });
    });
});

// Обработка 404
app.use((req, res) => {
    console.log(`404: ${req.method} ${req.url}`);
    res.status(404).send('Страница не найдена');
});

// Обработка ошибок сервера
app.use((err, req, res, next) => {
    console.error('Серверная ошибка:', err);
    res.status(500).send('Внутренняя ошибка сервера');
});

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
    console.log(`=== Сервер запущен! ===`);
    console.log(`Порт: ${PORT}`);
    console.log(`Текущее время: ${new Date().toISOString()}`);
    console.log(`Рабочая директория: ${__dirname}`);
    console.log(`Доступные файлы:`, require('fs').readdirSync(__dirname));
});