document.addEventListener("DOMContentLoaded", async () => {
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