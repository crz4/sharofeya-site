// Функция для получения товаров из Local Storage
function getCartItems() {
    const cartItems = localStorage.getItem('cartItems');
    return cartItems ? JSON.parse(cartItems) : [];
}

// Функция для сохранения товаров в Local Storage
function saveCartItems(items) {
    localStorage.setItem('cartItems', JSON.stringify(items));
}

// Функция для отображения товаров в корзине
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartSummary = document.querySelector('.cart-summary');
    const cartItems = getCartItems();

    cartItemsContainer.innerHTML = ''; // Очищаем текущие элементы корзины

    if (cartItems.length === 0) {
        emptyCartMessage.style.display = 'block';
        cartSummary.style.display = 'none';
        cartItemsContainer.style.display = 'none';
        return;
    } else {
        emptyCartMessage.style.display = 'none';
        cartSummary.style.display = 'flex';
        cartItemsContainer.style.display = 'block';
    }

    cartItems.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.dataset.id = item.id;

        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>${item.price} ₽</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn decrease-quantity" data-id="${item.id}">-</button>
                <span class="item-quantity">${item.quantity}</span>
                <button class="quantity-btn increase-quantity" data-id="${item.id}">+</button>
            </div>
            <div class="cart-item-price">${item.price * item.quantity} ₽</div>
            <button class="remove-item-btn" data-id="${item.id}">&times;</button>
        `;
        cartItemsContainer.appendChild(cartItemElement);
    });

    updateCartTotal();
    addEventListenersToCartButtons();
}

// Функция для добавления товара в корзину (или увеличения количества, если уже есть)
function addToCart(item) {
    const cartItems = getCartItems();
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);

    if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity += 1;
    } else {
        cartItems.push({ ...item, quantity: 1 });
    }
    saveCartItems(cartItems);
    alert(`${item.name} добавлен в корзину!`); // Уведомление о добавлении
}

// Функция для удаления товара из корзины
function removeFromCart(id) {
    let cartItems = getCartItems();
    cartItems = cartItems.filter(item => item.id !== id);
    saveCartItems(cartItems);
    renderCart();
}

// Функция для изменения количества товара
function updateQuantity(id, change) {
    let cartItems = getCartItems();
    const itemIndex = cartItems.findIndex(item => item.id === id);

    if (itemIndex > -1) {
        cartItems[itemIndex].quantity += change;
        if (cartItems[itemIndex].quantity <= 0) {
            removeFromCart(id); // Если количество становится 0 или меньше, удаляем товар
        } else {
            saveCartItems(cartItems);
            renderCart();
        }
    }
}

// Функция для обновления общей суммы корзины
function updateCartTotal() {
    const cartItems = getCartItems();
    const totalPriceElement = document.getElementById('total-price');
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPriceElement.textContent = `${total} ₽`;
}

// Функция для очистки всей корзины
function clearCart() {
    if (confirm('Вы уверены, что хотите очистить корзину?')) {
        localStorage.removeItem('cartItems');
        renderCart();
    }
}

// Добавление обработчиков событий для кнопок корзины
function addEventListenersToCartButtons() {
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.onclick = (e) => updateQuantity(e.target.dataset.id, 1);
    });

    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.onclick = (e) => updateQuantity(e.target.dataset.id, -1);
    });

    document.querySelectorAll('.remove-item-btn').forEach(button => {
        button.onclick = (e) => removeFromCart(e.target.dataset.id);
    });
}

// Обработчик для кнопки "Оформить заказ"
document.getElementById('checkout-btn').addEventListener('click', () => {
    alert('Функционал оформления заказа пока не реализован.');
    // Здесь можно добавить логику перехода на страницу оформления заказа
});

// Обработчик для кнопки "Очистить корзину"
document.getElementById('clear-cart-btn').addEventListener('click', clearCart);

// Инициализация корзины при загрузке страницы
document.addEventListener('DOMContentLoaded', renderCart);