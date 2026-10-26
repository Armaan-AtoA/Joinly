(function () {
  const params = new URLSearchParams(location.search);
  const code = params.get("joinlyCode");
  if (!code) return;

  function fillAndSubmit() {
    // ClassPoint's class-code box is usually the first visible text/number input on the join page.
    const input = document.querySelector(
      'input[type="text"], input[type="tel"], input[type="number"], input:not([type])'
    );
    if (!input) return false;

    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    setter.call(input, code);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));

    // Try pressing Enter, which ClassPoint's join box accepts.
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    input.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", bubbles: true }));

    // Fallback: click an obvious join/submit button if Enter didn't move things along.
    const btn = Array.from(document.querySelectorAll("button")).find((b) =>
      /join/i.test(b.textContent || "")
    );
    if (btn) btn.click();

    return true;
  }

  let attempts = 0;
  const timer = setInterval(() => {
    attempts += 1;
    if (fillAndSubmit() || attempts > 40) clearInterval(timer);
  }, 250);
})();
