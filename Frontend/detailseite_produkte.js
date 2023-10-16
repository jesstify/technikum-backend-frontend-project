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
    var payloadData = parseJwt(token);
    var userId = payloadData.id;

    // First AJAX request to check if a cart with the user exists
    $.ajax({
        url: `http://localhost:8080/api/carts/get${userId}`,
        type: "GET",
        cors: true,
        contentType: "application/json",
        success: function (response) {
            console.log(response);

        },
        error: function (xhr, status, error) {
            console.log("Status: " + status);
            console.log("Error: " + error);
            console.log(xhr.responseText);
        }
    });
}

function sendRequest() {
    // Get product_id from the URL
    var currentURL = window.location.href;
    var userId = parseInt(payloadData.id);
    //var userId = payloadData.id;
    console.log("UserId: " + userId)

    //is Added is here always true, because you cannot remove product, if you click in warenkorb geben, it either adds new product or increases it by one
    var isAdded = true
    var lastChar = currentURL.charAt(currentURL.length - 1);
    var productId = parseInt(lastChar);
    //var productId = lastChar;
    console.log("ProductId: " + productId)

    var dataForCart = {
        //userId: userId,
        productId: productId,
        isAdded: isAdded
    }
    console.log("dataForCart: " + JSON.stringify(dataForCart));

    $.ajax({
        url: `http://localhost:8080/api/carts/${userId}/${productId}/${isAdded}`,
        type: "PUT",
        cors: true,
        contentType: "application/json",
        //data: JSON.stringify(dataForCart), // Convert the data object to a JSON string
        success: function (response) {
            window.alert("Product added to Warenkorb successfully!");
            console.log("Cart erfolgreich updated/kreiert:" + response);
        },
        error: (error) => {
            console.log("Error: " + error);
        }
    });
}


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

// console.log(payloadData);
// console.log(payloadData.id);      // 1
// console.log(payloadData.sub);     // "t"
// console.log(payloadData.admin);   // true
// console.log(payloadData.exp);     // 1696929729

