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

  const API_URL = `https://api.twelvedata.com/exchanges?type=stock&apikey=${API_KEY}`;
  fetch(API_URL)
    .then(res => {
        if(!res.ok) {
            throw new Error('Erro ao buscar dados da API');
        }
        return res.json();
    })
    .then(data => {
        console.log(data);
    });

    const buttons = document.querySelectorAll('.btn'); // Seleciona todos os botões com a classe 'btn'
    
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove a classe 'selecionado' de todos os botões
            buttons.forEach(btn => btn.classList.remove('selecionado'));

            // Adiciona a classe 'selecionado' ao botão clicado
            this.classList.add('selecionado');
        });
    });


    
});