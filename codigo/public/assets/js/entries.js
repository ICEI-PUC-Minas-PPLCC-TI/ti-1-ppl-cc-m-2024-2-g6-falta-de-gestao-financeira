function lerDados () {
    let strDados = sessionStorage.getItem('db');
    let objDados = {};
    
    if (strDados){
        objDados = JSON.parse(strDados);
    }
    else {
        alert("Erro ao carregar registros no banco de dados: strDados = null");
    }
    
    return objDados;
}

function salvarDados(dados) {
    localStorage.setItem('db', JSON.stringify(dados));

}


function imprimeDados() {
    let tela = document.getElementById('tela');
    let strHTML = '';
    let objDados = lerDados();


    for (let i = 0; i<objDados.contatos.length; i++){
        strHTML += `<p>${objDados.contatos[i].nome} - ${objDados.contatos[i].telefone}</p>`;
    }

    tela.innerHTML = strHTML;
}


document.addEventListener('DOMContentLoaded', async function() {
    const openModalButton = document.getElementById('dateSelector'); //Botão selecionar data
    const calendarModal = document.getElementById('calendarModal'); // Iframe

    // Abre o modal do calendário ao clicar no botão
    openModalButton.addEventListener('click', () => {
        calendarModal.style.display = 'flex';
    });

    // Fecha o modal do calendário ao receber a confirmação de data selecionada
    window.addEventListener('message', async (event) => {
        if (event.data.action === 'confirmDate') {
            const { startOfDay, endOfDay } = event.data;
            await buscarRegistrosPorData(startOfDay, endOfDay);
            calendarModal.style.display = 'none'; // Fecha o modal
        }
    });

    // Busca e exibe os registros do dia atual ao carregar a página
    const hoje = new Date();
    const startOfDay = new Date(hoje.setHours(0, 0, 0, 0)).getTime();
    const endOfDay = new Date(hoje.setHours(23, 59, 59, 999)).getTime();
    await buscarRegistrosPorData(startOfDay, endOfDay);
});

// Função para buscar e exibir registros por data
async function buscarRegistrosPorData(startOfDay, endOfDay) {
    try {
        const response = await fetch('C:\\Users\\rondi\\PUC\\2024.2\\TI1\\codigo\\db\\db.json'); // Caminho para o JSON
        const data = await response.json();

        // Filtra os registros que têm data entre o início e o fim do dia selecionado
        const registros = data.entries.filter(entry => {
            const entryDate = parseInt(entry.date);
            return entryDate >= startOfDay && entryDate <= endOfDay;
        });

        // Exibe os registros na página
        exibirRegistros(registros);
    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
    }
}

// Função para exibir os registros na interface
function exibirRegistros(registros) {
    const container = document.querySelector('.card-body'); // Seletor do contêiner onde deseja exibir os registros
    container.innerHTML = '<h3>Registros</h3>'; // Limpa e adiciona título

    registros.forEach(registro => {
        const registroDiv = document.createElement('div');
        registroDiv.classList.add('registro', 'd-flex', 'justify-content-between', 'align-items-center', 'p-2', 'mb-2', 'rounded');

        const labelDiv = document.createElement('div');
        labelDiv.classList.add('Label');
        labelDiv.textContent = registro.label;

        const valueDiv = document.createElement('div');
        valueDiv.classList.add(registro.type === 'expense' ? 'expense' : 'income');
        valueDiv.textContent = `${registro.type === 'expense' ? '-' : '+'} R$${registro.value.toFixed(2)}`;

        // Estilos adicionais para despesas e receitas
        valueDiv.style.color = registro.type === 'expense' ? 'red' : 'green';

        // Adiciona label e valor ao registro
        registroDiv.appendChild(labelDiv);
        registroDiv.appendChild(valueDiv);

        // Adiciona o registro ao contêiner
        container.appendChild(registroDiv);
    });
}
