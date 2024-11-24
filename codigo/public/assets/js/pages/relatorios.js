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
    const yearRow = document.getElementById("yearDropdown");

    // Criar o dropdown (select)
    const selectHTML = `
            ${years.map(year => `<option value="${year}">${year}</option>`).join('')}
    `;


    // Adicionar o select e o botão ao HTML
    yearRow.insertAdjacentHTML("beforeend", `${selectHTML}`);

    // Adicionar o evento de clique ao botão
    const updateButton = document.getElementById("updateButton");
    updateButton.addEventListener("click", handleYearSelection);
}

// Função para lidar com a seleção do ano
async function handleYearSelection() {
    const yearDropdown = document.getElementById("yearDropdown");
    const selectedYear = yearDropdown.value;

    if (selectedYear) {
        console.log(`Ano selecionado: ${selectedYear}`);
        
        await calcularDados(selectedYear);
        criarDashboardAnual(selectedYear);
    } else {
        alert("Por favor, selecione um ano.");
    }
}

async function calcularDados(selectedYear) {
    try {
        // Buscar as entradas do usuário logado
        const response = await fetch(`/entries?ownerId=${user.id}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar entradas: ${response.statusText}`);
        }

        const entries = await response.json();

        const filteredEntries = entries.filter(entry => {
            const timestamp = parseInt(entry.date, 10);
            const entryYear = new Date(timestamp).getFullYear();
            return entryYear === parseInt(selectedYear, 10);
        });

        // Filtrar e somar as receitas (type = "income")
        const totalReceitas = filteredEntries
            .filter(entry => entry.type === "income")
            .reduce((acc, entry) => acc + parseFloat(entry.value), 0);

        const rowReceita = document.getElementById("rowReceita");
        rowReceita.innerHTML = '';

        rowReceita.insertAdjacentHTML('beforeend', 
            `Receita<div class="right green"> R$ ${totalReceitas.toFixed(2)}</div>`);

        // Filtrar e somar as gastos (type = "expense")
        const totalGastos = filteredEntries
            .filter(entry => entry.type === "expense")
            .reduce((acc, entry) => acc + parseFloat(entry.value), 0);
        
        const rowGastos= document.getElementById("rowGastos");
        rowGastos.innerHTML='';
        rowGastos.insertAdjacentHTML('beforeend', 
            `Gastos<div class="right red"> R$ ${totalGastos.toFixed(2)}</div>`);

        const gastoPercentual = totalReceitas > 0 ? (totalGastos / totalReceitas) : "∅";
        const rowGastoPercentual = document.getElementById("rowGastoPercentual");
        rowGastoPercentual.innerHTML ='';

        rowGastoPercentual.insertAdjacentHTML('beforeend', 
            `% do total gasto<div class="right"> ${(gastoPercentual*100).toFixed(2)} %</div>`);

        const balanço = totalReceitas - totalGastos;
        const rowbalanco = document.getElementById('rowbalanco');
        rowbalanco.innerHTML='';
        if (balanço >= 0){
            rowbalanco.insertAdjacentHTML('beforeend', 
                `Balanço<div class="right green"> R$ ${balanço.toFixed(2)}</div>`);
        } else {
            rowbalanco.insertAdjacentHTML('beforeend', 
                `Balanço<div class="right red"> R$ ${balanço.toFixed(2)}</div>`);
        }
        

        const margemLucro = 1 - gastoPercentual;
        const rowMargemDeLucro = document.getElementById('rowMargemDeLucro');
        rowMargemDeLucro.innerHTML='';

        if (gastoPercentual >= 0){
            rowMargemDeLucro.insertAdjacentHTML('beforeend', 
                `% Margem de lucro<div class="right green"> ${(margemLucro*100).toFixed(2)} %<div>`)
        } else {
            rowMargemDeLucro.insertAdjacentHTML('beforeend', 
                `% Margem de lucro<div class="right red"> ${(margemLucro*100).toFixed(2)} %<div>`)
        }


    } catch (error) {
        console.error('Erro ao calcular dados:', error);
    }
}

