$(document).ready(function () {
    const id = getCurrentId();
    const url = "http://localhost:8080/api/products/details/" + id;
    const container = $('#productContainer');

    $.ajax({
        type: "GET",
        url: url,
        cors: true,
        headers: {},
        success: (product) => {
            console.log(product);
            container.append(displayProduct(product));
        },
        error: () => {
            console.log('damn')
        }
    });
});

function getCurrentId() {
    const url = window.location.href;
    urlObject = new URL(url);
    return urlObject.searchParams.get('id');
};
const token = sessionStorage.getItem('token');
function displayProduct(product) {
    if (!token) {
        const content = $(`
        <div class="content d-flex justify-content-center" id="productContainer">
            <div class="col-lg-6 col-md-8 col-sm-12">
                <div class="row">                   
                    <div class="card border border-3 ">
                            <img class="card-img-top p-2" src="${product.imageUrl}" alt="Ein Bild von ${product.name}">
                                <div class="card-body">
                                    <h1 class="card-title text-center">${product.name}</h4>
                                    <p class="card-text">${product.description}</p>
                                    <p>Type: ${product.type}</p>
                                    <p>Verfügbar: ${product.quantity}</p>
                                    <p>Preis: ${product.price}€</p>
                                    <div class="d-flex justify-content-between">
                                    <a href="./produkte.html" class="btn btn-light" role="button">Zurück</a>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
        );
        return content;
    } else {
        const content = $(`
        <div class="content d-flex justify-content-center" id="productContainer">
            <div class="col-lg-6 col-md-8 col-sm-12">
                <div class="row">                   
                    <div class="card border border-3 ">
                            <img class="card-img-top p-2" src="${product.imageUrl}" alt="Ein Bild von ${product.name}">
                                <div class="card-body">
                                    <h1 class="card-title text-center">${product.name}</h4>
                                    <p class="card-text">${product.description}</p>
                                    <p>Type: ${product.type}</p>
                                    <p>Verfügbar: ${product.quantity}</p>
                                    <p>Preis: ${product.price}€</p>
                                    <div class="d-flex justify-content-between">
                                    <a href="./produkte.html" class="btn btn-light" role="button">Zurück</a>
                                    <button type="button" id="sendRequestCart" class="btn btn-secondary" onclick="sendRequest()">in Warenkorb</button>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
        );
        return content;
    }

};

function sendRequest() {
    var payloadData = parseJwt(token)
    var userId = payloadData.id

    $.ajax({
        url: `http://localhost:8080/api/carts/get${userId}`,
        type: "GET",
        cors: true,
        contentType: "application/json",
        success: (response) => {
            console.log(response)
            //cartID = cart.id

        },
        error: function (xhr, status, error) {
            console.log("Status: " + status);
            console.log("Error: " + error);
            console.log(xhr.responseText);
        }
    });

    //wenn cart with user existiert dann update die kart mit put
    //daran noch arbeiten, dass sich menge und amount vergrößern
    if (response == 200) {
        $.ajax({
            url: `http://localhost:8080/api/carts/update${userId}`,
            type: "PUT",
            cors: true,
            contentType: "application/json",
            success: (response) => {
                // After successful deletion, reload the list of users
                console.log("Cart erfolgreich updated:" + response)
            },
            error: function (xhr, status, error) {
                console.log("Status: " + status);
                console.log("Error: " + error);
                console.log(xhr.responseText);
            }
        });

        //sonst kreiere eine neue Cart mit Post
    } else {

        //beim erstellen ist der amount zuerst immer 1, amount gehört sowieso in zwischentabelle
        var amount = 1
        var user_id = userId

        //get product id from url http://127.0.0.1:5501/Frontend/detailseite_produkte.html?id=2
        var currentURL = window.location.href;
        console.log(currentURL);
        var lastChar = currentURL.charAt(inputString.length - 1);
        var product_id = parseInt(lastChar);

        const newCart = {
            "total": "",
            "amount": amount,
            "orderstatus": "",
            "user_id": user_id,
            "product_id": product_id,

        }
        $.ajax({
            url: `http://localhost:8080/api/cart`,
            type: "POST",
            cors: true,
            contentType: "application/json",
            data: JSON.stringify(newCart),
            success: (success) => {
                console.log("Cart erfolgreich angelegt:" + success)
            },
            error: function (xhr, status, error) {
                console.log("Status: " + status);
                console.log("Error: " + error);
                console.log(xhr.responseText);
            }
        });

    };


    function parseJwt(token) {
        // Step 1: Split the token into its three parts: header, payload, and signature
        var base64Url = token.split('.')[1];

        // Step 2: Replace characters that are not URL-safe
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        // Step 3: Decode the base64-encoded payload
        var jsonPayload = decodeURIComponent(
            //Base64 is a binary-to-text encoding scheme
            window.atob(base64)  // Step 4: Decode the base64 to binary
                .split('')
                .map(function (c) {
                    // Step 5: Convert binary to hexadecimal representation
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );

        // Step 6: Parse the JSON payload into a JavaScript object
        return JSON.parse(jsonPayload);
    }

    var payloadData = parseJwt(token);

    console.log(payloadData);
    console.log(payloadData.id);      // 1
    console.log(payloadData.sub);     // "t"
    console.log(payloadData.admin);   // true
    console.log(payloadData.exp);     // 1696929729
}
