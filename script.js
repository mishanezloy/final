// Данные меню
const menuItems = [
    {
        id: 1,
        name: "Филадельфия",
        description: "Классические суши с лососем, авокадо и сливочным сыром",
        price: 320,
        category: "classic",
        icon: "fas fa-fan"
    },
    {
        id: 2,
        name: "Калифорния",
        description: "С крабом, авокадо, огурцом и икрой тобико",
        price: 280,
        category: "classic",
        icon: "fas fa-bowl-rice"
    },
    {
        id: 3,
        name: "Острый тунец",
        description: "С тунцом, острым соусом и кунжутом",
        price: 290,
        category: "spicy",
        icon: "fas fa-pepper-hot"
    },
    {
        id: 4,
        name: "Унаги",
        description: "С угрем, соусом унаги и кунжутом",
        price: 350,
        category: "premium",
        icon: "fas fa-dragon"
    },
    {
        id: 5,
        name: "Темпура",
        description: "В тесте темпура с креветкой и овощами",
        price: 310,
        category: "premium",
        icon: "fas fa-shrimp"
    },
    {
        id: 6,
        name: "Спайси лосось",
        description: "С лососем, острым соусом и зеленым луком",
        price: 300,
        category: "spicy",
        icon: "fas fa-fire"
    },
    {
        id: 7,
        name: "Вегетарианские",
        description: "С авокадо, огурцом, перцем и морковью",
        price: 240,
        category: "classic",
        icon: "fas fa-leaf"
    },
    {
        id: 8,
        name: "Императорские",
        description: "С лобстером, трюфельным маслом и икрой",
        price: 420,
        category: "premium",
        icon: "fas fa-crown"
    }
];

// Корзина
let cart = JSON.parse(localStorage.getItem('sushiCart')) || [];

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация главной страницы
    if (document.getElementById('menu-items')) {
        initMenuPage();
    }
    
    // Инициализация страницы корзины
    if (document.getElementById('cart-items-content')) {
        initCartPage();
    }
    
    // Обновление счетчика корзины на всех страницах
    updateCartCount();
});

// Инициализация главной страницы
function initMenuPage() {
    renderMenuItems();
    setupFilters();
    setupModal();
    updatePreparationTime();
}

// Инициализация страницы корзины
function initCartPage() {
    renderCartItems();
    setupCartEvents();
    updateOrderSummary();
}

// Отображение элементов меню
function renderMenuItems(filter = 'all') {
    const menuContainer = document.getElementById('menu-items');
    
    // Фильтрация элементов
    let filteredItems = menuItems;
    if (filter !== 'all') {
        filteredItems = menuItems.filter(item => item.category === filter);
    }
    
    // Очистка контейнера
    menuContainer.innerHTML = '';
    
    // Создание карточек для каждого элемента меню
    filteredItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = `menu-item`;
        menuItem.dataset.category = item.category;
        
        // Проверяем, есть ли товар уже в корзине
        const cartItem = cart.find(cartItem => cartItem.id === item.id);
        const quantity = cartItem ? cartItem.quantity : 0;
        const buttonText = quantity > 0 ? `В корзине: ${quantity}` : 'В корзину';
        
        menuItem.innerHTML = `
            <div class="menu-item-img">
                <i class="${item.icon}"></i>
            </div>
            <div class="menu-item-content">
                <div class="category-badge category-${item.category}">${getCategoryName(item.category)}</div>
                <h3 class="menu-item-title">${item.name}</h3>
                <p class="menu-item-description">${item.description}</p>
                <div class="menu-item-footer">
                    <div class="menu-item-price">${item.price} ₽</div>
                    <button class="add-to-cart-btn" data-id="${item.id}">
                        <i class="fas fa-cart-plus"></i> ${buttonText}
                    </button>
                </div>
            </div>
        `;
        
        menuContainer.appendChild(menuItem);
    });
    
    // Добавление обработчиков событий для кнопок
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            addToCart(itemId);
            updateCartCount();
            updatePreparationTime();
            
            // Обновляем текст на кнопке
            const cartItem = cart.find(item => item.id === itemId);
            this.innerHTML = `<i class="fas fa-cart-plus"></i> В корзине: ${cartItem.quantity}`;
            
            // Показываем модальное окно
            showSuccessModal();
        });
    });
}

