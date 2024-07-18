document.addEventListener('DOMContentLoaded', () => {
    // Carregar produtos e categorias ao iniciar
    loadProducts();
    loadCategories();

    // Manipulação de formulários
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
    db.collection('products').get().then((querySnapshot) => {
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const product = doc.data();
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${product.name}</strong>
                <p>${product.description}</p>
                <p>Preço: R$ ${product.price.toFixed(2)}</p>
                <button onclick="editProduct('${doc.id}')">Editar</button>
                <button onclick="deleteProduct('${doc.id}')">Excluir</button>
            `;
            productList.appendChild(li);
        });
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

    if (id) {
        db.collection('products').doc(id).update(product).then(() => {
            loadProducts();
            document.getElementById('product-form').reset();
        });
    } else {
        db.collection('products').add(product).then(() => {
            loadProducts();
            document.getElementById('product-form').reset();
        });
    }
}

function editProduct(id) {
    db.collection('products').doc(id).get().then((doc) => {
        if (doc.exists) {
            const product = doc.data();
            document.getElementById('product-id').value = id;
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-description').value = product.description;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-category').value = product.category;
            showSection('manage-products');
        }
    });
}

function deleteProduct(id) {
    db.collection('products').doc(id).delete().then(() => {
        loadProducts();
    });
}

function loadCategories() {
    db.collection('categories').get().then((querySnapshot) => {
        const categoryList = document.getElementById('category-list');
        const categorySelect = document.getElementById('product-category');
        categoryList.innerHTML = '';
        categorySelect.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const category = doc.data();
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${category.name}</strong>
                <button onclick="editCategory('${doc.id}')">Editar</button>
                <button onclick="deleteCategory('${doc.id}')">Excluir</button>
            `;
            categoryList.appendChild(li);
            const option = document.createElement('option');
            option.value = category.name;
            option.text = category.name;
            categorySelect.add(option);
        });
    });
}

function saveCategory(event) {
    event.preventDefault();
    const id = document.getElementById('category-id').value;
    const name = document.getElementById('category-name').value;
    
    const category = { name };

    if (id) {
        db.collection('categories').doc(id).update(category).then(() => {
            loadCategories();
            document.getElementById('category-form').reset();
        });
    } else {
        db.collection('categories').add(category).then(() => {
            loadCategories();
            document.getElementById('category-form').reset();
        });
    }
}

function editCategory(id) {
    db.collection('categories').doc(id).get().then((doc) => {
        if (doc.exists) {
            const category = doc.data();
            document.getElementById('category-id').value = id;
            document.getElementById('category-name').value = category.name;
            showSection('manage-categories');
        }
    });
}

function deleteCategory(id) {
    db.collection('categories').doc(id).delete().then(() => {
        loadCategories();
    });
}

function loadOrders() {
    console.log('Função loadOrders chamada');
    const orderList = document.getElementById('order-list');
    orderList.innerHTML = '';

    db.collection("orders").orderBy("timestamp", "desc").onSnapshot((querySnapshot) => {
        console.log("Pedidos recebidos do Firestore: ", querySnapshot.size);
        orderList.innerHTML = ''; // Limpa a lista antes de atualizar
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

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadOrders();
    loadCategories();
});
