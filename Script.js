let cart = [];
let orders = [];
let isLoggedIn = false;

// Show selected section and hide others
function showSection(sectionId) {
  document.querySelectorAll('section').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(sectionId).classList.add('active');
}

// Add to Cart functionality
function addToCart(productName, price) {
  cart.push({ productName, price });
  updateCartCount();
  alert(`Added to Cart: ${productName} - Rs. ${price}`);
}

// Update Cart Count
function updateCartCount() {
  document.getElementById('cart-count').textContent = cart.length;
}

// Display Cart Items
function displayCartItems() {
  const cartItems = document.getElementById('cart-items');
  cartItems.innerHTML = '';
  cart.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <p>${item.productName} - Rs. ${item.price}</p>
      <button onclick="removeFromCart(${index})">Remove</button>
    `;
    cartItems.appendChild(itemDiv);
  });
}

// Remove from Cart
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartCount();
  displayCartItems();
}

// Checkout
function checkout() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  if (!isLoggedIn) {
    alert('Please login to checkout.');
    toggleLogin();
    return;
  }
  orders.push(...cart);
  cart = [];
  updateCartCount();
  displayCartItems();
  displayOrders();
  alert('Checkout successful!');
}

// Display Orders
function displayOrders() {
  const orderList = document.getElementById('order-list');
  orderList.innerHTML = '';
  orders.forEach((order, index) => {
    const orderDiv = document.createElement('div');
    orderDiv.className = 'order-item';
    orderDiv.innerHTML = `
      <p>${order.productName} - Rs. ${order.price}</p>
    `;
    orderList.appendChild(orderDiv);
  });
}

// Book Service functionality
function bookService(serviceName, price) {
  if (!isLoggedIn) {
    alert('Please login to book a service.');
    toggleLogin();
    return;
  }
  orders.push({ productName: serviceName, price });
  displayOrders();
  alert(`Booked Service: ${serviceName} - Rs. ${price}`);
}

// Login Modal
function toggleLogin() {
  const modal = document.getElementById('login-modal');
  modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

// Login Form Submission
document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  if (username === 'admin' && password === 'password') {
    isLoggedIn = true;
    alert('Login successful!');
    toggleLogin();
    document.getElementById('login-btn').textContent = 'Logout';
  } else {
    alert('Invalid username or password.');
  }
});

// Initialize
showSection('cloth-shop');
updateCartCount(); // Ensure the function is properly called.


// ===== BUSINESS DATA STRUCTURES =====
let businessData = {
  stock: [],
  employees: [],
  sales: [],
  bookings: [],
  messages: [],
  finances: {
    daily: [],
    monthly: [],
    yearly: []
  }
};

// ===== STOCK MANAGEMENT =====
function addProduct() {
  const product = {
    name: document.getElementById('product-name').value,
    stock: parseInt(document.getElementById('initial-stock').value),
    minStock: 10 // Set reorder alert threshold
  };
  businessData.stock.push(product);
  updateStockDisplay();
}

function updateStockDisplay() {
  const tbody = document.getElementById('stock-list');
  tbody.innerHTML = '';
  businessData.stock.forEach((product, index) => {
    const row = `
      <tr>
        <td>${product.name}</td>
        <td class="${product.stock < product.minStock ? 'stock-alert' : ''}">
          ${product.stock}
        </td>
        <td>
          <button onclick="restock(${index}, 50)">Restock</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// ===== EMPLOYEE PAYROLL =====
function addEmployee() {
  const employee = {
    name: document.getElementById('emp-name').value,
    dailyWage: parseInt(document.getElementById('daily-wage').value),
    payments: []
  };
  businessData.employees.push(employee);
  updateEmployeeDisplay();
}

function updateEmployeeDisplay() {
  const tbody = document.getElementById('employee-list');
  tbody.innerHTML = '';
  businessData.employees.forEach((emp, index) => {
    const totalPaid = emp.payments.reduce((sum, payment) => sum + payment.amount, 0);
    const row = `
      <tr>
        <td>${emp.name}</td>
        <td>${emp.dailyWage}</td>
        <td>${totalPaid}</td>
        <td>
          <button onclick="payEmployee(${index})">Pay Today</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// ===== FINANCE REPORTS =====
function showReport(type) {
  const reportDiv = document.getElementById('report-data');
  let html = `<h3>${type.charAt(0).toUpperCase() + type.slice(1)} Report</h3>`;
  
  // Add financial calculations here
  html += `
    <p>Total Sales: ₹${calculateTotalSales(type)}</p>
    <p>Total Expenses: ₹${calculateTotalExpenses(type)}</p>
    <p>Net Profit: ₹${calculateTotalSales(type) - calculateTotalExpenses(type)}</p>
  `;
  
  reportDiv.innerHTML = html;
}

// ===== TAILOR BOOKING SYSTEM =====
function addBooking() {
  const booking = {
    date: document.getElementById('booking-date').value,
    customer: document.getElementById('customer-name').value,
    status: "Pending"
  };
  businessData.bookings.push(booking);
  updateBookingsDisplay();
}

// ===== CHAT SYSTEM =====
function sendMessage() {
  const message = document.getElementById('message-input').value;
  businessData.messages.push({
    text: message,
    timestamp: new Date().toLocaleTimeString()
  });
  updateChatDisplay();
}

function updateChatDisplay() {
  const chatDiv = document.getElementById('chat-messages');
  chatDiv.innerHTML = businessData.messages.map(msg => `
    <div class="message">
      <span class="time">[${msg.timestamp}]</span>
      ${msg.text}
    </div>
  `).join('');
}

// ===== UTILITY FUNCTIONS =====
function calculateTotalSales(period) {
  // Implement date filtering based on period
  return businessData.sales.reduce((sum, sale) => sum + sale.amount, 0);
}

function calculateTotalExpenses(period) {
  // Implement date filtering
  return businessData.employees.reduce((sum, emp) => 
    sum + emp.payments.reduce((eSum, payment) => eSum + payment.amount, 0), 0);
}

// Initialize all displays
updateStockDisplay();
updateEmployeeDisplay();
updateChatDisplay();// Ripple effect for buttons
document.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', function(e) {
    let ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.background = 'rgba(255, 255, 255, 0.5)';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.pointerEvents = 'none';
    ripple.style.left = e.clientX - this.offsetLeft + 'px';
    ripple.style.top = e.clientY - this.offsetTop + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});

// Smooth section transitions
function showSection(sectionId) {
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    section.classList.remove('active');
    section.style.transition = 'opacity 0.3s ease-in-out';
    section.style.opacity = '0';
  });

  const activeSection = document.getElementById(sectionId);
  activeSection.classList.add('active');
  activeSection.style.transition = 'opacity 0.3s ease-in-out';
  activeSection.style.opacity = '1';
}

// Floating Action Button (FAB)
const fab = document.createElement('div');
fab.className = 'fab';
fab.innerHTML = `<button class="fab-btn">+</button>`;
document.body.appendChild(fab);

fab.addEventListener('click', function() {
  alert('FAB clicked!');
  // You can add your custom functionality for the FAB here (e.g., opening the cart or login modal)
});

// Scroll to Top Button
const scrollToTopBtn = document.createElement('div');
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.innerHTML = `<button>↑</button>`;
document.body.appendChild(scrollToTopBtn);

scrollToTopBtn.addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Show/hide the Scroll to Top button based on scroll position
window.addEventListener('scroll', function() {
  if (window.scrollY > 300) {
    scrollToTopBtn.style.display = 'block';
  } else {
    scrollToTopBtn.style.display = 'none';
  }
});// Countdown Timer (e.g., for a special offer)
function startCountdown(endDate) {
  const countdown = document.getElementById('countdown');
  const interval = setInterval(() => {
    const now = new Date();
    const remainingTime = endDate - now;
    
    if (remainingTime <= 0) {
      clearInterval(interval);
      countdown.innerHTML = 'Offer Expired!';
      return;
    }
    
    const hours = Math.floor(remainingTime / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
    
    countdown.innerHTML = `${hours}h ${minutes}m ${seconds}s`;
  }, 1000);
}

// Usage: 
const offerEndDate = new Date(new Date().getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
startCountdown(offerEndDate);// Scroll event listener for animation
window.addEventListener('scroll', function() {
  const sections = document.querySelectorAll('.animate-on-scroll');
  sections.forEach(section => {
    if (isInViewport(section)) {
      section.classList.add('visible');
    } else {
      section.classList.remove('visible');
    }
  });
});

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return rect.top >= 0 && rect.bottom <= window.innerHeight;
// Add to Cart with animation
function addToCart(productName, price) {
  cart.push({ productName, price });
  updateCartCount();
  animateCart();
  alert(`Added to Cart: ${productName} - Rs. ${price}`);
}

function animateCart() {
  const cartIcon = document.getElementById('cart-icon');
  cartIcon.classList.add('cart-animation');
  setTimeout(() => cartIcon.classList.remove('cart-animation'), 500);
}function openModal() {
  const modal = document.getElementById('modal');
  modal.style.transform = 'translateX(0)';
  modal.style.opacity = '1';
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.transform = 'translateX(100%)';
  modal.style.opacity = '0';
}// Add a product dynamically to the product list
function addProductToDisplay(productName, productPrice, productImage) {
  const productList = document.getElementById('product-list');
  const productCard = document.createElement('div');
  productCard.classList.add('product-card');

  productCard.innerHTML = `
    <img src="${productImage}" alt="${productName}" class="product-image">
    <h4 class="product-name">${productName}</h4>
    <p class="product-price">₹${productPrice}</p>
    <button onclick="addToCart('${productName}', ${productPrice})">Add to Cart</button>
  `;
  
  productList.appendChild(productCard);

  