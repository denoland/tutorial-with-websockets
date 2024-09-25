// Initialize WebSocket connection
const myUsername = prompt("Please enter your name") || "Anonymous";
const socket = new WebSocket(
  `ws://localhost:8080/start_web_socket?username=${myUsername}`,
);

// Handle WebSocket messages
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  switch (data.event) {
    case "update-users":
      updateUserList(data.usernames);
      break;

    case "send-message":
      addMessage(data.username, data.message);
      break;
  }
};

// Update user list in the DOM
function updateUserList(usernames) {
  const userList = document.getElementById("users");
  userList.innerHTML = ""; // Clear existing list

  for (const username of usernames) {
    const listItem = document.createElement("li");
    listItem.textContent = username;
    userList.appendChild(listItem);
  }
}

// Add a new message to the conversation
function addMessage(username, message) {
  const conversation = document.getElementById("conversation");
  const messageDiv = document.createElement("div");
  messageDiv.innerHTML = `<span>${username}</span> ${message}`;
  conversation.prepend(messageDiv);
}

// Focus input field on page load to make typing instant
const inputElement = document.getElementById("data");
inputElement.focus();

// On form submit, send message to server and empty the input field
const form = document.getElementById("form");

form.onsubmit = (e) => {
  e.preventDefault();
  const message = inputElement.value;
  inputElement.value = "";
  socket.send(JSON.stringify({ event: "send-message", message }));
};
