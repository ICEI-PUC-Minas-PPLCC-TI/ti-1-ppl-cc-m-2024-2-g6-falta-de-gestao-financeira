import { logoutButton } from "../components/logout-button.js";
import { auth } from "../lib/auth.js";
import { API_KEY } from "../lib/env.js";

const STOCKS = ["AAPL", "MSFT", "NVDA", "AMD", "TSLA"];

const API_URL = `
  https://api.twelvedata.com/quote?symbol=${STOCKS.join(",")}&apikey=${API_KEY}
`;

const stocksList = document.getElementById("stocks-list");
const updateButton = document.getElementById("update-stocks");

document.addEventListener("DOMContentLoaded", async () => {
  const user = auth();

  if (!user) {
    window.location.replace("./login.html");
  }

  updateButton.addEventListener("click", () => window.location.reload());

  logoutButton();

  renderStocks();
});

// Função para fazer fetch com retry
async function fetchWithRetry(url, maxRetries = 3) {
  // Mostrar loading
  stocksList.innerHTML = `
    <li class="text-center">
      <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Carregando...</span>
      </div>
      <p class="mt-2">Carregando dados das ações...</p>
    </li>
  `;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erro na resposta da API");
      }
      const data = await response.json();

      // Verificar se os dados são válidos
      if (!data || Object.keys(data).length === 0) {
        throw new Error("Dados não encontrados");
      }

      return data;
    } catch (error) {
      console.error(`Tentativa ${i + 1} falhou:`, error);
      if (i === maxRetries - 1) {
        throw error; // Se foi a última tentativa, propaga o erro
      }
      // Espera um tempo antes de tentar novamente (aumenta progressivamente)
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

async function renderStocks() {
  try {
    const response = await fetchWithRetry(API_URL);

    if (!stocksList) {
      throw new Error("Elemento stocks-list não encontrado");
    }

    // Limpa o loading
    stocksList.innerHTML = "";

    const responses = Object.entries(response);

    const storageStocks = localStorage.getItem("stocks");

    const stocks = storageStocks ? JSON.parse(storageStocks) : {};

    responses.forEach((data) => {
      if (data[0] && data[0] === data[1].symbol) {
        stocks[data[0]] = data[1];
      }
    });

    if (Object.keys(stocks).length > 0) {
      localStorage.setItem("stocks", JSON.stringify(stocks));

      Object.keys(stocks).forEach((key) => {
        const stock = stocks[key];

        const precoFormatado = parseFloat(stock.close || 0).toLocaleString(
          "pt-BR",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        );

        const volumeFormatado = parseInt(stock.volume || 0).toLocaleString(
          "pt-BR"
        );

        // Calcula a variação
        const variacao = parseFloat(stock.close) - parseFloat(stock.open);
        const variacaoPercentual = (
          (variacao / parseFloat(stock.open)) *
          100
        ).toFixed(2);

        const stockElement = document.createElement("li");
        stockElement.className = "stocks-list__item";

        stockElement.innerHTML = `
          <h3 class="stock-list__item__title">${stock.name}</h3>

          <div class="stock-list__item__content">
            <p>
              <strong>Código:</strong> ${stock.symbol}
            </p>

            <p>
              <strong>Preço Atual:</strong> $ ${precoFormatado}
        
              <span class="${
                variacao >= 0 ? "text-success" : "text-destructive"
              }">
                ${variacao >= 0 ? "▲" : "▼"} ${Math.abs(variacaoPercentual)}%
              </span>
            </p>

            <p>
              <strong>Volume Negociado:</strong> ${volumeFormatado} ações
            </p>

            <p>
              <strong>Última atualização em:</strong>

              <span>
              ${new Date(stock.timestamp).toLocaleTimeString()}
              </span>
            </p>
          </div>
        `;

        stocksList.appendChild(stockElement);
      });
    } else {
      stocksList.innerHTML = `
        <div class="text-destructive">
          <p>Desculpe, não foi possível carregar os dados no momento.</p>
          <p>Por favor, tente novamente em alguns instantes.</p>
        </div>
      `;
    }
  } catch (error) {
    console.error(error);
  }
}
