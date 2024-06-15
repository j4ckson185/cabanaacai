document.addEventListener('DOMContentLoaded', () => {
    // Carregar produtos e categorias ao iniciar
    loadProducts();
    loadCategories();

    // Manipulação de formulários
    document.getElementById('product-form').addEventListener('submit', saveProduct);
    document.getElementById('category-form').addEventListener('submit', saveCategory);
});

// Função para mostrar seções
function showSection(sectionId) {
    document.querySelectorAll('.admin-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

function loadProducts() {
    // Carregar produtos do servidor ou local storage
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
    console.log('Função loadOrders chamada');
    const orderList = document.getElementById('order-list');
    orderList.innerHTML = '';

    db.collection("orders").orderBy("timestamp", "desc").get().then((querySnapshot) => {
        console.log("Pedidos recebidos do Firestore: ", querySnapshot.size);
        querySnapshot.forEach((doc) => {
            const order = doc.data();
            console.log("Pedido:", order);
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>Pedido ${doc.id}</strong>
                <p>Cliente: ${order.nomeSobrenome}</p>
                <p>Endereço: ${order.endereco}</p>
                <p>Telefone: ${order.telefone}</p>
                <p>Email: ${order.email}</p>
                <p>Método de Pagamento: ${order.metodoPagamento}</p>
                <p>Total: ${order.total}</p>
                <p>Status: ${order.status}</p>
                <p>Data e Hora: ${order.timestamp ? order.timestamp.toDate().toLocaleString() : 'N/A'}</p>
                <button onclick="updateOrderStatus('${doc.id}', '${order.status}')">Atualizar Status</button>
            `;
            orderList.appendChild(li);
        });
    }).catch((error) => {
        console.error("Erro ao carregar pedidos do Firestore: ", error);
    });
}

function updateOrderStatus(orderId, currentStatus) {
    const newStatus = prompt('Digite o novo status do pedido:', currentStatus);
    if (newStatus) {
        db.collection("orders").doc(orderId).update({
            status: newStatus
        }).then(() => {
            console.log('Status do pedido atualizado');
            loadOrders();
        }).catch((error) => {
            console.error('Erro ao atualizar status do pedido:', error);
        });
    }
}

function generateReport(type) {
    // Função para gerar relatórios
    alert(`Gerando relatório ${type}`);
}
