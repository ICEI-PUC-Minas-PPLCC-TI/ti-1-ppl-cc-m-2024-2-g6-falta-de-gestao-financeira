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
    const API_URL = `https://api.twelvedata.com/exchanges?type=stock&apikey=${API_KEY}`;

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

            const acoes = response.data.slice(0, 5);

            acoes.forEach(acao => {
                const cardAcao = document.createElement('div');
                cardAcao.className = 'card mb-3';
                
                cardAcao.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">${acao.name}</h5>
                        <p class="card-text">
                            <strong>Código:</strong> ${acao.code}<br>
                            <strong>País:</strong> ${acao.country}
                        </p>
                    </div>
                `;

                cardBody.appendChild(cardAcao);
            });
        })
        .catch(error => {
            console.error('Erro:', error);
        });
});