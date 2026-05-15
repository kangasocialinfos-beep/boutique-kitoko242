const productsContainer = document.getElementById("products");
const cartCount = document.querySelector(".cart-count");
const cartBtn = document.querySelector(".floating-cart-btn");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const clearCartBtn = document.getElementById("clearCartBtn");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutOverlay = document.getElementById("checkoutOverlay");
const closeCheckoutBtn = document.getElementById("closeCheckoutBtn");
const checkoutForm = document.getElementById("checkoutForm");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function clearCart() {
  cart = [];
  localStorage.removeItem("cart");
  updateCartUI();
  renderCart();
}

function openCheckout() {
  checkoutOverlay.classList.add("show");
}

function closeCheckout() {
  checkoutOverlay.classList.remove("show");
}

productsContainer.innerHTML = products.map((product) => `
  <article class="card">
    <img src="${product.image}" alt="${product.name}">
    <div class="card-body">
      <h2>${product.name}</h2>
      <p class="category">${product.category}</p>
      <p class="description">${product.description}</p>
      <p class="price">${product.price} FCFA</p>
      <button class="buy-btn" type="button"
        data-id="${product.id}"
        data-name="${product.name}"
        data-price="${product.price}"
        data-image="${product.image}">
        Ajouter au panier
      </button>
    </div>
  </article>
`).join("");

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

function renderCart() {
  cartItems.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart-state">
        <div class="empty-cart-icon">🛒</div>
        <p>Votre panier est vide.</p>
      </div>
    `;
    cartTotal.textContent = "0 FCFA";
    return;
  }

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    cartItems.innerHTML += `
  <div class="cart-item">
    <div class="cart-item-main">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">${item.price} FCFA</p>
      </div>
    </div>

    <div class="qty-control">
      <button type="button" class="qty-btn" data-action="decrease" data-index="${index}">-</button>
      <span class="qty-number">${item.quantity}</span>
      <button type="button" class="qty-btn" data-action="increase" data-index="${index}">+</button>
      <button type="button" class="qty-btn remove-btn" data-action="remove" data-index="${index}" aria-label="Supprimer">🗑️</button>
    </div>
  </div>
`;
  });

  cartTotal.textContent = `${total} FCFA`;
}

cartItems.addEventListener("click", (event) => {
  const btn = event.target.closest(".qty-btn");
  if (!btn) return;

  const index = Number(btn.dataset.index);
  const action = btn.dataset.action;

  if (action === "increase") {
    cart[index].quantity += 1;
  }

  if (action === "decrease") {
    cart[index].quantity -= 1;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
  }

  if (action === "remove") {
    cart.splice(index, 1);
  }

  updateCartUI();
  renderCart();
  saveCart();
});

function addItemToCart(product) {
  const existingIndex = cart.findIndex(item => item.id === product.id);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
  renderCart();
  saveCart();
  
cartBtn.classList.remove("pulse");
  void cartBtn.offsetWidth;
  cartBtn.classList.add("pulse");
}

function openCart() {
  cartPanel.classList.add("show");
  cartOverlay.classList.add("show");
}

function closeCartPanel() {
  cartPanel.classList.remove("show");
  cartOverlay.classList.remove("show");
}

productsContainer.addEventListener("click", (event) => {
  const btn = event.target.closest(".buy-btn");
  if (!btn) return;

  addItemToCart({
    id: btn.dataset.id,
    name: btn.dataset.name,
    price: Number(btn.dataset.price),
    image: btn.dataset.image
  });
});

cartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCartPanel);
cartOverlay.addEventListener("click", closeCartPanel);

clearCartBtn.addEventListener("click", clearCart);

checkoutBtn.addEventListener("click", openCheckout);
closeCheckoutBtn.addEventListener("click", closeCheckout);

checkoutOverlay.addEventListener("click", (event) => {
  if (event.target === checkoutOverlay) {
    closeCheckout();
  }
});

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nom = document.getElementById("nom").value.trim();
  const prenoms = document.getElementById("prenoms").value.trim();
  const numero = document.getElementById("numero").value.trim();

  if (!nom || !prenoms || !numero) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  const orderData = {
    nom,
    prenoms,
    numero,
    cart,
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  };
  
const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
const cartText = cart.map(item => `- ${item.name} x${item.quantity} = ${item.price * item.quantity} FCFA`)
.join("\n");

const message = `Salut

J’aimerais passer cette commande :

Nom: ${nom}
Prénoms: ${prenoms}
Numéro: ${numero}

Produits:
${cartText}

Total: ${total} FCFA`;

const phoneNumber = "242064991796";
const whatsappUrl = "https://wa.me/" + phoneNumber + "?text=" + encodeURIComponent(message);

const popup = document.getElementById("loadingOverlay");
popup.style.display = "flex";

setTimeout(() => {
  window.open(whatsappUrl, "_blank");
  popup.style.display = "none";
  checkoutForm.reset();
  closeCheckout();
}, 4500);
});

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const noResults = document.getElementById("noResults");


function searchProducts() {
  if (!searchInput) return;
  const query = searchInput.value.trim().toLowerCase();
  const cards = productsContainer.querySelectorAll(".card");

  cards.forEach((card) => {
    const title = card.querySelector(".card-body h2").textContent.toLowerCase();
    const category = card.querySelector(".category").textContent.toLowerCase();
    const description = card.querySelector(".description").textContent.toLowerCase();

    const match =
      title.includes(query) ||
      category.includes(query) ||
      description.includes(query);

    card.style.display = match ? "" : "none";
  });
  
  const visibleCards = [...cards].filter(card => card.style.display !== "none");

if (noResults) {
  noResults.style.display = visibleCards.length === 0 ? "block" : "none";
}
}

if (searchBtn && searchInput) {
  searchBtn.addEventListener("click", searchProducts);

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      searchProducts();
    }
  });

  searchInput.addEventListener("input", () => {
  if (searchInput.value.trim() === "") {
    productsContainer.querySelectorAll(".card").forEach((card) => {
      card.style.display = "";
    });

    if (noResults) {
      noResults.style.display = "none";
    }
  }
});
}

updateCartUI();
renderCart();