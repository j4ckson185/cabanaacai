// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB-pF2lRStLTN9Xw9aYQj962qdNFyUXI2E",
    authDomain: "cabana-8d55e.firebaseapp.com",
    databaseURL: "https://cabana-8d55e-default-rtdb.firebaseio.com",
    projectId: "cabana-8d55e",
    storageBucket: "cabana-8d55e.appspot.com",
    messagingSenderId: "706144237954",
    appId: "1:706144237954:web:345c10370972486afc779b",
    measurementId: "G-96Y337GYT8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function() {
    updateOrderSummary();

    // Eventos de mudança nos métodos de pagamento
    const paymentMethodRadios = document.querySelectorAll('input[name="payment-method"]');
    const trocoSection = document.getElementById('troco-section');
    const pixInfo = document.getElementById('pix-info');

    paymentMethodRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'dinheiro') {
                trocoSection.style.display = 'block';
                pixInfo.style.display = 'none';
            } else if (radio.value === 'pix') {
                trocoSection.style.display = 'none';
                pixInfo.style.display = 'block';
            } else {
                trocoSection.style.display = 'none';
                pixInfo.style.display = 'none';
            }
        });
    });
});

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function updateOrderSummary() {
    const subtotal = document.getElementById('subtotal');
    const total = document.getElementById('total');

    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    let subtotalValue = 0;
    carrinho.forEach(item => {
        let valorProduto = parseFloat(item.preco) || 0;
        const extras1 = item.extras1 || [];
        const extras2 = item.extras2 || [];
        const allExtras = extras1.concat(extras2);
        allExtras.forEach(extra => {
            valorProduto += parseFloat(extra.match(/\+R\$([0-9,]+)/)[1].replace(',', '.'));
        });
        subtotalValue += valorProduto;
    });

    subtotal.textContent = formatarMoeda(subtotalValue);
    total.textContent = formatarMoeda(subtotalValue + 3);
}

async function enviarPedidoWhatsApp() {
    const nomeSobrenome = document.getElementById('nome-sobrenome').value;
    const cep = document.getElementById('cep').value;
    const endereco = document.getElementById('endereco').value;
    const numero = document.getElementById('numero').value;
    const complemento = document.getElementById('complemento').value;
    const telefone = document.getElementById('telefone').value;
    const metodoPagamento = document.querySelector('input[name="payment-method"]:checked').value;
    const troco = document.getElementById('troco').value;
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

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

    const subtotal = document.getElementById('subtotal').textContent;
    const totalPedido = parseFloat(subtotal.replace('R$', '').replace(',', '.')) + 3;
    message += `\n*Taxa de Entrega:* R$ 3,00\n`;
    message += `*Total do Pedido:* ${formatarMoeda(totalPedido)}`;

    const whatsappLink = `https://wa.me/5584986468750?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');

    // Salvar o pedido no Firestore
    try {
        await db.collection("orders").add({
            nomeSobrenome,
            cep,
            endereco,
            numero,
            complemento,
            telefone,
            metodoPagamento,
            troco,
            carrinho,
            total: formatarMoeda(totalPedido),
            status: "Pendente",
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log("Pedido salvo no Firestore com sucesso!");
    } catch (error) {
        console.error("Erro ao salvar pedido no Firestore:", error);
    }
}

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
