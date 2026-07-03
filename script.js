const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
const dropdown = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("#btn");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amt_msg = document.querySelector(".amt-msg");
const amountInput = document.querySelector(".amount input");
const swapBtn = document.querySelector(".dropdown i");


for (let select of dropdown) {
    for (let currCode in countryList) { 
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// --- LIVE UPDATE LOGIC ---
fromCurr.addEventListener("change", () => updateExchangeRate());
toCurr.addEventListener("change", () => updateExchangeRate());

amountInput.addEventListener("input", () => {
    let amtval = amountInput.value;
    if (amtval !== "" && !isNaN(amtval) && Number(amtval) > 0) {
        updateExchangeRate();
    }
});

// --- SWAP BUTTON LOGIC WITH ANIMATION ---
swapBtn.addEventListener("click", () => {
    let tempCode = fromCurr.value;
    fromCurr.value = toCurr.value;
    toCurr.value = tempCode;

    updateFlag(fromCurr);
    updateFlag(toCurr);
    updateExchangeRate();

    swapBtn.classList.add("rotate");
    setTimeout(() => {
        swapBtn.classList.remove("rotate");
    }, 300);
});

const updateFlag = (element) => {
    let code = element.value;
    let countryCode = countryList[code];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

// --- API CALL WITH ERROR HANDLING ---
const updateExchangeRate = async () => {
    let amtval = amountInput.value;

    if (amtval === "") {
        msg.innerText = "Amount cannot be empty";
        amt_msg.innerText = "Please enter an amount.";
        return;
    }

    if (isNaN(amtval)) {
        msg.innerText = "Invalid input";
        amt_msg.innerText = "Please enter a valid numeric value.";
        return;
    }

    amtval = Number(amtval);

    if (amtval <= 0) {
        msg.innerText = "Invalid amount";
        amt_msg.innerText = "Amount must be greater than zero.";
        return;
    }

    const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;
    
    try {
        msg.innerText = "Fetching rates...";
        let response = await fetch(URL);
        
        if (!response.ok) {
            throw new Error("Network response encountered an error.");
        }
        
        let data = await response.json();
        let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
        let finalAmt = rate * amtval;
        
        msg.innerText = `1 ${fromCurr.value} = ${rate.toFixed(4)} ${toCurr.value}`;
        amt_msg.innerText = `You get ${finalAmt.toFixed(2)} ${toCurr.value} for ${amtval} ${fromCurr.value}`;          
    } catch (error) {
        msg.innerText = "Conversion unavailable";
        amt_msg.innerText = "Could not connect to the service. Please check your network.";
        console.error("Exchange rate fetch error:", error);
    }
};

// --- INITIAL LOAD & CTA EVENTS ---
window.addEventListener("load", () => {
    updateExchangeRate();
});

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

// --- THEME TOGGLE LOGIC ---
const themeToggleBtn = document.querySelector("#theme-toggle");
const themeIcon = themeToggleBtn.querySelector("i");

const savedTheme = localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
document.documentElement.setAttribute("data-theme", savedTheme);
updateThemeIcon(savedTheme);

themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    let newTheme = currentTheme === "dark" ? "light" : "dark";
    
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    if (theme === "dark") {
        themeIcon.className = "fa-solid fa-sun";
    } else {
        themeIcon.className = "fa-solid fa-moon";
    }
}