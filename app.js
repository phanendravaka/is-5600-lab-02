/* add your code here */

// app.js

document.addEventListener("DOMContentLoaded", () => {
  // Parse data from included JS files
  const stocksData = JSON.parse(stockContent);
  const userData = JSON.parse(userContent);

  // Reference UI elements
  const deleteButton = document.querySelector("#deleteButton");
  const saveButton = document.querySelector("#saveButton");

  // Apply colorful background & mild UI enhancements
  document.body.style.background = "linear-gradient(135deg, #eef2f3, #d9e4f5)";
  document.body.style.fontFamily = "Segoe UI, sans-serif";
  document.querySelector("h1").style.color = "#003366";

  // --- Functions ---

  // Generate User List
  function generateUserList(users, stocks) {
    const userList = document.querySelector(".user-list");
    userList.innerHTML = ""; // Clear existing list

    users.map(({ user, id }) => {
      const listItem = document.createElement("li");
      listItem.innerText = `${user.lastname}, ${user.firstname}`;
      listItem.setAttribute("id", id);
      listItem.style.cursor = "pointer";
      listItem.style.padding = "5px 10px";
      listItem.style.borderBottom = "1px solid #ccc";
      listItem.addEventListener("mouseover", () => {
        listItem.style.background = "#f1f8ff";
      });
      listItem.addEventListener("mouseout", () => {
        listItem.style.background = "transparent";
      });
      userList.appendChild(listItem);
    });

    // Register the event listener on the list
    userList.addEventListener("click", (event) =>
      handleUserListClick(event, userData, stocksData)
    );
  }

  // Handle user click
  function handleUserListClick(event, users, stocks) {
    const userId = event.target.id;
    const user = users.find((user) => user.id == userId);
    populateForm(user);
    renderPortfolio(user, stocks);
  }

  // Populate the user form
  function populateForm(data) {
    const { user, id } = data;
    document.querySelector("#userID").value = id;
    document.querySelector("#firstname").value = user.firstname;
    document.querySelector("#lastname").value = user.lastname;
    document.querySelector("#address").value = user.address;
    document.querySelector("#city").value = user.city;
    document.querySelector("#email").value = user.email;
  }

  // Render user portfolio
  function renderPortfolio(user, stocks) {
    const { portfolio } = user;
    const portfolioDetails = document.querySelector(".portfolio-list");
    portfolioDetails.innerHTML = "";

    portfolio.map(({ symbol, owned }) => {
      const container = document.createElement("div");
      container.style.display = "flex";
      container.style.alignItems = "center";
      container.style.justifyContent = "space-between";
      container.style.padding = "5px";
      container.style.border = "1px solid #ddd";
      container.style.borderRadius = "5px";
      container.style.marginBottom = "5px";
      container.style.background = "#fff";

      const symbolEl = document.createElement("p");
      symbolEl.innerText = symbol;
      const sharesEl = document.createElement("p");
      sharesEl.innerText = `Shares: ${owned}`;
      const actionEl = document.createElement("button");
      actionEl.innerText = "View";
      actionEl.style.background = "#007BFF";
      actionEl.style.color = "white";
      actionEl.style.border = "none";
      actionEl.style.padding = "5px 10px";
      actionEl.style.borderRadius = "4px";
      actionEl.style.cursor = "pointer";
      actionEl.setAttribute("id", symbol);

      container.appendChild(symbolEl);
      container.appendChild(sharesEl);
      container.appendChild(actionEl);
      portfolioDetails.appendChild(container);
    });

    // Register event listener for stock view buttons
    portfolioDetails.addEventListener("click", (event) => {
      if (event.target.tagName === "BUTTON") {
        viewStock(event.target.id, stocks);
      }
    });
  }

  // View stock details
  function viewStock(symbol, stocks) {
    const stockArea = document.querySelector(".stock-form");
    if (stockArea) {
      const stock = stocks.find((s) => s.symbol == symbol);

      document.querySelector("#stockName").textContent = stock.name;
      document.querySelector("#stockSector").textContent = stock.sector;
      document.querySelector("#stockIndustry").textContent = stock.subIndustry;
      document.querySelector("#stockAddress").textContent = stock.address;
      document.querySelector("#logo").src = `logos/${symbol}.svg`;
    }
  }

  // Delete user
  deleteButton.addEventListener("click", (event) => {
    event.preventDefault();
    const userId = document.querySelector("#userID").value;
    const userIndex = userData.findIndex((user) => user.id == userId);
    userData.splice(userIndex, 1);
    generateUserList(userData, stocksData);
    document.querySelector(".portfolio-list").innerHTML = "";
  });

  // Save user changes
  saveButton.addEventListener("click", (event) => {
    event.preventDefault();
    const id = document.querySelector("#userID").value;

    for (let i = 0; i < userData.length; i++) {
      if (userData[i].id == id) {
        userData[i].user.firstname =
          document.querySelector("#firstname").value;
        userData[i].user.lastname = document.querySelector("#lastname").value;
        userData[i].user.address = document.querySelector("#address").value;
        userData[i].user.city = document.querySelector("#city").value;
        userData[i].user.email = document.querySelector("#email").value;
        generateUserList(userData, stocksData);
      }
    }
  });

  // Initial load
  generateUserList(userData, stocksData);
});