async function criarDashboardAnual(selectedYear) {
    try {
        // Buscar as entradas do usuário logado
        const response = await fetch(`/entries?ownerId=${user.id}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar entradas: ${response.statusText}`);
        }

        const entries = await response.json();

        const filteredEntries = entries.filter(entry => {
            const timestamp = parseInt(entry.date, 10);
            const entryYear = new Date(timestamp).getFullYear();
            return entryYear === parseInt(selectedYear, 10);
        });

        // Inicializar arrays para receitas e gastos por mês (12 meses)
        const receitasMensais = Array(12).fill(0);
        const gastosMensais = Array(12).fill(0);

        // Processar as entradas
        filteredEntries.forEach(entry => {
            const timestamp = parseInt(entry.date, 10);
            const date = new Date(timestamp);
            const month = date.getMonth(); // Janeiro = 0, Dezembro = 11

            if (entry.type === "income") {
                receitasMensais[month] += parseFloat(entry.value);
            } else if (entry.type === "expense") {
                gastosMensais[month] += parseFloat(entry.value);
            }
        });

        // Criar o gráfico usando Chart.js
        renderizarGrafico(receitasMensais, gastosMensais);
    } catch (error) {
        console.error('Erro ao criar o dashboard anual:', error);
    }
}

function renderizarGrafico(receitasMensais, gastosMensais) {
    const ctx = document.getElementById('chartCanvas').getContext('2d');

    // Verificar se já existe um gráfico e destruir antes de criar um novo
    if (window.dashboardChart) {
        window.dashboardChart.destroy();
    }

    // Criar o gráfico de barras
    window.dashboardChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [
                'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ],
            datasets: [
                {
                    label: 'Receitas',
                    data: receitasMensais,
                    backgroundColor: 'green',
                    borderColor: 'darkgreen',
                    borderWidth: 1
                },
                {
                    label: 'Gastos',
                    data: gastosMensais,
                    backgroundColor: 'red',
                    borderColor: 'darkred',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `R$ ${context.raw.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Meses'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Valores em R$'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

async function listarCategorias(type, selectedYear) {
    try {
        const entriesResponse = await fetch(`/entries?ownerId=${user.id}`);
        const categoriesResponse = await fetch(`/categories?ownerId=${user.id}`);

        if (!entriesResponse.ok || !categoriesResponse.ok) {
            throw new Error('Erro ao buscar dados');
        }

        const entries = await entriesResponse.json();
        const categories = await categoriesResponse.json();

        // Filtrar entradas pelo tipo e ano selecionado
        const filteredEntries = entries.filter(entry => {
            const timestamp = parseInt(entry.date, 10);
            const entryYear = new Date(timestamp).getFullYear();
            return entry.type === type && entryYear === parseInt(selectedYear, 10);
        });

        // Calcular o total geral para o tipo e ano selecionado
        const totalGeral = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.value), 0);

        const categoriesData = [];

        // Agrupar as entradas por categoria
        categories.forEach(category => {
            const categoryTotal = filteredEntries
                .filter(entry => entry.categoryId === category.id)
                .reduce((acc, entry) => acc + parseFloat(entry.value), 0);

            if (categoryTotal > 0) {
                categoriesData.push({
                    name: category.label,
                    total: categoryTotal,
                    percent: (categoryTotal / totalGeral) * 100
                });
            }
        });

        // Atualizar o resumo da categoria na interface
        atualizarCategorySummary(categoriesData);
    } catch (error) {
        console.error('Erro ao listar categorias:', error);
    }
}



function atualizarCategorySummary(categoriesData) {
    const categoryBody = document.querySelector('.categoryBody');

    // Limpar conteúdo anterior
    categoryBody.innerHTML = '';

    // Adicionar cada categoria na estrutura correta
    categoriesData.forEach(({ name, total, percent }) => {
        categoryBody.insertAdjacentHTML('beforeend', `
            <div>${name}</div>
            <div>R$ ${total.toFixed(2)}</div>
            <div>${percent.toFixed(1)}%</div>
        `);
    });
}


// Adicionar eventos aos botões Receita e Despesa
document.getElementById('create-entry-form--income').addEventListener('click', () => {
    const yearDropdown = document.getElementById('yearDropdown');
    const selectedYear = yearDropdown.value || new Date().getFullYear();
    listarCategorias('income', selectedYear);
});

document.getElementById('create-entry-form--expense').addEventListener('click', () => {
    const yearDropdown = document.getElementById('yearDropdown');
    const selectedYear = yearDropdown.value || new Date().getFullYear();
    listarCategorias('expense', selectedYear);
});


// Chamar a função principal
fetchUniqueYears();


document.getElementById('downloadPdfButton').addEventListener('click', () => {
    // Selecionar o elemento principal da página que será transformado em PDF
    const element = document.body;

    // Configurações para o PDF
    const opt = {
        margin: 0.5,
        filename: 'relatorio.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Gerar e baixar o PDF
    html2pdf().set(opt).from(element).save();
});