import { auth } from "../lib/auth.js";

import { logoutButton } from "../components/logout-button.js";
import { searchBar } from "../components/search-bar.js";
import { popups } from "../components/popups.js";
import { iconsSelector } from "../components/icons-selector.js";

import { updateCategoriesList } from "../components/categories-list.js";
import { createCategoryPopup } from "../components/create-category-popup.js";
import { editCategoryPopup } from "../components/edit-category-popup.js";

import { updateEntriesList } from "../components/entries-list.js";
import { createEntryPopup } from "../components/create-entry-popup.js";
import { editEntryPopup } from "../components/edit-entry-popup.js";

import { updateRecurringList } from "../components/recurring-list.js";
import { createRecurrentPopup } from "../components/create-recurrent-popup.js";
import { editRecurrentPopup } from "../components/edit-recurrent-popup.js";

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

createEntryPopup();
editEntryPopup();

createRecurrentPopup();
editRecurrentPopup();

updateCategoriesList();
updateEntriesList();
updateRecurringList();
