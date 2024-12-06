import { logoutButton } from "../components/logout-button.js";
import { auth } from "../lib/auth.js";

const user = auth();

if (!user) {
  window.location.replace("./login.html");
}

logoutButton();

$(document).ready(function () {
  const loggedInUser = auth();
  if (!loggedInUser) {
    window.location.replace("/login.html");
    return;
  }

  function getdata(callback) {
    fetch(`/entries`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network error: " + response.status);
        }
        return response.json();
      })
      .then((entries) => {
        console.log("Data loaded:", entries);
        const data = { entries };
        if (callback) callback(data);
      })
      .catch((error) => {
        console.error("Error loading data: ", error);
        $("#valorEconomia").text("Error loading data");
      });
  }

  function savingMonth(entries, userId) {
    if (!Array.isArray(entries)) {
      console.error("Invalid data: entries is not an array");
      return 0;
    }

    let income = 0;
    let expenses = 0;
    const currentMonth = new Date().getMonth();
    const userEntries = entries.filter((entry) => entry.ownerId === userId);

    userEntries.forEach((entry) => {
      try {
        const transactionDate = new Date(parseInt(entry.date));
        if (isNaN(transactionDate)) throw new Error("Invalid date");

        const transactionMonth = transactionDate.getMonth();

        if (transactionMonth === currentMonth) {
          const value = parseFloat(entry.value) || 0;
          if (entry.type === "income") {
            income += value;
          } else if (entry.type === "expense") {
            expenses += value;
          }
        }
      } catch (error) {
        console.error("Error processing entry:", error, entry);
      }
    });

    const savedAmount = income - expenses;
    console.log(
      `User ${userId} - Income:`,
      income,
      "Expenses:",
      expenses,
      "Saved Amount:",
      savedAmount
    );

    const sign = savedAmount > 0 ? "+" : "";
    $("#valorEconomia").text(`${sign}R$ ${savedAmount.toFixed(2)}`);
    $("#economiaTotal").css(
      "background-color",
      savedAmount > 0
        ? "var(--background-success)"
        : "var(--background-destructive)"
    );

    return savedAmount;
  }

  function processMonthlyData(entries, userId) {
    const months = Array(12)
      .fill(0)
      .map(() => ({
        income: 0,
        expense: 0,
      }));

    const userEntries = entries.filter((entry) => entry.ownerId === userId);

    userEntries.forEach((entry) => {
      try {
        const date = new Date(parseInt(entry.date));
        if (isNaN(date)) throw new Error("Invalid date");

        const month = date.getMonth();
        const value = parseFloat(entry.value) || 0;

        if (entry.type === "income") {
          months[month].income += value;
        } else if (entry.type === "expense") {
          months[month].expense += value;
        }
      } catch (error) {
        console.error("Error processing entry for chart:", error, entry);
      }
    });

    return months;
  }

  function processMonthlyExpenses(entries, userId) {
    const expensesByCategory = {};
    const currentMonth = new Date().getMonth();

    const userEntries = entries.filter(
      (entry) =>
        entry.ownerId === userId &&
        entry.type === "expense" &&
        new Date(parseInt(entry.date)).getMonth() === currentMonth
    );

    fetch(`/categories`)
      .then((response) => response.json())
      .then((categories) => {
        userEntries.forEach((entry) => {
          try {
            const category = categories.find(
              (cat) => cat.id === entry.categoryId && cat.ownerId === userId
            );
            if (category) {
              const categoryName = category.label;
              if (!expensesByCategory[categoryName]) {
                expensesByCategory[categoryName] = 0;
              }
              expensesByCategory[categoryName] += parseFloat(entry.value) || 0;
            }
          } catch (error) {
            console.error("Error processing expense:", error, entry);
          }
        });

        createPieChart(expensesByCategory);
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
      });
  }

  function createLineChart(monthlyData) {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const chartElement = document.getElementById("mensal");
    if (!chartElement) {
      console.error("Chart element not found");
      return;
    }

    const existingChart = Chart.getChart(chartElement);
    if (existingChart) {
      existingChart.destroy();
    }

    new Chart(chartElement, {
      type: "line",
      data: {
        labels: monthNames,
        datasets: [
          {
            label: "Ganhos",
            data: monthlyData.map((month) => month.income),
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            tension: 0.1,
          },
          {
            label: "Gastos",
            data: monthlyData.map((month) => month.expense),
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Ganhos e despesas ao longo do ano",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": R$ ";
                }
                label += context.parsed.y.toFixed(2);
                return label;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return "R$ " + value.toFixed(2);
              },
            },
          },
        },
      },
    });
  }

  function createPieChart(expensesByCategory) {
    const chartElement = document.getElementById("graficoGastos");
    if (!chartElement) {
      console.error("Pie chart element not found");
      return;
    }

    const existingChart = Chart.getChart(chartElement);
    if (existingChart) {
      existingChart.destroy();
    }

    const colors = Object.keys(expensesByCategory).map((_, index) => {
      const hue = (index * 137.508) % 360;
      return `hsl(${hue}, 70%, 50%)`;
    });

    new Chart(chartElement, {
      type: "pie",
      data: {
        labels: Object.keys(expensesByCategory),
        datasets: [
          {
            data: Object.values(expensesByCategory),
            backgroundColor: colors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: R$ ${value.toFixed(2)} (${percentage}%)`;
              },
            },
          },
        },
      },
    });
  }

  getdata(function (data) {
    savingMonth(data.entries, loggedInUser.id);
    const monthlyData = processMonthlyData(data.entries, loggedInUser.id);
    createLineChart(monthlyData);
    processMonthlyExpenses(data.entries, loggedInUser.id);
  });
});
