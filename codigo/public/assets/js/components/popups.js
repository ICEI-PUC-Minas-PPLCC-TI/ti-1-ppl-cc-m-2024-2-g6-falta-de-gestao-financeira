export function popups() {
  document.querySelectorAll(".open-popup").forEach((button) => {
    button.addEventListener("click", (e) => {
      const popupId = e.currentTarget.getAttribute("data-popup-id");

      if (!popupId) return;

      const popup = document.getElementById(popupId);

      if (!popup) return;

      popup.showModal();
    });
  });

  document.querySelectorAll(".close-popup").forEach((button) => {
    button.addEventListener("click", (e) => {
      const popupId = e.currentTarget.getAttribute("data-popup-id");

      if (!popupId) return;

      const popup = document.getElementById(popupId);

      if (!popup) return;

      popup.close();
    });
  });
}