// Настройка фильтров
function setupFilters() {
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Удаляем активный класс у всех кнопок
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Фильтруем элементы меню
            const category = this.getAttribute('data-category');
            renderMenuItems(category);
        });
    });
}

// Добавление товара в корзину
function addToCart(itemId) {
    const menuItem = menuItems.find(item => item.id === itemId);
    
    // Проверяем, есть ли товар уже в корзине
    const existingItemIndex = cart.findIndex(item => item.id === itemId);
    
    if (existingItemIndex !== -1) {
        // Увеличиваем количество
        cart[existingItemIndex].quantity += 1;
    } else {
        // Добавляем новый товар
        cart.push({
            id: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            category: menuItem.category,
            icon: menuItem.icon,
            quantity: 1
        });
    }
    
    // Сохраняем в localStorage
    saveCartToStorage();
    
    // Обновляем страницу корзины, если она открыта
    if (document.getElementById('cart-items-content')) {
        renderCartItems();
        updateOrderSummary();
    }
}

// Сохранение корзины в localStorage
function saveCartToStorage() {
    localStorage.setItem('sushiCart', JSON.stringify(cart));
}

// Обновление счетчика корзины
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Обновление времени приготовления
function updatePreparationTime() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const baseTime = 15; // Базовое время 15 минут
    
    // Добавляем 5 минут за каждые 3 позиции
    const additionalTime = Math.floor((totalItems - 1) / 3) * 5;
    const finalAdditionalTime = Math.max(0, additionalTime);
    const totalTime = baseTime + finalAdditionalTime;
    
    // Обновление на главной странице
    const prepTimeElement = document.getElementById('prep-time');
    if (prepTimeElement) {
        prepTimeElement.innerHTML = `Базовое время: <span>${totalTime} минут</span>`;
    }
    
    // Обновление на странице корзины
    const additionalTimeElement = document.getElementById('additional-time');
    const totalTimeElement = document.getElementById('total-time');
    
    if (additionalTimeElement && totalTimeElement) {
        additionalTimeElement.textContent = `${finalAdditionalTime} минут`;
        totalTimeElement.textContent = `${totalTime} минут`;
    }
    
    // Возвращаем общее время приготовления
    return totalTime;
}

