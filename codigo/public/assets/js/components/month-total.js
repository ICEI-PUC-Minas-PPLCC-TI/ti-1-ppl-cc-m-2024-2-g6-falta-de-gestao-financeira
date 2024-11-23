import entrie from "../controllers/entrie.js";

import { toMoney } from "../lib/util.js";

export async function updateMonthTotal(elementId, month, year) {
  const today = new Date();

  if (!month) month = today.getMonth();
  if (!year) year = today.getFullYear();

  let sum = 0;
  let isPositive = true;

  const entries = await entrie.getAllFromUser();

  for (const { date, value, type } of entries) {
    const entrieMonth = new Date(date).getMonth();
    const entrieYear = new Date(date).getFullYear();

    if (entrieMonth === month && entrieYear === year) {
      if (type === "income") {
        sum += parseFloat(value) || 0;
      } else {
        sum -= parseFloat(value) || 0;
      }
    } else if (entrieMonth < month || entrieYear < year) break;
  }

  if (sum < 0) {
    isPositive = false;
    sum *= -1;
  }

  const element = document.getElementById(elementId);

  element.classList.add(isPositive ? "text-success" : "text-destructive");
  element.classList.remove(isPositive ? "text-destructive" : "text-success");
  element.innerHTML = `R$ ${toMoney(sum)}`;
}
