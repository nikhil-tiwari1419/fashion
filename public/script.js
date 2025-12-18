async function generateDesign() {
  const loading = document.getElementById("loading");
  const result = document.getElementById("result");
  const stores = document.getElementById("stores");

  loading.classList.remove("hidden");
  result.innerText = "";
  stores.innerHTML = "";

  const gender = document.getElementById("gender").value;
  const type = document.getElementById("type").value;
  const color = document.getElementById("color").value;
  const userPrompt = document.getElementById("userPrompt").value.trim();

  let payload = {};
  if (userPrompt) payload.prompt = userPrompt;
  else {
    if (gender === "Select.." || type === "Select.." || color === "Select..") {
      loading.classList.add("hidden");
      result.innerText = "Please select all options or write your fashion idea.";
      return;
    }
    payload = { gender, type, color };
  }

  try {
    const response = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
loading.classList.add("hidden");

// ⛔ STOP HERE if NOT clothing related
if (!data.isClothing) {
  result.innerText = "⚠️ This generator only supports clothing & fashion designs.";
  stores.innerHTML = "";
  return;
}

// ✅ Only runs if clothing-related
result.innerText = data.design || "No design generated.";

const linkGender = data.links.gender || "fashion";
const linkType = data.links.type || "clothing";
const linkColor = data.links.color || "";

stores.innerHTML = `
  <h4>Available Online</h4>
  <ul>
    <li><a href="https://www.myntra.com/${linkGender}-${linkType}" target="_blank">Myntra</a> — ₹499 to ₹2,499</li>
    <li><a href="https://www.ajio.com/shop/${linkType}" target="_blank">Ajio</a> — ₹399 to ₹2,999</li>
    <li><a href="https://www.amazon.in/s?k=${linkGender}+${linkType}+${linkColor}" target="_blank">Amazon Fashion</a> — ₹299 to ₹3,499</li>
    <li><a href="https://www.flipkart.com/clothing-and-accessories/pr?sid=clo" target="_blank">Flipkart</a> — ₹199 to ₹2,999</li>
  </ul>
`;

  } catch (error) {
    loading.classList.add("hidden");
    result.innerText = "Something went wrong. Please try again.";
  }
}

// Load saved theme on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    document.querySelector(".dark-toggle").textContent = "☀️";
  }
});

function toggleDarkMode() {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");

  document.querySelector(".dark-toggle").textContent = isDark ? "☀️" : "🌙";
}

