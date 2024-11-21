import { updateEntriesList } from "../components/entries-list.js";
import category from "../controllers/category.js";
import entrie from "../controllers/entrie.js";

export function editEntriePopup() {
  const editEntrieForm = document.getElementById("edit-entrie-form");
  const editEntriePopup = document.getElementById("edit-entrie-popup");
  const typeSelectors = document.querySelectorAll(
    "#edit-entrie-form .form__field__tab__input"
  );

  const label = document.getElementById("edit-entrie-form--label");
  const value = document.getElementById("edit-entrie-form--value");
  const type = document.getElementById("edit-entrie-form--income");
  const date = document.getElementById("edit-entrie-form--date");
  const categoryId = document.getElementById("edit-entrie-form--category");

  editEntrieForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const MILLISECCONDS_IN_DAY = 86_400_000;

    const formData = {
      entrieId: editEntrieForm.getAttribute("data-entrie-id"),
      label: label.value,
      value: value.value,
      type: type.checked ? "income" : "expense",
      date: new Date(date.value).getTime() + MILLISECCONDS_IN_DAY,
      categoryId: parseInt(categoryId.value),
    };

    const updatedEntrie = await entrie.update(formData);

    if (!updatedEntrie) {
      alert("Erro ao editar o registro.");
      return;
    }

    editEntriePopup.close();
    editEntrieForm.reset();

    const updatedEntries = await entrie.getAllFromUser();

    updateEntriesList(updatedEntries);
  });

  typeSelectors.forEach((input) => {
    input.addEventListener("change", async () => {
      updateSelectCategories();
    });
  });

  updateSelectCategories();
}

async function updateSelectCategories() {
  const entrieType = document.getElementById("create-entrie-form--income")
    .checked
    ? "income"
    : "expense";

  const userCategories = await category.getAllFromUser();

  const select = document.getElementById("create-entrie-form--category");
  select.innerHTML = `
    <option value="none">Sem categoria</option>
  `;

  userCategories.forEach(({ id, label, type }) => {
    if (type === entrieType) {
      select.insertAdjacentHTML(
        "beforeend",
        `<option value="${id}">${label}</option>`
      );
    }
  });
}