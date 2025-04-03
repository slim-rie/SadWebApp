// script.js
document
  .getElementById("add-item-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from refreshing the page

    // Retrieve input values
    const itemName = document.getElementById("item-name").value;
    const itemImage = document.getElementById("item-image").value;
    const itemDescription = document.getElementById("item-description").value;

    // Create a new item element
    const itemContainer = document.createElement("div");
    itemContainer.classList.add("box");

    itemContainer.innerHTML = `
      <img src="${itemImage}" alt="${itemName}">
      <h3>${itemName}</h3>
      <p>${itemDescription}</p>
      <div class="box-actions">
        <button class="btn btn-buy">Buy now</button>
        <button class="btn btn-option">Option</button>
      </div>
    `;

    // Append the new item to the items container
    document.getElementById("items-container").appendChild(itemContainer);

    // Clear the form inputs
    document.getElementById("add-item-form").reset();
  });
