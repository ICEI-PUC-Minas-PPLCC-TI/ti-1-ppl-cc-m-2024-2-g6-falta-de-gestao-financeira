import { updateUserCategoriesList } from "../components/categories-list.js";
import { createCategoryPopup } from "../components/create-category-popup.js";
import { createEntriePopup } from "../components/create-entrie-popup.js";
import { editCategoryPopup } from "../components/edit-category-popup.js";
import { editEntriePopup } from "../components/edit-entrie-popup.js";
import { updateEntriesList } from "../components/entries-list.js";
import { iconsSelector } from "../components/icons-selector.js";
import { logoutButton } from "../components/logout-button.js";
import { popups } from "../components/popups.js";
import { searchBar } from "../components/search-bar.js";
import entrie from "../controllers/entrie.js";
import { auth } from "../lib/auth.js";

const user = auth();

if (!user) {
  window.location.replace("./login.html");
}

popups();
iconsSelector();
logoutButton();
searchBar();

createCategoryPopup();
editCategoryPopup();

createEntriePopup();
editEntriePopup();

updateUserCategoriesList();
updateEntriesList(await entrie.getAllFromUser());
