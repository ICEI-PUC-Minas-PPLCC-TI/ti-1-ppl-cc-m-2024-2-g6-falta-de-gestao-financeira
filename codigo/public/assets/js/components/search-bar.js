import { formatStringForSearch } from "../lib/util.js";
import { updateEntriesList } from "./entries-list.js";
import entrie from "../controllers/entrie.js";

export function searchBar() {
  const searchBar = document.getElementById("search");

  searchBar.addEventListener("blur", async (e) => {
    const userEntries = await entrie.getAllFromUser();
    const searchKey = formatStringForSearch(e.target.value);

    const filteredEntries = userEntries.filter((entrie) =>
      formatStringForSearch(entrie.label).includes(searchKey)
    );

    updateEntriesList(filteredEntries);
  });
}
