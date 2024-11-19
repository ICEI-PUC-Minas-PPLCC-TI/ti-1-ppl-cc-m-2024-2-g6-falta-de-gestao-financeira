import { auth, createLogoutEvent } from "./auth.js";
import { createCategoryEvents } from "./categories.js";
import {
  createEntriesEvents,
  getAllUserEntries,
  updateCreateEntriesSelectCategories,
  updateEditEntriesSelectCategories,
  updateUserEntries,
} from "./entries.js";
import { createIconsSelector } from "./icons-selector.js";
import { createPopupEvents } from "./popup.js";

createLogoutEvent();

const user = auth();

if (!user) {
  window.location.replace("./login.html");
}

createPopupEvents();
createIconsSelector();

createCategoryEvents();
createEntriesEvents();

updateCreateEntriesSelectCategories();
updateEditEntriesSelectCategories();

updateUserEntries(await getAllUserEntries(user.id));
