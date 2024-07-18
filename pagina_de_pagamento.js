// Função para enviar o pedido pelo WhatsApp
function enviarPedidoWhatsApp() {
    const nomeSobrenome = document.getElementById('nome-sobrenome').value;
    const cep = document.getElementById('cep').value;
    const endereco = document.getElementById('endereco').value;
    const numero = document.getElementById('numero').value;
    const complemento = document.getElementById('complemento').value;
    const telefone = document.getElementById('telefone').value;
    const metodoPagamento = document.querySelector('input[name="payment-method"]:checked').value;
    const troco = document.getElementById('troco').value;
    const carrinho = JSON.parse(sessionStorage.getItem('carrinho')) || [];

    let message = `*Pedido Cabana Açaí*\n\n`;
    message += `*Nome:* ${nomeSobrenome}\n`;
    message += `*CEP:* ${cep}\n`;
    message += `*Endereço:* ${endereco}, ${numero}\n`;
    if (complemento) {
        message += `*Complemento:* ${complemento}\n`;
    }
    message += `*Telefone:* ${telefone}\n\n`;

    message += `*Método de Pagamento:* ${metodoPagamento}\n`;
    if (metodoPagamento === 'dinheiro' && troco) {
        message += `*Troco para:* ${troco}\n`;
    }

    message += `\n*Detalhes do Pedido:*\n`;
    carrinho.forEach(item => {
        let itemDetails = `-${item.nome}: R$ ${parseFloat(item.preco).toFixed(2)}\n`;
        if (item.sabores1 && item.sabores2) {
            itemDetails += `  Sabores (Açaí 1): ${item.sabores1.join(', ')}\n`;
            itemDetails += `  Sabores (Açaí 2): ${item.sabores2.join(', ')}\n`;
            itemDetails += `  Acompanhamentos (Açaí 1): ${item.acompanhamentos1.join(', ')}\n`;
            itemDetails += `  Acompanhamentos (Açaí 2): ${item.acompanhamentos2.join(', ')}\n`;
            itemDetails += `  Itens Extras (Açaí 1): ${item.extras1.join(', ')}\n`;
            itemDetails += `  Itens Extras (Açaí 2): ${item.extras2.join(', ')}\n`;
        } else {
            itemDetails += `  Sabores: ${item.sabores ? item.sabores.join(', ') : item.sabores1.join(', ')}\n`;
            itemDetails += `  Acompanhamentos: ${item.acompanhamentos ? item.acompanhamentos.join(', ') : item.acompanhamentos1.join(', ')}\n`;
            itemDetails += `  Itens Extras: ${item.extras ? item.extras.join(', ') : item.extras1.join(', ')}\n`;
        }
        message += itemDetails;
    });

    const subtotalValue = carrinho.reduce((total, item) => total + parseFloat(item.preco), 0);
    const totalPedido = subtotalValue + 3; // Total do pedido considerando taxa de entrega
    message += `\n*Taxa de Entrega:* R$ 3,00\n`;
    message += `*Total do Pedido:* R$ ${totalPedido.toFixed(2)}`;

    // Salvar o pedido no Firestore
    db.collection("orders").add({
        nomeSobrenome: nomeSobrenome,
        cep: cep,
        endereco: endereco,
        numero: numero,
        complemento: complemento,
        telefone: telefone,
        metodoPagamento: metodoPagamento,
        troco: troco,
        itens: carrinho,
        subtotal: subtotalValue.toFixed(2),
        total: totalPedido.toFixed(2),
        status: "Pendente",
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then((docRef) => {
        console.log("Pedido salvo com ID: ", docRef.id);
        // Redirecionar para WhatsApp após salvar o pedido
        const whatsappLink = `https://wa.me/5584988731028?text=${encodeURIComponent(message)}`;
        window.open(whatsappLink, '_blank');
    }).catch((error) => {
        console.error("Erro ao salvar pedido: ", error);
    });
}
