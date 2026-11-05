const checkBox = document.getElementById("preTax");

checkBox.addEventListener("change", (event) => {
    if (event.target.checked) {
        const priceboxs = document.querySelectorAll("#posttax");
        for (let pricebox of priceboxs) {
            pricebox.style.display = "none";
        }
    }
    else {
        const priceboxs = document.querySelectorAll("#posttax");
        for (let pricebox of priceboxs) {
            pricebox.style.display = "inline";
        }
    }
})