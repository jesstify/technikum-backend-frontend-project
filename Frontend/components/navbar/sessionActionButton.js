renderSessionButton();

function renderSessionButton() {
    const token = sessionStorage.getItem('token');

    const buttonContainer = $("#sessionActionButton");
    buttonContainer.empty();

    let button;

    if (!token) {
        button = $(
            `<div class="test">
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Login
                </button>
            </div>`);
        buttonContainer.append(button);
    } else {
        button = $(
            `<div class="test">
                <button type="button" class="btn btn-primary" onclick="logout(event)">
                    Logout
                </button>
            </div>`
        );
        buttonContainer.append(button);
        button = $(
            `<button type="button" class="btn btn-primary" data-bs-toggle="modal"
                data-bs-target="#openCartModalButton">
                    Warenkorb
            </button>`
        );
        buttonContainer.append(button);
    }
}

function logout(event) {
    event.preventDefault();
    sessionStorage.removeItem('token');
    location.reload();
}