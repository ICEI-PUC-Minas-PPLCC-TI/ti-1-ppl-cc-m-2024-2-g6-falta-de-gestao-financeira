import { auth } from "./auth.js";
import { getUserCategories } from "./categories.js";
import { createPopupEvents } from "./popup.js";

const user = auth();

export async function loadAllRegisters(useFilter, text) {
  const res = await fetch("/entries");

  if (!res.ok) {
    console.error("Erro ao carregar registros");
    return null;
  }

  let registers = await res.json();

  const divContaner = document.getElementById("elements");

  registers = useFilter
    ? registers.filter((element) =>
        element.label.toLowerCase().includes(text.toLowerCase())
      )
    : registers;

  registers.forEach((element) => {
    const div = document.createElement("div");
    div.className = "container2";

    const img = document.createElement("img");

    //Ajustar a constante lÃ¡ em cima para receber todas as imagens
    //img.src = categoryImagens[element.categoryId]
    img.src = "/assets/img/icon/selectable/briefcase.svg";

    const spanTitle = document.createElement("span");

    spanTitle.innerHTML = element.label;
    spanTitle.className = "info";

    const valueTitle = document.createElement("span");

    const valueStyled = element.type === "expense" ? "red" : "green";

    valueTitle.innerHTML = decimalFormat(element.value);
    valueTitle.className = "value";
    valueTitle.style = `color: ${valueStyled}`;

    div.appendChild(img);
    div.appendChild(spanTitle);
    div.appendChild(valueTitle);

    divContaner.appendChild(div);
  });

  const total = registers.reduce((memo, currenc) => {
    memo =
      currenc.type === "expense" ? memo - currenc.value : memo + currenc.value;
    return memo;
  }, 0);

  const divTotal = document.getElementById("total");

  divTotal.innerHTML = decimalFormat(total);
  divTotal.style = total > 0 ? "color: green" : "color: red";

  const previousMonth = document.getElementById("previousMonth");
  const currentMonth = document.getElementById("currentMonth");

  //colocar os valores aqui
}

const decimalFormat = (value) =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

function myFunction(val) {
  alert("The input value has changed. The new value is: " + val);
}

const pesquisar = document.getElementById("pesquisar");

pesquisar.addEventListener(
  "input",
  (e) => {
    const elementsToRemove = document.getElementsByClassName("container2");
    while (elementsToRemove.length > 0) {
      elementsToRemove[0].parentNode.removeChild(elementsToRemove[0]);
    }

    loadAllRegisters(true, e.target.value);
  },
  false
);

export async function createSelectCategories() {
  const select = document.getElementById("create-entrie-form--category");
  const entrieType = document.getElementById("create-entrie-form--income")
    .checked
    ? "income"
    : "expense";

  const userCategories = await getUserCategories(user.id);

  select.innerHTML = `
    <option value="none">Sem categoria</option>
  `;

  for (const { id, label, type } of userCategories) {
    if (type === entrieType) {
      select.insertAdjacentHTML(
        "beforeend",
        `<option value="${id}">${label}</option>`
      );
    }
  }
}

document.querySelectorAll(".form__field__tab__input").forEach((input) => {
  input.addEventListener("change", () => {
    createSelectCategories();
  });
});

document
  .getElementById("create-entrie-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const label = document.getElementById("create-entrie-form--label").value;
    const type = document.getElementById("create-entrie-form--income").checked
      ? "income"
      : "expense";
    const value = document.getElementById("create-entrie-form--value").value;
    const dateValue =  new Date(document.getElementById("create-entrie-form--date").value);
    const date = dateValue.getTime();
    const category = document.getElementById(
      "create-entrie-form--category"
    ).value;

    try{
      const res = await fetch("/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: label,
          type: type,
          value: value,
          date: date,
          category:category,
        }),
      });

      if (res.ok) {
        alert("Registro criado com sucesso!");
        document.getElementById("create-entrie-form").reset(); // Opcional: limpar o formulário após o envio
      } else {
        alert("Erro ao criar registro.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro ao se conectar com o servidor.");
    }
  });

loadAllRegisters();

createPopupEvents();

createSelectCategories();
