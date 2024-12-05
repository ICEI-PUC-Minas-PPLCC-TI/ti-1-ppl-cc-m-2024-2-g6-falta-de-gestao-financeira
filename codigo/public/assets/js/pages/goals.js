import { updateCategoriesList } from "../components/categories-list.js";
import { createCategoryPopup } from "../components/create-category-popup.js";
import { createGoalPopup } from "../components/create-goal-popup.js";
import { editCategoryPopup } from "../components/edit-category-popup.js";
import { editGoalPopup } from "../components/edit-goal-popup.js";
import { updateGoalsList } from "../components/goals-list.js";
import { iconsSelector } from "../components/icons-selector.js";
import { logoutButton } from "../components/logout-button.js";
import { popups } from "../components/popups.js";
import { auth } from "../lib/auth.js";

const user = auth();

if (!user) {
  window.location.replace("./login.html");
}

popups();
iconsSelector();
logoutButton();

createGoalPopup();
editGoalPopup();

createCategoryPopup();
editCategoryPopup();

updateGoalsList();

updateCategoriesList();
