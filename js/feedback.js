function openFeedbackSheet() {
  closeAllSheets();
  lockBodyScroll();

  const sheet = document.createElement("div");

  sheet.className = "shop-menu active";
  sheet.id = "feedback-sheet";

  sheet.innerHTML = `
    <div class="shop-menu-card">

      <div class="shop-menu-handle"></div>

      <div class="shop-menu-title">
        ${t("feedback")}
      </div>

      <p class="shop-menu-note">
        ${t("feedbackDesc")}
      </p>

      <select id="feedback-type">
        <option value="suggestion">
          ${t("feedbackSuggestion") || "Suggestion"}
        </option>

        <option value="wrong-info">
          ${t("feedbackWrongInfo") || "Wrong Information"}
        </option>

        <option value="new-place">
          ${t("feedbackNewPlace") || "Recommend New Place"}
        </option>

        <option value="bug">
          ${t("feedbackBug") || "Bug Report"}
        </option>
      </select>

      <textarea
        id="feedback-message"
        placeholder="${t("feedbackPlaceholder")}"
      ></textarea>

      <button
        class="shop-save-btn"
        onclick="submitFeedback()"
      >
        ${t("sendFeedback")}
      </button>

      <button onclick="closeFeedbackSheet()">
        ${t("cancel")}
      </button>

    </div>
  `;

  document.body.appendChild(sheet);
}

function closeFeedbackSheet(force = false) {
  const sheet = document.getElementById("feedback-sheet");

  if (sheet) {
    sheet.remove();
  }

  if (!force) {
    unlockBodyScroll();
  }
}

function submitFeedback() {
  const type = document.getElementById("feedback-type").value;
  const message = document.getElementById("feedback-message").value.trim();

  console.log({
    type,
    message
  });

  alert(t("feedbackSubmitted") || "Feedback submitted!");

  closeFeedbackSheet();
}