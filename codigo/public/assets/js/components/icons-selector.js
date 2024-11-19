import { ICONS_NAMES } from "../lib/constants.js";

export function iconsSelector() {
  const iconsLists = document.querySelectorAll(".form__field__icons");

  iconsLists.forEach((selector) => {
    const id = selector.getAttribute("data-for");

    selector.insertAdjacentHTML(
      "beforeend",
      `
      <li class="form__field__icons__item">
        <input
          class="form__field__icons__item__input"
          type="radio"
          name="icon"
          data-icon-name="none"
          id="${id}-icon--none"
          checked
        />
        <img
          class="form__field__icons__item__image"
          src="assets/img/icon/selectable/none.svg"            
          alt="icon-none"
        />
      </li>
      `
    );

    ICONS_NAMES.forEach((icon) => {
      selector.insertAdjacentHTML(
        "beforeend",
        `
        <li class="form__field__icons__item">
          <input
            class="form__field__icons__item__input"
            type="radio"
            name="icon"
            data-icon-name="${icon}"
            id="${id}-icon--${icon}"
          />
          <img
            class="form__field__icons__item__image"
            src="assets/img/icon/selectable/${icon}.svg"            
            alt="icon-${icon}"
          />
        </li>
        `
      );
    });
  });
}
