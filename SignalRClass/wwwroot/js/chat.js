"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

document.getElementById("sendButton").disabled = true;

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

var needConnectionMessage = true;
document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;

    if (needConnectionMessage) {
        connection.invoke("CustomOnConnectedAsync", user).catch(function (err) {
            return console.error(err.toString());
        });

        needConnectionMessage = false;
    }
    
    connection.invoke("SendVote", message).catch(function (err) {
        return console.error(err.toString());
    });

    event.preventDefault();
});

connection.on("ReceiveMessage", function (user, message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = user + " says " + msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});

connection.on("ReceiveVote", function (vote) {
    console.log(vote);
});

connection.on("UserConnected", function (user) {    
    var encodedMsg = user + " connected";
    var li = document.createElement("li");
    li.style.color = "green";
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});

connection.on("UserDisconnected", function (user) {
    var encodedMsg = user + " disconnected";
    var li = document.createElement("li");
    li.style.color = "red";
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});