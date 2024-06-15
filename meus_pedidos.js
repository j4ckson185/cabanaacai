document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('order-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const phoneNumber = document.getElementById('phone-number').value;
        loadCustomerOrders(phoneNumber);
    });
});

function loadCustomerOrders(phoneNumber) {
    const orders = JSON.parse(localStorage.getItem('pedidos')) || [];
    const orderList = document.getElementById('order-list');
    orderList.innerHTML = '';

    const customerOrders = orders.filter(order => order.telefone === phoneNumber);
    
    if (customerOrders.length > 0) {
        customerOrders.forEach((order, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>Pedido ${index + 1}</strong>
                <p>Cliente: ${order.nome}</p>
                <p>Endereço: ${order.endereco}</p>
                <p>Telefone: ${order.telefone}</p>
                <p>Email: ${order.email}</p>
                <p>Método de Pagamento: ${order.metodoPagamento}</p>
                <p>Total: ${order.total}</p>
                <p class="order-status ${getStatusClass(order.status)}">Status: ${order.status}</p>
                <p>Itens:</p>
                <ul>
                    ${order.itens.map(item => `
                        <li>
                            <strong>${item.nome}</strong>
                            <ul>
                                ${item.sabores.map(sabor => `<li>Sabor: ${sabor}</li>`).join('')}
                                ${item.acompanhamentos.map(acompanhamento => `<li>Acompanhamento: ${acompanhamento}</li>`).join('')}
                                ${item.extras.map(extra => `<li>Extra: ${extra}</li>`).join('')}
                            </ul>
                        </li>
                    `).join('')}
                </ul>
            `;
            orderList.appendChild(li);
        });
    } else {
        orderList.innerHTML = '<li>Nenhum pedido encontrado para este número de telefone. Digite o número com DDD, ex: 84988205566 ou da mesma forma que você digitou na página de pagamento.</li>';
    }
}

function getStatusClass(status) {
    switch (status) {
        case 'Pendente':
            return 'status-pendente';
        case 'Em produção':
            return 'status-em-producao';
        case 'Saiu para entrega':
            return 'status-saiu-para-entrega';
        case 'Cancelado':
            return 'status-cancelado';
        default:
            return '';
    }
}

