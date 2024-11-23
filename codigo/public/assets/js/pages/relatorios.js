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
        const response = await fetch(`/entries?ownerId=${user.id}`); // Certifique-se de que o caminho esteja correto
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

        // Adicionar o campo de seleção e o botão ao HTML
        addYearSelector(yearsArray);

        return yearsArray;
    } catch (error) {
        console.error('Erro ao processar os dados:', error);
    }
}

// Função para adicionar o campo de seleção e o botão ao HTML
function addYearSelector(years) {
    const yearRow = document.getElementById("yearSelection");
    yearRow.innerHTML = ""; // Limpa o conteúdo anterior

    // Criar o dropdown (select)
    const selectHTML = `
        <select id="yearDropdown" class="form-select">
            <option value="" disabled selected>Selecionar ano</option>
            ${years.map(year => `<option value="${year}">${year}</option>`).join('')}
        </select>
    `;

    // Criar o botão "Atualizar"
    const buttonHTML = `
        <button id="updateButton" class="btn btn-primary">Atualizar</button>
    `;

    // Adicionar o select e o botão ao HTML
    yearRow.insertAdjacentHTML("beforeend", `
        <div class="year-selector">
            ${selectHTML}
            ${buttonHTML}
        </div>
    `);

    // Adicionar o evento de clique ao botão
    const updateButton = document.getElementById("updateButton");
    updateButton.addEventListener("click", handleYearSelection);
}

// Função para lidar com a seleção do ano
function handleYearSelection() {
    const yearDropdown = document.getElementById("yearDropdown");
    const selectedYear = yearDropdown.value;

    if (selectedYear) {
        console.log(`Ano selecionado: ${selectedYear}`);
        // Aqui você pode chamar a lógica de busca com base no ano selecionado
    } else {
        alert("Por favor, selecione um ano.");
    }
}

// Chamar a função principal
fetchUniqueYears();
