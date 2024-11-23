import { loginForm } from "../components/login-form.js";
import { auth } from "../lib/auth.js";

const user = auth();

if (!user) {
  window.location.replace("./login.html");
}


// Função para buscar os anos únicos das entradas
async function fetchUniqueYears() {
    try {
        // Fazer a requisição ao arquivo JSON
        const response = await fetch('/entries'); // Certifique-se de que o caminho esteja correto
        if (!response.ok) {
            throw new Error(`Erro ao buscar dados: ${response.statusText}`);
        }

        // Ler as entradas como JSON
        const entries = await response.json();


        // Extrair os anos únicos
        const uniqueYears = new Set();
        entries.forEach(entry => {
            const timestamp = parseInt(entry.date, 10);
            const year = new Date(timestamp).getFullYear();
            uniqueYears.add(year);
        });

        // Converter para um array e ordenar
        const yearsArray = Array.from(uniqueYears).sort((a, b) => a - b);

        // Retornar ou imprimir os anos únicos
        console.log('Anos únicos:', yearsArray);

        // Adicionar os botões ao HTML
        addYearButtons(yearsArray);

        return yearsArray;
    } catch (error) {
        console.error('Erro ao processar os dados:', error);
    }
}

// Função para adicionar botões ao HTML
function addYearButtons(years) {
    const yearRow = document.getElementById("yearSelection");
    yearRow.innerHTML = ""; // Limpa o conteúdo anterior

    // Para cada ano, adiciona um botão
    years.forEach(year => {
        yearRow.insertAdjacentHTML(
            "beforeend",
            `<button class="year-button" onclick="handleYearClick(${year})">${year}</button>`
        );
    });
}

// Função de exemplo para lidar com o clique do botão
function handleYearClick(year) {
    console.log(`Ano clicado: ${year}`);
}

// Chamar a função principal
fetchUniqueYears();