import { logoutButton } from "../components/logout-button.js";
import { auth } from "../lib/auth.js";
import { API_KEY } from "../lib/env.js";

const user = auth();

if (!user) {
  window.location.replace("./login.html");
}

logoutButton();

const API_URL = `https://api.twelvedata.com/quote?symbol=AAPL,MSFT,NVDA,AMD,TSLA&apikey=${API_KEY}`;

// Função para fazer fetch com retry
async function fetchWithRetry(url, maxRetries = 3) {
    const cardBody = document.querySelector('.card-body');
    
    // Mostrar loading
    cardBody.innerHTML = `
        <div class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
            <p class="mt-2">Carregando dados das ações...</p>
        </div>
    `;

    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Erro na resposta da API');
            }
            const data = await response.json();
            
            // Verificar se os dados são válidos
            if (!data || Object.keys(data).length === 0) {
                throw new Error('Dados não encontrados');
            }
            
            return data;
        } catch (error) {
            console.error(`Tentativa ${i + 1} falhou:`, error);
            if (i === maxRetries - 1) {
                throw error; // Se foi a última tentativa, propaga o erro
            }
            // Espera um tempo antes de tentar novamente (aumenta progressivamente)
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const loggedInUser = auth();
    if (!loggedInUser) {
        window.location.replace("/login.html");
        return;
    }

    try {
        const response = await fetchWithRetry(API_URL);
        const cardBody = document.querySelector('.card-body');
        
        if (!cardBody) {
            throw new Error('Elemento card-body não encontrado');
        }

        // Limpa o loading
        cardBody.innerHTML = '';

        const acoes = Object.entries(response);

        acoes.forEach(([symbol, acao]) => {
            if (!acao || !acao.close) {
                console.warn(`Dados incompletos para ${symbol}`, acao);
                return;
            }

            const precoFormatado = parseFloat(acao.close || 0).toLocaleString('pt-BR', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
            });
            
            const volumeFormatado = parseInt(acao.volume || 0).toLocaleString('pt-BR');

            // Calcula a variação
            const variacao = parseFloat(acao.close) - parseFloat(acao.open);
            const variacaoPercentual = (variacao / parseFloat(acao.open) * 100).toFixed(2);
            const corVariacao = variacao >= 0 ? 'text-success' : 'text-danger';
            const simboloVariacao = variacao >= 0 ? '▲' : '▼';

            const cardAcao = document.createElement('div');
            cardAcao.className = 'card mb-3';
            
            cardAcao.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${acao.name || symbol}</h5>
                    <p class="card-text">
                        <strong>Símbolo:</strong> ${acao.symbol || symbol}<br>
                        <strong>Preço Atual:</strong> $ ${precoFormatado}
                        <span class="${corVariacao}">
                            ${simboloVariacao} ${Math.abs(variacaoPercentual)}%
                        </span><br>
                        <strong>Volume Negociado:</strong> ${volumeFormatado} ações
                    </p>
                    <small class="text-muted">Última atualização: ${new Date().toLocaleTimeString()}</small>
                </div>
            `;

            cardBody.appendChild(cardAcao);
        });

        // Adiciona botão de atualização
        const refreshButton = document.createElement('button');
        refreshButton.className = 'btn btn-primary mt-3';
        refreshButton.innerHTML = 'Atualizar Dados';
        refreshButton.onclick = () => window.location.reload();
        cardBody.appendChild(refreshButton);

    } catch (error) {
        console.error('Erro:', error);
        const cardBody = document.querySelector('.card-body');
        if (cardBody) {
            cardBody.innerHTML = `
                <div class="alert alert-danger">
                    <p>Desculpe, não foi possível carregar os dados no momento.</p>
                    <p>Por favor, tente novamente em alguns instantes.</p>
                    <button class="btn btn-primary mt-2" onclick="window.location.reload()">
                        Tentar Novamente
                    </button>
                </div>
            `;
        }
    }
});