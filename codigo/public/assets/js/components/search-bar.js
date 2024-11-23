import { formatStringForSearch } from "../lib/util.js";
import { updateEntriesList } from "./entries-list.js";
import entry from "../controllers/entry.js";

export function searchBar() {
  const searchBar = document.getElementById("search");

  searchBar.addEventListener("blur", async (e) => {
    const userEntries = await entry.getAllFromUser();
    const searchKey = formatStringForSearch(e.target.value);

    const filteredEntries = userEntries.filter((entry) =>
      formatStringForSearch(entry.label).includes(searchKey)
    );

    updateEntriesList(filteredEntries);
  });
}
