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
    // Função para exibir ou ocultar a seção de troco
    document.querySelectorAll('input[name="payment-method"]').forEach((radio) => {
        radio.addEventListener('change', function() {
            const trocoSection = document.getElementById('troco-section');
            if (this.value === 'dinheiro') {
                trocoSection.style.display = 'block';
            } else {
                trocoSection.style.display = 'none';
            }
        });
    });

    // Função para formatar o valor como moeda
    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // Função para enviar os dados do formulário via WhatsApp e salvar no Firestore
    document.getElementById('formulario-pagamento').addEventListener('submit', function(event) {
        event.preventDefault();
        const nomeSobrenome = document.getElementById('nome-sobrenome').value;
        const endereco = document.getElementById('endereco').value;
        const telefone = document.getElementById('telefone').value;
        const email = document.getElementById('email').value;
        const metodoPagamento = document.querySelector('input[name="payment-method"]:checked').value;
        const troco = document.getElementById('troco').value;

        // Obtém os itens do carrinho
        const carrinho = JSON.parse(sessionStorage.getItem('carrinho')) || [];
        let mensagemCarrinho = "*Itens do Pedido:*\n";
        let total = 0;
        carrinho.forEach(item => {
            let valorProduto = parseFloat(item.preco);
            total += valorProduto;

            mensagemCarrinho += `\n*${item.nome} - ${formatarMoeda(valorProduto)}*\n`;
            mensagemCarrinho += "Sabores:\n";
            item.sabores.forEach(sabor => {
                mensagemCarrinho += `- ${sabor}\n`;
            });
            mensagemCarrinho += "Acompanhamentos:\n";
            item.acompanhamentos.forEach(acompanhamento => {
                mensagemCarrinho += `- ${acompanhamento}\n`;
            });
            mensagemCarrinho += "Itens Extras:\n";
            item.extras.forEach(extra => {
                mensagemCarrinho += `- ${extra}\n`;
            });
        });

        let mensagem = `*Pedido Cabana Açaí*\n\n*Nome:* ${nomeSobrenome}\n*Endereço:* ${endereco}\n*Telefone:* ${telefone}\n*Email:* ${email}\n*Método de Pagamento:* ${metodoPagamento}\n${mensagemCarrinho}\n*Total do Pedido: ${formatarMoeda(total)}*`;
        
        if (metodoPagamento === 'dinheiro' && troco) {
            mensagem += `\n*Troco para:* ${troco}`;
        }

        console.log('Enviando pedido pelo WhatsApp:');
        console.log(mensagem);

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
        window.open(whatsappUrl, '_blank');

        // Salvar o pedido no Firestore
        db.collection("orders").add({
            nomeSobrenome: nomeSobrenome,
            endereco: endereco,
            telefone: telefone,
            email: email,
            metodoPagamento: metodoPagamento,
            troco: troco,
            itens: carrinho,
            total: formatarMoeda(total),
            status: "Pendente",
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then((docRef) => {
            console.log("Pedido salvo com ID: ", docRef.id);
        }).catch((error) => {
            console.error("Erro ao salvar pedido: ", error);
        });
    });
});
