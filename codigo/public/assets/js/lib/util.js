import { MILLISECCONDS_IN_DAY } from "./constants.js";

export function toMoney(value) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatStringForSearch(string) {
  return string
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .toLowerCase();
}

export function formatDateToInput(date) {
  date = new Date(date);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatDateToDisplay(date) {
  date = new Date(date);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${day}/${month}/${year}`;
}

export function daysDiffrence(firstDate, secondDate) {
  const daysDiffrence = Math.floor(
    (new Date(firstDate).getTime() - new Date(secondDate).getTime()) /
      MILLISECCONDS_IN_DAY
  );

  return daysDiffrence;
}
