const optionCards = document.querySelectorAll(".option-card");

optionCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      return;
    }

    const requestLink = card.querySelector("a[href*='post-request/post-request.html']");
    if (requestLink) {
      window.location.href = requestLink.href;
    }
  });
});
