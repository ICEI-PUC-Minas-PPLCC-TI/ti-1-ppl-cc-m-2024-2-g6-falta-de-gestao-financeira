document.addEventListener("DOMContentLoaded", function () {
  // Capturando o formulário
  const form = document.getElementById("investment-form");
  const cancelButton = document.getElementById("cancel");
  const finalAmountField = document.getElementById("final-amount");
  const jsonOutput = document.getElementById("json-output");
  const savedInvestmentsList = document.getElementById("investment-list");
  const clearStorageButton = document.getElementById("clear-storage");
  const saveInvestmentButton = document.getElementById("save-investment");

  // Carregar investimentos salvos ao carregar a página
  loadSavedInvestments();

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Captura dos dados do formulário
    const initialAmount =
      parseFloat(document.getElementById("initial-amount").value) || 0;
    const monthlyDeposit =
      parseFloat(document.getElementById("monthly-deposit").value) || 0;
    const interestRate =
      parseFloat(document.getElementById("interest-rate").value) / 100 || 0;
    const investmentPeriod =
      parseInt(document.getElementById("investment-period").value) || 0;

    // Validação de dados
    if (investmentPeriod <= 0 || interestRate <= 0) {
      alert("Por favor, insira valores válidos para Taxa de Juros e Período.");
      return;
    }

    // Cálculo do montante final
    let finalAmount = initialAmount;
    for (let i = 0; i < investmentPeriod; i++) {
      finalAmount += monthlyDeposit;
      finalAmount *= 1 + interestRate / 12;
    }

    // Exibindo o resultado
    finalAmountField.textContent = `Montante final: R$ ${finalAmount.toFixed(
      2
    )}`;

    // Exibindo os dados no formato JSON
    const investmentData = {
      valorInicial: initialAmount,
      aporteMensal: monthlyDeposit,
      taxaDeJuros: (interestRate * 100).toFixed(2),
      periodoMeses: investmentPeriod,
      montanteFinal: finalAmount.toFixed(2),
    };

    jsonOutput.textContent = JSON.stringify(investmentData, null, 2);
  });

  // Função para salvar o investimento no localStorage
  saveInvestmentButton.addEventListener("click", function () {
    const initialAmount =
      parseFloat(document.getElementById("initial-amount").value) || 0;
    const monthlyDeposit =
      parseFloat(document.getElementById("monthly-deposit").value) || 0;
    const interestRate =
      parseFloat(document.getElementById("interest-rate").value) / 100 || 0;
    const investmentPeriod =
      parseInt(document.getElementById("investment-period").value) || 0;

    if (investmentPeriod <= 0 || interestRate <= 0) {
      alert("Por favor, insira valores válidos para Taxa de Juros e Período.");
      return;
    }

    // Cálculo do montante final
    let finalAmount = initialAmount;
    for (let i = 0; i < investmentPeriod; i++) {
      finalAmount += monthlyDeposit;
      finalAmount *= 1 + interestRate / 12;
    }

    // Dados do investimento
    const investmentData = {
      valorInicial: initialAmount,
      aporteMensal: monthlyDeposit,
      taxaDeJuros: (interestRate * 100).toFixed(2),
      periodoMeses: investmentPeriod,
      montanteFinal: finalAmount.toFixed(2),
    };

    // Salvar no localStorage
    const savedInvestments =
      JSON.parse(localStorage.getItem("investments")) || [];
    savedInvestments.push(investmentData);
    localStorage.setItem("investments", JSON.stringify(savedInvestments));

    // Atualizar a lista de investimentos salvos
    loadSavedInvestments();
  });

  // Função para carregar os investimentos salvos
  function loadSavedInvestments() {
    const savedInvestments =
      JSON.parse(localStorage.getItem("investments")) || [];
    savedInvestmentsList.innerHTML = ""; // Limpar a lista antes de carregar

    savedInvestments.forEach((investment, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = `Investimento ${index + 1}: R$ ${
        investment.valorInicial
      } + R$ ${investment.aporteMensal} mensal por ${
        investment.periodoMeses
      } meses a ${investment.taxaDeJuros}% de juros. Montante final: R$ ${
        investment.montanteFinal
      }`;
      savedInvestmentsList.appendChild(listItem);
    });
  }

  // Função para limpar os dados salvos
  clearStorageButton.addEventListener("click", function () {
    localStorage.removeItem("investments");
    loadSavedInvestments();
  });

  // Função para resetar o formulário
  cancelButton.addEventListener("click", function () {
    form.reset();
    finalAmountField.textContent = "Montante final: R$ 0,00";
    jsonOutput.textContent = "{}";
  });
});
