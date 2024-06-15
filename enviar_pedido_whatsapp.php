<?php
// Dados do pedido enviados via POST
$nome = $_POST['nome-sobrenome'];
$endereco = $_POST['rua'] . ', ' . $_POST['numero'];
$whatsapp = $_POST['whatsapp'];
// Mais dados do pedido...

// Mensagem a ser enviada para o WhatsApp
$mensagem = "Novo pedido recebido:\n\n";
$mensagem .= "Nome: $nome\n";
$mensagem .= "Endereço: $endereco\n";
$mensagem .= "WhatsApp: $whatsapp\n";
// Adicione mais informações do pedido à mensagem...

// Número de telefone do WhatsApp para enviar a mensagem
$numero_whatsapp = '84988731028';

// Função para enviar a mensagem para o WhatsApp
function enviarMensagemParaWhatsApp($mensagem, $numero) {
    // Aqui você implementa a lógica para enviar a mensagem via WhatsApp
    // Por exemplo, você pode usar a biblioteca Twilio WhatsApp API ou uma API de WhatsApp de terceiros
}

// Chama a função para enviar a mensagem
enviarMensagemParaWhatsApp($mensagem, $numero_whatsapp);
