import { auth } from "./auth.js";
import { createIconsSelector } from "./icons-selector.js";

document.querySelector(".close-button").addEventListener("click", () => {
  document.querySelector(".modal").style.display = "none";
});

document
  .getElementById("metaForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const valor = document.getElementById("valor").value;
    const tempo = document.getElementById("tempo").value;
    let icone = document
      .querySelector(".form__field__icons__item__input:checked")
      .getAttribute("data-icon-name");

    if (icone === "none") icone = undefined;

    const meta = criarMeta({ nome, valor, tempo, icone });

    if (!meta) {
      alert("Erro ao criar a meta.");
      return;
    }

    cancel();
  });

createIconsSelector();

async function criarMeta({ nome, tempo, icone, valor }) {
  const user = auth();
  const time = new Date().getTime();

  const res = await fetch("/goals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ownerId: user.id,
      name: nome,
      time: tempo,
      icon: icone,
      value: valor,
      createdAt: time,
      updatedAt: time,
    }),
  });

  if (res.ok) {
    const novaMeta = await res.json();

    return novaMeta();
  } else {
    alert("Erro ao criar a meta, tente novamente.");
    return null;
  }
}

// Função para excluir uma meta
async function atualizarMeta({ id, nome, tempo, icone, valor }) {
  const updatedAt = new Date().getTime();

  const res = await fetch(`/goals/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: nome,
      time: tempo,
      icon: icone,
      value: valor,
      updatedAt,
    }),
  });

  if (res.ok) {
    const metaAtualizada = await res.json();

    return metaAtualizada;
  } else {
    alert("Erro ao criar a meta, tente novamente.");
    return null;
  }
}

// Função para excluir uma meta
async function excluirMeta(id) {
  const res = await fetch(`/goals/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    alert("Erro ao deletar a meta, tente novamente.");
  }

  return res.ok;
}
