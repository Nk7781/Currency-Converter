const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies"
const dropdown = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("#btn");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amt_msg= document.querySelector(".amt-msg");
for (let select of dropdown) {
    for (currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        select.append(newOption);
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

const updateFlag = (element) => {
    let code = element.value;
    let countryCode = countryList[code];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
}

const updateExchnageRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtval = amount.value;
    if (amtval === "") {
            alert("Please enter an amount!");
            return;
        }

    if (isNaN(amtval)) {
        alert("Please enter a valid number!");
        return;
    }

    amtval = Number(amtval);

    if (amtval <= 0) {
        alert("Amount must be greater than 0!");
        return;
    }
    const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`
    let response = await fetch(URL);
    let data = await response.json();
    let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
    let finalAmt = rate * amtval;
    msg.innerText = `${1} ${fromCurr.value} = ${rate.toFixed(2)} ${toCurr.value}`;
    amt_msg.innerText = `You get ${finalAmt.toFixed(2)} ${toCurr.value} for ${amtval} ${fromCurr.value}`;          

}

window.addEventListener("load", () => {
    updateExchnageRate();
});

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchnageRate();
});
