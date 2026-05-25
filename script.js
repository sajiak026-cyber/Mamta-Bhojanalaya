document.addEventListener("DOMContentLoaded", function() {
    var menuItems = Array.from(document.querySelectorAll(".menu-item"));
    menuItems.forEach(function(item) {
        var spans = item.querySelectorAll("span");
        if (spans.length >= 2) {
            var foodName = spans[0].textContent.trim();
            var priceText = spans[1].textContent.trim();
            var prices = priceText.split("/").map(function(part) {
                return part.trim();
            });

            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "item-checkbox";
            checkbox.dataset.food = foodName;

            var label = document.createElement("label");
            label.className = "item-checkbox-label";
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(foodName));

            var itemControlWrap = document.createElement("div");
            itemControlWrap.className = "item-control-wrap";
            itemControlWrap.appendChild(label);

            var priceSpan = document.createElement("span");
            priceSpan.className = "item-price";

            if (prices.length > 1) {
                var priceSelect = document.createElement("select");
                priceSelect.className = "price-select";
                prices.forEach(function(price) {
                    var option = document.createElement("option");
                    option.value = price;
                    option.textContent = price;
                    priceSelect.appendChild(option);
                });
                checkbox.dataset.price = prices[0];
                priceSelect.addEventListener("change", function() {
                    checkbox.dataset.price = this.value;
                    priceSpan.textContent = this.value;
                });
                itemControlWrap.appendChild(priceSelect);
                priceSpan.textContent = prices[0];
            } else {
                checkbox.dataset.price = priceText;
                priceSpan.textContent = priceText;
            }

            item.innerHTML = "";
            item.appendChild(itemControlWrap);
            item.appendChild(priceSpan);
        }
    });

    var placeOrderButton = document.getElementById("place-order");
    var selectedCount = document.getElementById("selected-count");

    function updateSelection() {
        var selectedCheckboxes = document.querySelectorAll(".item-checkbox:checked");
        placeOrderButton.disabled = selectedCheckboxes.length === 0;
        selectedCount.textContent = selectedCheckboxes.length + " item" + (selectedCheckboxes.length === 1 ? " selected" : "s selected");
    }

    document.querySelectorAll(".item-checkbox").forEach(function(checkbox) {
        checkbox.addEventListener("change", updateSelection);
    });

    placeOrderButton.addEventListener("click", function() {
        var selectedCheckboxes = Array.from(document.querySelectorAll(".item-checkbox:checked"));
        if (selectedCheckboxes.length === 0) {
            return;
        }

        var selectedItems = selectedCheckboxes.map(function(checkbox) {
            return checkbox.dataset.food + " (" + checkbox.dataset.price + ")";
        });

        showPopup(selectedItems);
    });

    updateSelection();
});

function showPopup(selectedItems) {
    var popup = document.getElementById("popup");
    var popupText = document.getElementById("popup-text");

    if (Array.isArray(selectedItems)) {
        popupText.innerHTML =
            "Your order has been confirmed for <b>" + selectedItems.length + " item" +
            (selectedItems.length === 1 ? "" : "s") + "</b>:<br>" +
            "<ul>" + selectedItems.map(function(item) {
                return "<li>" + item + "</li>";
            }).join("") + "</ul>";
    } else {
        popupText.innerHTML = "Your order for <b>" + selectedItems + "</b> has been confirmed!";
    }

    popup.style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}