document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
    db.collection("orders").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
        loadOrders();
    });
});

function loadOrders() {
    const orderList = document.getElementById('order-list');
    orderList.innerHTML = '';

    db.collection("orders").orderBy("timestamp", "desc").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const order = doc.data();
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
