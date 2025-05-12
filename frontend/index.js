fetch("https://deadzedrevival.onrender.com/api/status")

  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(data => {
    document.getElementById("status").textContent = data.message;
  })
  .catch(error => {
    console.error("Error contacting backend:", error);
    document.getElementById("status").textContent = "Error contacting backend: " + error.message;
  });
