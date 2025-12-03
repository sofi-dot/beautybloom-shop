/* ===================================================================
   НАША "БАЗА ДАННЫХ" ТОВАРОВ (12 ШТУК)
   =================================================================== */
const productsDB = [
  // 1-6 (Старые товары)
  { id: 1, name: 'Крем для лица "Сияние"', price: 1500, image_url: 'images/krem.jpg', badge: 'Хит', description: 'Легкий увлажняющий крем.', full_description: 'Крем обеспечивает 24 часа увлажнения...', composition: ['Aqua', 'Hyaluronic Acid'] },
  { id: 2, name: 'Сыворотка "Анти-Эйдж"', price: 2200, image_url: 'images/serum.jpg', badge: 'Скидка -20%', description: 'Сыворотка против старения.', full_description: 'Мощная формула с ретинолом...', composition: ['Retinol', 'Vitamin C'] },
  { id: 3, name: 'Маска для волос "Объем"', price: 1200, image_url: 'images/maska.jpg', badge: null, description: 'Маска для объема.', full_description: 'Уплотняет структуру волоса...', composition: ['Keratin', 'Collagen'] },
  { id: 4, name: 'Гидрогелевые патчи', price: 800, image_url: 'images/patchi.jpg', badge: null, description: 'Патчи под глаза.', full_description: 'Убирают отеки...', composition: ['Pearl Extract', 'Caffeine'] },
  { id: 5, name: 'Тоник для кожи "Баланс"', price: 950, image_url: 'images/tonik.jpg', badge: null, description: 'Успокаивающий тоник.', full_description: 'Нормализует pH...', composition: ['Green Tea', 'Aqua'] },
  { id: 6, name: 'Масло для тела "Релакс"', price: 1800, image_url: 'images/maslo.jpg', badge: null, description: 'Масло с лавандой.', full_description: 'Питает кожу...', composition: ['Jojoba Oil', 'Lavender'] },
  
  // 7-12 (Новые товары)
  { id: 7, name: 'Мицеллярная вода "Чистота"', price: 750, image_url: 'images/micellar.jpg', badge: 'Новинка', description: 'Мягкое снятие макияжа.', full_description: 'Мицеллы притягивают загрязнения...', composition: ['Aqua', 'Micelles'] },
  { id: 8, name: 'Скраб для тела "Обновление"', price: 1100, image_url: 'images/scrub.jpg', badge: null, description: 'Сахарный скраб.', full_description: 'Отшелушивает омертвевшие клетки...', composition: ['Sugar', 'Shea Butter'] },
  { id: 9, name: 'Крем для век "Свежий взгляд"', price: 1300, image_url: 'images/eye-cream.jpg', badge: null, description: 'Борьба с отеками.', full_description: 'Легкий гель-крем...', composition: ['Caffeine', 'Vitamin K'] },
  { id: 10, name: 'Бальзам для губ "Медовый"', price: 450, image_url: 'images/lip-balm.jpg', badge: null, description: 'Питательный бальзам.', full_description: 'Защищает губы...', composition: ['Beeswax', 'Honey'] },
  { id: 11, name: 'Солнцезащитный крем SPF 50+', price: 1600, image_url: 'images/sunscreen.jpg', badge: 'SPF 50+', description: 'Защита от солнца.', full_description: 'Невесомая текстура...', composition: ['Zinc Oxide', 'Aqua'] },
  { id: 12, name: 'Масло-шелк для волос', price: 1400, image_url: 'images/hair-oil.jpg', badge: null, description: 'Масло для блеска.', full_description: 'Запаивает кончики...', composition: ['Argan Oil', 'Dimethiconol'] },
];

