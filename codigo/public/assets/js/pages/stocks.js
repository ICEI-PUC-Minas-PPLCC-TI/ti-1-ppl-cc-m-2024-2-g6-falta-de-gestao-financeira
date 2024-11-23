import { logoutButton } from "../components/logout-button.js";
import { auth } from "../lib/auth.js";
import { API_KEY } from "../lib/env.js";

const user = auth();

if (!user) {
  window.location.replace("./login.html");
}

logoutButton();

document.addEventListener("DOMContentLoaded", async () => {
    const loggedInUser = auth();
    if (!loggedInUser) {
        window.location.replace("/login.html");
        return;
    }

    // Declarar a variável API_URL
    const API_URL = `https://api.twelvedata.com/quote?symbol=AAPL,MSFT,NVDA,AMD,TSLA&apikey=${API_KEY}`;

    // Fazer a requisição à API
    fetch(API_URL)
    .then(res => {
        if (!res.ok) {
            throw new Error('Erro ao buscar dados da API');
        }
        return res.json();
    })
    .then(response => {
        const cardBody = document.querySelector('.card-body');
        if (!cardBody) {
            throw new Error('Elemento card-body não encontrado');
        }

        const acoes = Object.entries(response);

        acoes.forEach(([symbol, acao]) => {
            // Formata os números para 2 casas decimais e adiciona separador de milhar
            const precoFormatado = parseFloat(acao.close).toLocaleString('pt-BR', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
            });
            
            // Formata o volume para ser mais legível
            const volumeFormatado = parseInt(acao.volume).toLocaleString('pt-BR');

            const cardAcao = document.createElement('div');
            cardAcao.className = 'card mb-3';
            
            cardAcao.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${acao.name}</h5>
                    <p class="card-text">
                        <strong>Símbolo:</strong> ${acao.symbol}<br>
                        <strong>Preço Atual:</strong> $ ${precoFormatado}<br>
                        <strong>Volume Negociado:</strong> ${volumeFormatado} ações<br>
                        <strong>Variação do Dia:</strong> $ ${acao.low} - $ ${acao.high}
                    </p>
                </div>
            `;

            cardBody.appendChild(cardAcao);
        });
    })
    .catch(error => {
        console.error('Erro:', error);
        const cardBody = document.querySelector('.card-body');
        if (cardBody) {
            cardBody.innerHTML = `
                <div class="alert alert-danger">
                    Desculpe, não foi possível carregar os dados no momento. Tente novamente mais tarde.
                </div>
            `;
        }
    });
});