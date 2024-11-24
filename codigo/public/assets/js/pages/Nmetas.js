import { auth, logout } from "../lib/auth.js";

// Check authentication before DOM loads
const user = auth();
if (!user) {
    window.location.replace("./login.html");
}

document.addEventListener('DOMContentLoaded', () => {
    const goalList = document.getElementById('goal-list');
    const modal = document.getElementById('goal-modal');
    const addGoalButton = document.getElementById('add-goal');
    const cancelGoalButton = document.getElementById('cancel-goal');
    const goalForm = document.getElementById('goal-form');
    const iconPicker = document.getElementById('icon-picker');
    const logoutButton = document.getElementById('logout-button');
    
    let selectedIcon = '';
    let metas = [];

    // Setup logout button
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            logout();
        });
    }

    // Fetch metas from JSON Server
    async function fetchMetas() {
        try {
            const response = await fetch('http://localhost:3000/metas');
            if (!response.ok) {
                throw new Error('Failed to fetch metas');
            }
            metas = await response.json();
            renderMetas();
        } catch (error) {
            console.error('Error fetching metas:', error);
            goalList.innerHTML = '<p>Erro ao carregar metas. Por favor, tente novamente.</p>';
        }
    }

    // Initial fetch of metas
    fetchMetas();

    // Show modal
    addGoalButton.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    // Hide modal
    cancelGoalButton.addEventListener('click', () => {
        modal.classList.add('hidden');
        goalForm.reset();
        selectedIcon = '';
    });

    // Handle icon selection
    iconPicker.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            // Remove previous selection
            iconPicker.querySelectorAll('button').forEach(btn => 
                btn.classList.remove('selected'));
            
            // Add selection to clicked button
            e.target.classList.add('selected');
            selectedIcon = e.target.getAttribute('data-icon');
        }
    });

    // Format currency input
    const goalValue = document.getElementById('goal-value');
    goalValue.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = (parseInt(value) / 100).toFixed(2);
        e.target.value = value.replace('.', ',');
    });

    // Add new meta
    goalForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nome = document.getElementById('goal-name').value;
        const valor = parseFloat(document.getElementById('goal-value').value.replace(',', '.'));
        const tempo = document.getElementById('goal-period').value;

        if (!selectedIcon) {
            alert('Por favor, selecione um ícone!');
            return;
        }

        const newMeta = {
            nome,
            valor,
            tempo,
            icone: selectedIcon
        };

        try {
            const response = await fetch('http://localhost:3000/metas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMeta)
            });

            if (!response.ok) {
                throw new Error('Failed to create meta');
            }

            await fetchMetas(); // Refresh metas list
            modal.classList.add('hidden');
            goalForm.reset();
            selectedIcon = '';
            iconPicker.querySelectorAll('button').forEach(btn => 
                btn.classList.remove('selected'));
        } catch (error) {
            console.error('Error creating meta:', error);
            alert('Falha ao criar meta. Por favor, tente novamente.');
        }
    });

    // Render metas
    function renderMetas() {
        goalList.innerHTML = '';
        metas.forEach((meta) => {
            const metaItem = document.createElement('div');
            metaItem.className = 'goal-item';
            metaItem.innerHTML = `
                <div class="goal-icon">${meta.icone}</div>
                <h3>${meta.nome}</h3>
                <p>Valor: R$ ${meta.valor.toFixed(2).replace('.', ',')}</p>
                <p>Período: ${meta.tempo}</p>
                <button onclick="deleteMeta(${meta.id})">Excluir</button>
            `;
            goalList.appendChild(metaItem);
        });
    }

    // Delete meta
    window.deleteMeta = async function(metaId) {
        if (!confirm('Tem certeza que deseja excluir esta meta?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/metas/${metaId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete meta');
            }

            await fetchMetas(); // Refresh metas list
        } catch (error) {
            console.error('Error deleting meta:', error);
            alert('Falha ao excluir meta. Por favor, tente novamente.');
        }
    };
});