/* ===================================================================
   ОСНОВНОЙ КОД
   =================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  
  // Запуск счетчика корзины
  updateCartCounter(); 
  
  // Проверяем, на какой мы странице, и запускаем нужные функции
  if (document.getElementById("product-grid-container")) {
    renderHomePageProducts();
  }
  if (document.getElementById("product-name")) {
    renderProductDetailPage();
    document.getElementById('add-to-cart-btn').addEventListener('click', handleAddToCart);
  }
  if (document.getElementById("cart-items-container")) {
    renderCartPage();
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', handleCheckout);
    }
  }

  /* --- ФУНКЦИИ МАГАЗИНА (Каталог, Корзина) --- */
  
  // Отрисовка товаров на главной
  function renderHomePageProducts() {
    const container = document.getElementById("product-grid-container");
    if (!container) return;
    let html = ''; 
    productsDB.forEach(product => {
      html += `
        <div class="product-card">
          ${product.badge ? `<span class="badge">${product.badge}</span>` : ''}
          <a href="product.html?id=${product.id}">
            <img src="${product.image_url}" alt="${product.name}">
          </a>
          <h3>${product.name}</h3>
          <p class="price">${product.price} руб.</p>
        </div>
      `;
    });
    container.innerHTML = html;
  }
  
  // Отрисовка страницы одного товара
  function renderProductDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (!productId) return;
    
    const product = productsDB.find(p => p.id == productId);
    if (!product) { document.getElementById("product-name").innerText = "Товар не найден!"; return; }
    
    document.title = product.name + " - BeautyBloom"; 
    document.getElementById("product-name").innerText = product.name;
    document.getElementById("product-price").innerText = product.price;
    document.getElementById("product-image").src = product.image_url;
    document.getElementById("product-image").alt = product.name;
    document.getElementById("product-description").innerText = product.description;
    document.getElementById("product-full-description").innerText = product.full_description;
    
    const compositionList = document.getElementById("product-composition");
    compositionList.innerHTML = ''; 
    product.composition.forEach(item => { compositionList.innerHTML += `<li>${item}</li>`; });
    
    document.getElementById("add-to-cart-btn").setAttribute("data-id", product.id);
  }

  // Добавление в корзину
  function handleAddToCart(e) {
    e.preventDefault();
    const productId = e.target.getAttribute('data-id');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let existingItem = cart.find(item => item.id == productId);
    
    if (existingItem) { 
        existingItem.quantity += 1; 
    } else { 
        cart.push({ id: productId, quantity: 1 }); 
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    
    // Перенаправляем на главную после добавления
    window.location.href = 'Index.html'; 
  }
  
  // Отрисовка страницы корзины
  function renderCartPage() {
    const container = document.getElementById("cart-items-container");
    const totalSumEl = document.getElementById("cart-total-sum");
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (!container) return; 
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
      container.innerHTML = "<p>Ваша корзина пуста. <a href='Index.html'>Перейти к покупкам</a></p>";
      totalSumEl.innerText = '0';
      if (checkoutBtn) checkoutBtn.style.display = 'none';
      return;
    }
    
    if (checkoutBtn) checkoutBtn.style.display = 'inline-block';
    
    let html = '';
    let totalSum = 0;
    
    cart.forEach(item => {
      const product = productsDB.find(p => p.id == item.id);
      if (!product) return; 
      
      const itemTotal = product.price * item.quantity;
      totalSum += itemTotal;
      
      html += `
        <div class="cart-item">
          <img src="${product.image_url}" alt="${product.name}" class="cart-item-image">
          <div class="cart-item-details">
            <h3>${product.name}</h3>
            <p>${product.price} руб. x ${item.quantity}</p>
          </div>
          <div class="cart-item-price">${itemTotal} руб.</div>
          <button class="cart-item-remove" data-id="${product.id}">Удалить</button>
        </div>
      `;
    });
    
    container.innerHTML = html;
    totalSumEl.innerText = totalSum;
    
    document.querySelectorAll('.cart-item-remove').forEach(button => {
      button.addEventListener('click', handleRemoveFromCart);
    });
  }

  // Удаление из корзины
  function handleRemoveFromCart(e) {
    const productId = e.target.getAttribute('data-id');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id != productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartPage();
    updateCartCounter();
  }

  // Оформление заказа
  function handleCheckout(e) {
    e.preventDefault();
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) { return; }
    
    const successMsg = document.getElementById('checkout-success-message');
    if (successMsg) {
      successMsg.style.display = 'block';
    }
    
    localStorage.removeItem('cart'); 
    updateCartCounter(); 
    renderCartPage();
    
    setTimeout(() => {
      if (successMsg) {
        successMsg.style.display = 'none';
      }
    }, 5000); 
  }

  // Обновление счетчика в шапке
  function updateCartCounter() {
    const counterElements = document.querySelectorAll('#cart-counter'); 
    if (!counterElements.length) return; 
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalItems = 0;
    cart.forEach(item => { totalItems += item.quantity; });
    
    counterElements.forEach(el => {
      el.innerText = `(${totalItems})`;
    });
  }


  /* ===================================================================
     ЛОГИКА АВТОРИЗАЦИИ (СВЯЗЬ С СЕРВЕРОМ NODE.JS)
     =================================================================== */

  // Получаем элементы формы
  const authContainer = document.getElementById("auth-container");
  const authModal = document.getElementById("auth-modal");
  const closeAuthModal = document.getElementById("close-auth-modal");
  const loginFormView = document.getElementById("login-form-view");
  const registerFormView = document.getElementById("register-form-view");
  const showRegisterLink = document.getElementById("show-register");
  const showLoginLink = document.getElementById("show-login");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const loginErrorEl = document.getElementById("login-error");
  const registerErrorEl = document.getElementById("register-error");

  // Функции для показа ошибок
  function showError(element, message) {
    if (element) {
      element.innerText = message;
      element.style.display = "block";
    }
  }
  function clearErrors() {
    if (loginErrorEl) loginErrorEl.style.display = "none";
    if (registerErrorEl) registerErrorEl.style.display = "none";
  }

  // Открытие/закрытие модального окна
  if (authContainer) {
    authContainer.addEventListener("click", (e) => {
      if (e.target.id === "login-btn") {
        e.preventDefault();
        if (authModal) {
          clearErrors(); 
          authModal.style.display = "block";
          loginFormView.style.display = "block";
          registerFormView.style.display = "none";
        }
      }
    });
  }
  if (closeAuthModal) {
    closeAuthModal.addEventListener("click", () => { authModal.style.display = "none"; });
  }
  
  // Переключение между Входом и Регистрацией
  if (showRegisterLink) {
    showRegisterLink.addEventListener("click", (e) => {
      e.preventDefault();
      clearErrors(); 
      loginFormView.style.display = "none";
      registerFormView.style.display = "block";
    });
  }
  if (showLoginLink) {
    showLoginLink.addEventListener("click", (e) => {
      e.preventDefault();
      clearErrors(); 
      loginFormView.style.display = "block";
      registerFormView.style.display = "none";
    });
  }

  // --- РЕГИСТРАЦИЯ ---
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearErrors(); 
      
      const email = document.getElementById("register-email").value;
      const pass1 = document.getElementById("register-password").value;
      const pass2 = document.getElementById("register-password-confirm").value;

      if (pass1.length < 6) {
        showError(registerErrorEl, "Пароль должен быть не менее 6 символов.");
        return; 
      }
      if (pass1 !== pass2) {
        showError(registerErrorEl, "Пароли не совпадают!");
        return; 
      }

      // Отправляем запрос на сервер
      try {
        const response = await fetch('https://beautybloom-shop-production.up.railway.app/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: pass1 })
        });
        
        const data = await response.json();

        if (data.success) {
            // Если успешно - переключаем на вход
            showLoginLink.click(); 
        } else {
            // Если ошибка - показываем её
            showError(registerErrorEl, data.message);
        }
      } catch (error) {
         console.error('Ошибка:', error);
         showError(registerErrorEl, "Ошибка подключения к серверу (убедитесь, что node server.js запущен)");
      }
    });
  }

  // --- ВХОД ---
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearErrors(); 
      
      const email = document.getElementById("login-email").value;
      const pass = document.getElementById("login-password").value;

      try {
        const response = await fetch('http://https://beautybloom-shop-production.up.railway.app/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: pass })
        });

        const data = await response.json();

        if (data.success) {
            // Успешный вход
            sessionStorage.setItem("currentUser", email); 
            authModal.style.display = "none"; 
            updateHeader(email); 
        } else {
            // Ошибка входа
            showError(loginErrorEl, data.message);
        }
      } catch (error) {
         console.error('Ошибка:', error);
         showError(loginErrorEl, "Ошибка подключения к серверу (убедитесь, что node server.js запущен)");
      }
    });
  }

  // Обновление шапки (Привет, User)
  function updateHeader(userIdentifier) { 
    if (!authContainer) return;
    if (userIdentifier) {
      const namePart = userIdentifier.split('@')[0];
      authContainer.innerHTML = `
        <span class="welcome-user">Привет, ${namePart}!</span>
        <a href="#" id="logout-btn">Выйти</a>
      `;
      // Обработка кнопки "Выйти"
      document.getElementById("logout-btn").addEventListener("click", (e) => {
        e.preventDefault();
        sessionStorage.removeItem("currentUser");
        updateHeader(null);
      });
    } else {
      authContainer.innerHTML = `<a href="#" id="login-btn">Войти</a>`;
    }
  }

  // Проверка сессии при загрузке страницы
  const currentUser = sessionStorage.getItem("currentUser"); 
  updateHeader(currentUser);
  
  // Закрытие окна по клику на фон
  window.addEventListener("click", (e) => {
    if (e.target == authModal) { authModal.style.display = "none"; }
  });

  /* ===================================================================
     ОСТАЛЬНОЕ (Скролл, Карта, Форма контактов)
     =================================================================== */

  // Плавный скролл
  const productNavLinks = document.querySelectorAll(".product-nav a");
  productNavLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      try {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } catch (error) {}
    });
  });

  // Яндекс Карта (API)
  const mapElement = document.getElementById("map");
  if (mapElement && typeof ymaps !== "undefined") {
    ymaps.ready(initMap);
  } else if (mapElement) {
    mapElement.innerHTML = "Не удалось загрузить карту. Проверьте API-ключ в файле contact.html";
  }
  
  function initMap() {
    const address = "г. Москва, ул. Тверская, д. 1";
    const myMap = new ymaps.Map("map", { center: [55.7558, 37.6176], zoom: 12, controls: ["zoomControl", "fullscreenControl"] });
    ymaps.geocode(address).then((res) => {
        const coords = res.geoObjects.get(0).geometry.getCoordinates();
        const placemark = new ymaps.Placemark(coords, { balloonContentHeader: "BeautyBloom", balloonContentBody: address, hintContent: "Наш магазин" }, { preset: "islands#pinkIcon" });
        myMap.geoObjects.add(placemark);
        myMap.setCenter(coords);
        myMap.setZoom(16);
      }).catch((err) => {
        mapElement.innerHTML = "Не удалось определить адрес. <br> Проверьте ваш API-ключ Яндекса.";
      });
  }

  // Форма обратной связи (зеленое сообщение)
  const contactPageForm = document.getElementById("contact-page-form");
  const contactSuccessMsg = document.getElementById("contact-success-message");
  if (contactPageForm) {
    contactPageForm.addEventListener("submit", (e) => {
      e.preventDefault();
      contactPageForm.reset();
      if (contactSuccessMsg) {
        contactSuccessMsg.style.display = "block";
      }
      setTimeout(() => {
        if (contactSuccessMsg) {
          contactSuccessMsg.style.display = "none";
        }
      }, 5000);
    });
  }

}); // Конец