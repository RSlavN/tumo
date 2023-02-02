const button = document.getElementById('button');

function getInfo(){
    const registrationInfo = {
        name: document.getElementById("name").value,
        surname: document.getElementById("surname").value,
        password: document.getElementById("password").value,
        email: document.getElementById("email").value,
        age: document.getElementById("age").value,
    };

    fetch("/api/registration", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(registrationInfo)
    });
}

button.addEventListener('click', getInfo)