
function main() {
    console.log('loading app.js');
    performLogin();
    postOrderTime();
    getMenu();
}
$(main);

// ADD SAVE OF TOKEN

function performLogin() {
    $('.signup-form').on('submit', function(event) {
        event.preventDefault();
        console.log('working');

        const email = $('#user-email').val();
        const password = $('#user-password').val();
        
        const session = {
            'email': `${email}`,
            'password': `${password}`,
        };

        const headers = {
            'Content-Type': 'application/json'
        };
    
        return fetch('http://localhost:8080/login', { 
            method: 'POST',
            body: JSON.stringify(session),
            headers: headers
        }).then(rawResponse => {
            return rawResponse.json(); 
        }).then(response => {
            console.log('request worked', response);
            const { authToken } = response;
            localStorage.setItem('token', authToken);
            return response;
        }).catch(error => {
            console.log('an error occured', error);
        });
    });
}

// WORKS BUT GUEST ID HAS TO BE SUBMITTED
// ASK RODRIGO HOW WOULD I GET GUEST ID TO CLIENT 

// POST ORDER TIME NON DISHES/BEVS

function postOrderTime() {
    $('.delivery-form').on('submit', function(event) {
        event.preventDefault();
        console.log('working');

        const token = localStorage.getItem('token');
        
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        const guestId = $('#guest-Id').val();

        const deliveryDate = $('#date-time').val();

        const location = $('#location :selected').val();
         
        const notes = $('#notes').val();

        const order = {
            'guests': `${guestId}`,
            'deliveryDate': `${deliveryDate}`,
            'location': `${location}`,
            'notes': `${notes}`
        }

        console.log(order);
    
        return fetch('http://localhost:8080/orders', {
            method: 'POST',
            body: JSON.stringify(order),
            headers: headers
        }).then(rawResponse => {
            return rawResponse.json(); 
        }).then(response => {
            console.log('request worked', response);
            return response;
        }).catch(error => {
            console.log('an error occured', error);
        });
    });  
}

// SELECT DISHES
// PUT DISHES 

function getMenu() {
    $('#menu-button').on('click', function(event) {
        event.preventDefault();
        console.log('working');

        // when menu button gets hit, append dishes to class
        // dish-items

        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        return fetch('http://localhost:8080/menus', {
            headers: headers
        }).then(rawResponse => {
            return rawResponse.json(); 
        }).then(response => {
            console.log('request worked', response);
            return response;
        }).then(response => {
            let menu = response.menus[0]; //response object, menu is first index
            let dishes = menu.dishes; // array of objects, each object is a dish
            let beverages = menu.beverages; //array of objects

            let dishArr = dishes.map(({ name, description, price }) => ({name, description, price}));
            let beverageArr = beverages.map(({ name, description, price }) => ({name, description, price}));
            
            $.each(dishArr, function () {
                $.each(this, function (key, value) {
                    let dish = value;
                    $('.dishes').append(`<p> ${dish} </p>`);
                });
             });

             $.each(beverageArr, function () {
                 $.each(this, function(key, value) {
                    let beverage = value; 
                    $('.beverages').append(`<p> ${beverage} </p>`)
                 });
             });
        }).catch(error => {
            console.log('an error occured', error);
        });
    });
}


// GET DISHES 



// GET BEVS












// GET ORDERS

// function getOrders() {
//     $('.view-order').on('click', event => {
//         event.preventDefault();
//         console.log('working');

//         const token = localStorage.getItem('token');
//         const headers = {
//             'Authentication': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//         };

//     return fetch('http://localhost:8080/orders', {
//             headers: headers 
//         }).then(rawResponse => {
//             console.log(rawResponse);
//             return rawResponse.json();
//         }).then(response => {
//             console.log('request worked', response);
//             return response;
//         }).catch(error => {
//             console.log('an error occured', error);
//         });
//     });
// }


