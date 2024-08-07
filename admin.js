document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
    loadProducts();
    loadCategories();

    document.getElementById('product-form').addEventListener('submit', saveProduct);
    document.getElementById('category-form').addEventListener('submit', saveCategory);
});

function showSection(sectionId) {
    document.querySelectorAll('.admin-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    products.forEach((product, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${product.name}</strong>
            <p>${product.description}</p>
            <p>Preço: R$ ${product.price.toFixed(2)}</p>
            <button onclick="editProduct(${index})">Editar</button>
            <button onclick="deleteProduct(${index})">Excluir</button>
        `;
        productList.appendChild(li);
    });
}

function saveProduct(event) {
    event.preventDefault();
    const id = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const category = document.getElementById('product-category').value;

    const product = { name, description, price, category };

    let products = JSON.parse(localStorage.getItem('products')) || [];
    if (id) {
        products[parseInt(id)] = product;
    } else {
        products.push(product);
    }
    localStorage.setItem('products', JSON.stringify(products));

    loadProducts();
    document.getElementById('product-form').reset();
}

function editProduct(index) {
    const products = JSON.parse(localStorage.getItem('products'));
    const product = products[index];
    document.getElementById('product-id').value = index;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-category').value = product.category;
    showSection('manage-products');
}

function deleteProduct(index) {
    let products = JSON.parse(localStorage.getItem('products'));
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
    loadProducts();
}

function loadCategories() {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const categoryList = document.getElementById('category-list');
    const categorySelect = document.getElementById('product-category');
    categoryList.innerHTML = '';
    categorySelect.innerHTML = '';
    categories.forEach((category, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${category.name}</strong>
            <button onclick="editCategory(${index})">Editar</button>
            <button onclick="deleteCategory(${index})">Excluir</button>
        `;
        categoryList.appendChild(li);
        const option = document.createElement('option');
        option.value = category.name;
        option.text = category.name;
        categorySelect.add(option);
    });
}

function saveCategory(event) {
    event.preventDefault();
    const id = document.getElementById('category-id').value;
    const name = document.getElementById('category-name').value;
    
    const category = { name };

    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    if (id) {
        categories[parseInt(id)] = category;
    } else {
        categories.push(category);
    }
    localStorage.setItem('categories', JSON.stringify(categories));

    loadCategories();
    document.getElementById('category-form').reset();
}

function editCategory(index) {
    const categories = JSON.parse(localStorage.getItem('categories'));
    const category = categories[index];
    document.getElementById('category-id').value = index;
    document.getElementById('category-name').value = category.name;
    showSection('manage-categories');
}

function deleteCategory(index) {
    let categories = JSON.parse(localStorage.getItem('categories'));
    categories.splice(index, 1);
    localStorage.setItem('categories', JSON.stringify(categories));
    loadCategories();
}

function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderList = document.getElementById('order-list');
    orderList.innerHTML = '';

    orders.forEach((order, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>Pedido ${index + 1}</strong>
            <p>Cliente: ${order.nome}</p>
            <p>Endereço: ${order.endereco}</p>
            <p>Telefone: ${order.telefone}</p>
            <p>Email: ${order.email}</p>
            <p>Método de Pagamento: ${order.metodoPagamento}</p>
            <p>Total: ${order.total}</p>
            <p>Status: ${order.status}</p>
            <button onclick="updateOrderStatus(${index})">Atualizar Status</button>
        `;
        orderList.appendChild(li);
    });
}

function updateOrderStatus(index) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const newStatus = prompt('Digite o novo status do pedido:', orders[index].status);
    if (newStatus) {
        orders[index].status = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
        loadOrders();
    }
}

function generateReport(type) {
    alert(`Gerando relatório ${type}`);
}
