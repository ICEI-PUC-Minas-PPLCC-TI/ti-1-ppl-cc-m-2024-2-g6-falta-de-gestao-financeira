import { updateEntriesList } from "./entries-list.js";

export function searchBar() {
  const searchBar = document.getElementById("search");

  searchBar.addEventListener("blur", async (e) => {
    const userEntries = await getAllUserEntries(user.id);
    const searchKey = formatStringForSearch(e.target.value);

    const filteredEntries = userEntries.filter((entrie) =>
      formatStringForSearch(entrie.label).includes(searchKey)
    );

    updateEntriesList(filteredEntries);
  });
}
