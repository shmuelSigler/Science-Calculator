

advancedKeys.forEach(function (key) {
    let newButton = document.createElement("button");
    newButton.classList.add("operator", "advanced", "science", key);        //add all the classes to the buttons
    newButton.innerText = key;
    calculator__keys.appendChild(newButton);
    console.log("calculator__keys: ", calculator__keys);
});

