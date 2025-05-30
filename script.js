
## JavaScript (script.js)

```javascript
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
    
    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                navLinks.classList.remove('active');
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Product Data - Adaptado para o mercado português
    const products = [
        {
            id: 1,
            title: "Coxinha de Frango",
            category: "salgados",
            price: 1.50, // Preços em euros
            image: "coxinha.jpg",
            description: "Deliciosa coxinha de frango com queijo, massa crocante e saborosa."
        },
        {
            id: 2,
            title: "Pastel de Carne",
            category: "salgados",
            price: 1.80,
            image: "pastel-carne.jpg",
            description: "Pastel frito com recheio de carne moída temperada à portuguesa."
        },
        {
            id: 3,
            title: "Rissol de Camarão",
            category: "salgados",
            price: 2.00,
            image: "rissole-camarao.jpg",
            description: "Rissol crocante com recheio cremoso de camarão."
        },
        {
            id: 4,
            title: "Bolo de Chocolate",
            category: "bolos",
            price: 15.00,
            image: "bolo-chocolate.jpg",
            description: "Bolo de chocolate húmido com cobertura de ganache."
        },
        {
            id: 5,
            title: "Bolo de Bolacha",
            category: "bolos",
            price: 12.00,
            image: "bolo-bolacha.jpg",
            description: "Clássico bolo de bolacha portuguesa com café."
        },
        {
            id: 6,
            title: "Sumo Natural",
            category: "bebidas",
            price: 2.50,
            image: "sumo-natural.jpg",
            description: "Sumo natural 330ml - sabores: laranja, ananás ou maracujá."
        },
        {
            id: 7,
            title: "Água Mineral",
            category: "bebidas",
            price: 1.00,
            image: "agua-mineral.jpg",
            description: "Garrafa de água mineral 500ml."
        },
        {
            id: 8,
            title: "Molho Picante",
            category: "molhos",
            price: 0.50,
            image: "molho-picante.jpg",
            description: "Molho picante caseiro - intensidade média."
        },
        {
            id: 9,
            title: "Molho de Alho",
            category: "molhos",
            price: 0.50,
            image: "molho-alho.jpg",
            description: "Molho de alho cremoso para acompanhar."
        }
    ];
    
    // Display Products
    const productGrid = document.getElementById('product-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    function displayProducts(filter = 'all') {
        productGrid.innerHTML = '';
        
        const filteredProducts = filter === 'all' 
            ? products 
            : products.filter(product => product.category === filter);
        
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.category = product.category;
            
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">€ ${product.price.toFixed(2)}</div>
                    <div class="product-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn minus">-</button>
                            <input type="number" class="quantity-input" value="1" min="1">
                            <button class="quantity-btn plus">+</button>
                        </div>
                        <button class="add-to-cart" data-id="${product.id}">Adicionar</button>
                    </div>
                </div>
            `;
            
            productGrid.appendChild(productCard);
        });
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.parentElement.querySelector('.quantity-input');
                let value = parseInt(input.value);
                
                if (this.classList.contains('minus')) {
                    if (value > 1) {
                        input.value = value - 1;
                    }
                } else if (this.classList.contains('plus')) {
                    input.value = value + 1;
                }
            });
        });
        
        // Add event listeners to add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                const product = products.find(p => p.id === productId);
                const quantity = parseInt(this.closest('.product-actions').querySelector('.quantity-input').value);
                
                addToCart(product, quantity);
            });
        });
    }
    
    // Filter Products
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            displayProducts(filter);
        });
    });
    
    // Cart Functionality
    let cart = [];
    const cartModal = document.getElementById('cartModal');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCount = document.querySelector('.cart-count');
    const totalPriceElement = document.querySelector('.total-price');
    const cartIcon = document.querySelector('.cart-icon a');
    const closeCartBtn = document.querySelector('.close-cart');
    const continueShoppingBtn = document.getElementById('continueShopping');
    const checkoutBtn = document.getElementById('checkout');
    
    // Toggle cart modal
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        cartModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    closeCartBtn.addEventListener('click', closeCart);
    continueShoppingBtn.addEventListener('click', closeCart);
    
    function closeCart() {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Close modal when clicking outside
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            closeCart();
        }
    });
    
    function addToCart(product, quantity = 1) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
        
        updateCart();
        showAddedToCartMessage(product.title, quantity);
    }
    
    function updateCart() {
        // Update cart count
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Update cart items
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">O seu carrinho está vazio</p>';
            checkoutBtn.disabled = true;
        } else {
            checkoutBtn.disabled = false;
            
            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                
                cartItemElement.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.title}</h4>
                        <span class="cart-item-price">€ ${item.price.toFixed(2)}</span>
                        <div class="cart-item-actions">
                            <div class="cart-item-quantity">
                                <button class="decrease">-</button>
                                <input type="number" value="${item.quantity}" min="1">
                                <button class="increase">+</button>
                            </div>
                            <span class="remove-item" data-id="${item.id}">Remover</span>
                        </div>
                    </div>
                `;
                
                cartItemsContainer.appendChild(cartItemElement);
            });
            
            // Add event listeners to quantity buttons in cart
            document.querySelectorAll('.cart-item-quantity button').forEach(btn => {
                btn.addEventListener('click', function() {
                    const input = this.parentElement.querySelector('input');
                    let value = parseInt(input.value);
                    const itemId = parseInt(this.closest('.cart-item-details').querySelector('.remove-item').dataset.id);
                    
                    if (this.classList.contains('decrease')) {
                        if (value > 1) {
                            input.value = value - 1;
                            updateCartItem(itemId, value - 1);
                        } else {
                            removeFromCart(itemId);
                        }
                    } else if (this.classList.contains('increase')) {
                        input.value = value + 1;
                        updateCartItem(itemId, value + 1);
                    }
                });
            });
            
            // Add event listeners to remove buttons
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', function() {
                    const itemId = parseInt(this.dataset.id);
                    removeFromCart(itemId);
                });
            });
            
            // Add event listener to quantity inputs
            document.querySelectorAll('.cart-item-quantity input').forEach(input => {
                input.addEventListener('change', function() {
                    const itemId = parseInt(this.closest('.cart-item-details').querySelector('.remove-item').dataset.id);
                    const value = parseInt(this.value);
                    
                    if (value < 1) {
                        removeFromCart(itemId);
                    } else {
                        updateCartItem(itemId, value);
                    }
                });
            });
        }
        
        // Update total price
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalPriceElement.textContent = `€ ${totalPrice.toFixed(2)}`;
    }
    
    function updateCartItem(itemId, quantity) {
        const item = cart.find(item => item.id === itemId);
        if (item) {
            item.quantity = quantity;
            updateCart();
        }
    }
    
    function removeFromCart(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        updateCart();
    }
    
    function showAddedToCartMessage(productName, quantity) {
        const message = document.createElement('div');
        message.className = 'cart-message';
        message.innerHTML = `
            <span>${quantity}x ${productName} adicionado ao carrinho!</span>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => {
                message.remove();
            }, 300);
        }, 3000);
    }
    
    // Checkout button
    checkoutBtn.addEventListener('click', function() {
        if (cart.length > 0) {
            // Aqui você pode adicionar a lógica de checkout
            alert('Obrigado pela sua encomenda! Entraremos em contacto para confirmar os detalhes.');
            cart = [];
            updateCart();
            closeCart();
        }
    });
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Aqui você pode adicionar a lógica de envio do formulário
        alert('Obrigado pela sua mensagem! Entraremos em contacto brevemente.');
        this.reset();
    });
    
    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletterForm');
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Aqui você pode adicionar a lógica de subscrição
        alert('Obrigado por subscrever a nossa newsletter!');
        this.reset();
    });
    
    // Initialize the page
    displayProducts();
});

// Adicionar estilo para a mensagem de adição ao carrinho
const style = document.createElement('style');
style.textContent = `
    .cart-message {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--primary-color);
        color: var(--dark-color);
        padding: 15px 30px;
        border-radius: 50px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        opacity: 0;
        transition: all 0.3s ease;
        font-weight: 500;
    }
    
    .cart-message.show {
        opacity: 1;
        bottom: 30px;
    }
;
document.head.appendChild(style);