// Отображение товаров в корзине
function renderCartItems() {
    const cartContainer = document.getElementById('cart-items-content');
    const emptyCartElement = document.getElementById('empty-cart');
    
    // Если корзина пуста
    if (cart.length === 0) {
        emptyCartElement.style.display = 'flex';
        return;
    }
    
    // Скрываем сообщение о пустой корзине
    emptyCartElement.style.display = 'none';
    
    // Очищаем контейнер
    cartContainer.innerHTML = '';
    
    // Добавляем каждый товар
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.dataset.id = item.id;
        
        const itemTotal = item.price * item.quantity;
        
        cartItem.innerHTML = `
            <div class="cart-item-img">
                <i class="${item.icon}"></i>
            </div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-category">${getCategoryName(item.category)}</div>
                <div class="cart-item-price">${item.price} ₽</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                <span class="quantity-value">${item.quantity}</span>
                <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
            </div>
            <div class="cart-item-total">${itemTotal} ₽</div>
            <button class="remove-item" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        cartContainer.appendChild(cartItem);
    });
    
    // Добавляем обработчики событий
    setupCartItemEvents();
}

// Настройка обработчиков событий для элементов корзины
function setupCartItemEvents() {
    // Увеличение/уменьшение количества
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const itemId = parseInt(this.getAttribute('data-id'));
            
            if (this.classList.contains('increase-btn')) {
                changeQuantity(itemId, 1);
            } else if (this.classList.contains('decrease-btn')) {
                changeQuantity(itemId, -1);
            }
        });
    });
    
    // Удаление товара
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const itemId = parseInt(this.getAttribute('data-id'));
            removeFromCart(itemId);
        });
    });
}

// Настройка обработчиков событий для корзины
function setupCartEvents() {
    // Очистка корзины
    document.getElementById('clear-cart').addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите очистить корзину?')) {
            cart = [];
            saveCartToStorage();
            updateCartCount();
            renderCartItems();
            updateOrderSummary();
            updatePreparationTime();
        }
    });
    
    // Оформление заказа
    document.getElementById('checkout-btn').addEventListener('click', function() {
        const totalTime = updatePreparationTime();
        alert('Спасибо за заказ! Ваш заказ будет готов через ' + 
              totalTime + 
              ' минут. С вами свяжется оператор для подтверждения.');
        
        // Очищаем корзину после оформления заказа
        cart = [];
        saveCartToStorage();
        updateCartCount();
        renderCartItems();
        updateOrderSummary();
        updatePreparationTime();
    });
}

// Изменение количества товара
function changeQuantity(itemId, change) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        // Удаляем товар, если количество стало 0 или меньше
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        // Сохраняем изменения
        saveCartToStorage();
        updateCartCount();
        renderCartItems();
        updateOrderSummary();
        updatePreparationTime();
        
        // Обновляем кнопки на главной странице
        updateMenuButtons();
    }
}

// Удаление товара из корзины
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCartToStorage();
    updateCartCount();
    renderCartItems();
    updateOrderSummary();
    updatePreparationTime();
    
    // Обновляем кнопки на главной странице
    updateMenuButtons();
}

// Обновление кнопок на главной странице
function updateMenuButtons() {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        const itemId = parseInt(button.getAttribute('data-id'));
        const cartItem = cart.find(item => item.id === itemId);
        
        if (cartItem) {
            button.innerHTML = `<i class="fas fa-cart-plus"></i> В корзине: ${cartItem.quantity}`;
        } else {
            button.innerHTML = `<i class="fas fa-cart-plus"></i> В корзину`;
        }
    });
}

// Обновление итоговой информации о заказе
function updateOrderSummary() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const orderSum = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Стоимость доставки
    let deliveryCost = 200;
    let deliveryNote = document.getElementById('delivery-note');
    let deliveryCostElement = document.getElementById('delivery-cost');
    
    if (orderSum >= 1000 || orderSum === 0) {
        deliveryCost = 0;
        deliveryNote.innerHTML = '<i class="fas fa-info-circle"></i><p>Доставка бесплатная!</p>';
        deliveryNote.style.backgroundColor = 'rgba(139, 0, 0, 0.2)';
        deliveryCostElement.textContent = 'Бесплатно';
        deliveryCostElement.style.color = '#4CAF50';
    } else {
        const remaining = 1000 - orderSum;
        deliveryNote.innerHTML = `<i class="fas fa-info-circle"></i><p>Добавьте товаров на ${remaining} ₽ для бесплатной доставки</p>`;
        deliveryNote.style.backgroundColor = 'rgba(255, 193, 7, 0.1)';
        deliveryCostElement.textContent = `${deliveryCost} ₽`;
        deliveryCostElement.style.color = 'var(--primary)';
    }
    
    const totalCost = orderSum + deliveryCost;
    
    // Получаем общее время приготовления
    const totalTime = updatePreparationTime();
    
    // Обновляем значения на странице
    document.getElementById('total-items').textContent = totalItems;
    document.getElementById('order-sum').textContent = `${orderSum} ₽`;
    document.getElementById('total-amount').textContent = `${totalCost} ₽`;
    document.getElementById('cooking-time').textContent = `Время приготовления: ${totalTime} мин`;
    
    // Активируем/деактивируем кнопку оформления заказа
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.disabled = totalItems === 0;
}

// Получение названия категории по ключу
function getCategoryName(categoryKey) {
    const categories = {
        'classic': 'Классические',
        'spicy': 'Острые',
        'premium': 'Премиум'
    };
    
    return categories[categoryKey] || 'Другое';
}

// Модальное окно
function setupModal() {
    const modal = document.getElementById('success-modal');
    const closeBtn = document.querySelector('.close-modal');
    const continueBtn = document.querySelector('.continue-btn');
    
    if (!modal || !closeBtn || !continueBtn) return;
    
    // Закрытие модального окна
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    continueBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Закрытие при клике вне модального окна
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Показать модальное окно успешного добавления
function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}