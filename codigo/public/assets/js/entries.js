import { auth } from "./auth.js";
import { getUserCategories } from "./categories.js";
import { ICONS_NAMES } from "./icons-selector.js";
import { createPopupEvents } from "./popup.js";
import { formatDateToInput, formatStringForSearch, toMoney } from "./util.js";

const user = auth();

export async function getAllUserEntries(userId) {
  const res = await fetch(`/entries?ownerId=${userId}&_sort=date&_order=desc`);

  if (!res.ok) {
    console.error("Erro ao carregar registros");
    return null;
  }

  const entries = await res.json();

  return entries;
}

export async function createEntrie({ label, type, value, date, categoryId }) {
  const res = await fetch("/entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      label,
      type,
      value,
      date,
      categoryId,
      ownerId: user.id,
    }),
  });

  if (!res.ok) {
    console.error("Erro ao criar registro.");
    return null;
  }

  const newEntrie = await res.json();

  return newEntrie;
}

export async function updateEntrieById({
  entrieId,
  label,
  date,
  type,
  value,
  categoryId,
}) {
  const res = await fetch(`/entries/${entrieId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ label, date, type, value, categoryId }),
  });

  if (!res.ok) {
    console.error("Erro ao atualizar o registro.");

    return null;
  }

  const updatedEntrie = await res.json();

  return updatedEntrie;
}

export async function deleteEntrie(entrieId) {
  const res = await fetch(`/entries/${entrieId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    console.error("Erro ao excluir o registro.");
  }

  return res.ok;
}

export async function updateUserEntries(entries) {
  const entriesList = document.querySelector(".entries-list");
  entriesList.innerHTML = "";

  const editEntrieForm = document.getElementById("edit-entrie-form");
  const editEntriePopup = document.getElementById("edit-entrie-popup");

  const userCategories = await getUserCategories(user.id);

  entries.forEach(({ date, id, type, categoryId, value, label }) => {
    if (!document.getElementById(`entries-list__day-${date}`)) {
      entriesList.insertAdjacentHTML(
        "beforeend",
        `
        <li class="entries-list__item">
          <h3>${new Date(date).toLocaleDateString("pt-BR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}</h3>
          <ul
            class="entries-list__day"
            id="entries-list__day-${date}"
          ></ul>
        </li>
        `
      );
    }

    const parentElement = document.getElementById(`entries-list__day-${date}`);

    const isIncome = type === "income";

    const category = userCategories.filter((category) => {
      return category.id === categoryId;
    })[0];

    parentElement.insertAdjacentHTML(
      "beforeend",
      `
    <li class="entries-list__day__item">
      ${
        category && category.icon && ICONS_NAMES.includes(category.icon)
          ? `<img
              class="entries-list__day__item__icon"
              src="./assets/img/icon/selectable/${category.icon}.svg"
              alt="icon"
            />`
          : "<div></div>"
      }

      <span class="entries-list__day__item__value${
        isIncome
          ? " entries-list__day__item__value--income"
          : " entries-list__day__item__value--expense"
      }">${isIncome ? "" : "-"}R$ ${toMoney(value)}</span>

      <span class="entries-list__day__item__title">${label}</span>

      <button
        class="entries-list__day__item__button entries-list__day__item__button--edit"
        id="button-edit-entrie-${id}"
        type="button"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
          />
          <path d="m15 5 4 4" />
        </svg>
      </button>
      <button
        class="entries-list__day__item__button entries-list__day__item__button--delete"
        id="button-delete-entrie-${id}"
        type="button"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          <line x1="10" x2="10" y1="11" y2="17" />
          <line x1="14" x2="14" y1="11" y2="17" />
        </svg>
      </button>
    </li>
    `
    );

    const editButton = document.getElementById(`button-edit-entrie-${id}`);
    const deleteButton = document.getElementById(`button-delete-entrie-${id}`);

    editButton.addEventListener("click", () => {
      editEntrieForm.setAttribute("data-entrie-id", id);

      document.getElementById("edit-entrie-form--label").value = label;
      document.getElementById("edit-entrie-form--date").value =
        formatDateToInput(new Date(date));
      document.getElementById("edit-entrie-form--value").value = value;

      if (type === "income") {
        document.getElementById("edit-entrie-form--income").checked = true;
      } else {
        document.getElementById("edit-entrie-form--expense").checked = true;
      }

      document.querySelector(".edit-entrie-form");

      editEntriePopup.showModal();
    });

    deleteButton.addEventListener("click", async () => {
      const deleted = await deleteEntrie(id);

      if (!deleted) {
        alert("Erro ao deletar registro.");
        return;
      }

      const updatedEntries = await getAllUserEntries(user.id);

      updateUserEntries(updatedEntries);
    });
  });
}

export async function updateCreateEntriesSelectCategories() {
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

export async function updateEditEntriesSelectCategories() {
  const select = document.getElementById("edit-entrie-form--category");
  const entrieType = document.getElementById("edit-entrie-form--income").checked
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

export function createEntriesEvents() {
  const searchBar = document.getElementById("search");

  searchBar.addEventListener("blur", async (e) => {
    const userEntries = await getAllUserEntries(user.id);
    const searchKey = formatStringForSearch(e.target.value);

    const filteredEntries = userEntries.filter((entrie) =>
      formatStringForSearch(entrie.label).includes(searchKey)
    );

    updateUserEntries(filteredEntries);
  });

  document.querySelectorAll(".form__field__tab__input").forEach((input) => {
    input.addEventListener("change", () => {
      updateCreateEntriesSelectCategories();
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
      const dateValue = new Date(
        document.getElementById("create-entrie-form--date").value
      );
      const date = dateValue.getTime();
      const categoryId = parseInt(
        document.getElementById("create-entrie-form--category").value
      );

      const entrie = await createEntrie({
        date,
        label,
        type,
        value,
        categoryId,
      });

      if (!entrie) {
        alert("Erro ao criar o registro.");
        return;
      }

      document.getElementById("create-entrie-popup").close();
      document.getElementById("create-entrie-form").reset();

      const res = await getAllUserEntries(user.id);

      if (!res.ok) {
        window.location.reload();
      }

      const updatedEntries = await res.json();

      updateUserEntries(updatedEntries);
    });

  document
    .getElementById("edit-entrie-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const editEntrieForm = document.getElementById("edit-entrie-form");
      const editEntriePopup = document.getElementById("edit-entrie-popup");

      const id = editEntrieForm.getAttribute("data-entrie-id");

      const label = document.getElementById("edit-entrie-form--label").value;
      const date = new Date(
        document.getElementById("edit-entrie-form--date").value
      ).getTime();

      const value = document.getElementById("edit-entrie-form--value").value;

      const type = document.getElementById("edit-entrie-form--income").checked
        ? "income"
        : "expense";

      const categoryId = parseInt(
        document.getElementById("edit-entrie-form--category").value
      );

      const updatedEntrie = await updateEntrieById({
        entrieId: id,
        label,
        date,
        type,
        value,
        categoryId,
      });

      if (!updatedEntrie) {
        alert("Erro ao editar o registro.");
        return;
      }

      editEntriePopup.close();
      editEntrieForm.reset();

      const updatedEntries = await getAllUserEntries(user.id);

      updateUserEntries(updatedEntries);
    });
}
