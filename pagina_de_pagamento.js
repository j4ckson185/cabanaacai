document.addEventListener('DOMContentLoaded', function() {
    // Carregar resumo do pedido
    updateOrderSummary();

    // Função para exibir ou ocultar a seção de troco
    document.querySelectorAll('input[name="payment-method"]').forEach((radio) => {
        radio.addEventListener('change', function() {
            const trocoSection = document.getElementById('troco-section');
            const pixInfo = document.getElementById('pix-info');
            if (this.value === 'dinheiro') {
                trocoSection.style.display = 'block';
                pixInfo.style.display = 'none';
            } else if (this.value === 'pix') {
                pixInfo.style.display = 'block';
                trocoSection.style.display = 'none';
            } else {
                trocoSection.style.display = 'none';
                pixInfo.style.display = 'none';
            }
        });
    });

    // Função para atualizar o resumo do pedido
    function updateOrderSummary() {
        const subtotalElement = document.getElementById('subtotal');
        const totalElement = document.getElementById('total');
        const carrinho = JSON.parse(sessionStorage.getItem('carrinho')) || [];

        let subtotal = 0;
        carrinho.forEach(item => {
            subtotal += parseFloat(item.preco);
        });

        subtotalElement.textContent = formatarMoeda(subtotal);
        totalElement.textContent = formatarMoeda(subtotal + 3);
    }

    // Função para formatar o valor como moeda
    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // Função para enviar o pedido pelo WhatsApp e salvar no Firestore
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
            let itemDetails = `-${item.nome}: ${formatarMoeda(item.preco)}\n`;
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
        message += `*Total do Pedido:* ${formatarMoeda(totalPedido)}`;

        const whatsappLink = `https://wa.me/5584988731028?text=${encodeURIComponent(message)}`;
        window.open(whatsappLink, '_blank');

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
            subtotal: formatarMoeda(subtotalValue),
            total: formatarMoeda(totalPedido),
            status: "Pendente",
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then((docRef) => {
            console.log("Pedido salvo com ID: ", docRef.id);
        }).catch((error) => {
            console.error("Erro ao salvar pedido: ", error);
        });
    }

    // Função para consultar o CEP automaticamente ao digitar
    async function consultarCep() {
        const cep = document.getElementById('cep').value;
        const resultadoCep = document.getElementById('resultado-cep');
        const cepFormatado = cep.replace(/\D/g, '');

        if (cepFormatado.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cepFormatado}/json/`);
                const data = await response.json();

                if (data.erro) {
                    resultadoCep.innerText = 'CEP não encontrado. Por favor, verifique o CEP informado.';
                } else {
                    resultadoCep.innerText = `Endereço: ${data.logradouro}, ${data.bairro} - ${data.localidade}/${data.uf}`;
                    document.getElementById('endereco').value = data.logradouro;
                }
            } catch (error) {
                console.error('Erro ao consultar CEP:', error);
                resultadoCep.innerText = 'Ocorreu um erro ao consultar o CEP. Por favor, tente novamente mais tarde.';
            }
        } else {
            resultadoCep.innerText = '';
        }
    }

    // Atualizar o resumo do pedido ao carregar a página
    updateOrderSummary();
});
