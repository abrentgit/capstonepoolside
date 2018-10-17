
function main() {
    console.log('loading app.js');
    performLogin();
    getDishes();
    registerGuest();
    addDish();
}

$(main);

// WORKS 

function performLogin() {
    $('.login-form').on('submit', function(event) {
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

//WORKS

function registerGuest() {
    $('.register-form').on('submit', function(event) {
        event.preventDefault();
        console.log('working');

        const name = $('#user-name').val();
        const email = $('#user-email').val();
        const password = $('#user-password').val();
        const pswRepeat = $('#psw-repeat').val();
        
        const session = {
            'name': `${name}`,
            'email': `${email}`,
            'password': `${password}`,
            'pswRepeat': `${pswRepeat}`
        };

        const headers = {
            'Content-Type': 'application/json'
        };
    
        return fetch('http://localhost:8080/guests', { 
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
// HOW WOULD I GET GUEST ID TO CLIENT 

// POST ORDER TIME NON DISHES/BEVS

// function postOrderTime() {
//     $('.delivery-form').on('submit', function(event) {
//         event.preventDefault();
//         console.log('working');
        
//         // ON THIS SUBMIT - GOES TO CHOOSE DISHES PAGE
        
//         // HOW DO I GET VALIDATE GUEST ID WITHOUT QUERY?

//         const token = localStorage.getItem('token');
        
//         const headers = {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//         };

//         const guestId = $('#guest-Id').val();

//         const deliveryDate = $('#date-time').val();

//         const location = $('#location :selected').val();
         
//         const notes = $('#notes').val();

//         const order = {
//             'guests': `${guestId}`,
//             'deliveryDate': `${deliveryDate}`,
//             'location': `${location}`,
//             'notes': `${notes}`
//         }

//         console.log(order);
    
//         return fetch('http://localhost:8080/orders', {
//             method: 'POST',
//             body: JSON.stringify(order),
//             headers: headers
//         }).then(rawResponse => {
//             return rawResponse.json(); 
//         }).then(response => {
//             console.log('request worked', response);
//             return response;
//         }).catch(error => {
//             console.log('an error occured', error);
//         });
//     });  
// }

// WORKS 
// function getMenu() {
//         console.log('working');
        
//         $('#menu-link').on('click', function(event) {
//             event.preventDefault();

//         const token = localStorage.getItem('token');
//         const headers = {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//         };

//         return fetch('http://localhost:8080/menus', {
//             headers: headers
//         }).then(rawResponse => {
//             return rawResponse.json(); 
//         }).then(response => {
//             console.log('request worked', response);
//             return response;
//         }).then(response => {
//             let menu = response.menus[0]; //response object, menu is first index
//             let dishes = menu.dishes; // array of objects, each object is a dish
//             let beverages = menu.beverages; //array of objects

//             let dishArr = dishes.map(({ name, description, price }) => ({name, description, price}));
//             let beverageArr = beverages.map(({ name, description, price }) => ({name, description, price}));
            
//             $.each(dishArr, function () {
//                 $.each(this, function (key, value) {
//                     let dish = value;
//                     $('.dishes').append(`<p> ${dish} </p>`);
//                 });
//              });

//              $.each(beverageArr, function () {
//                  $.each(this, function(key, value) {
//                     let beverage = value;
//                     $('.beverages').append(`<p> ${beverage} </p>`);
//                  });
//              });
//         }).catch(error => {
//             console.log('an error occured', error);
//         });
//     })
// }

function getDishes() {

    const token = localStorage.getItem('token');

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    return fetch('http://localhost:8080/dishes', {
        headers: headers
    }).then(rawResponse => {
        return rawResponse.json();
    }).then(response => {
        let dishesHtml = '';
        console.log(response.dishes);
        response.dishes.forEach(dish => {
            let dishHtml = renderDish(dish); 
            dishesHtml = dishesHtml.concat(dishHtml);
        });
        console.log(dishesHtml);
        console.log('request worked', response.dishes);
        $('.dishes').append(dishesHtml); //display
        return response.dishes;
    }).catch(error => {
        console.log('an error occurred', error);
    });
}

function renderDish(dish) { 
    const orderDiv = `<div class="dish-choice"> <h3> ${dish.name} </h3>
                        <p>${dish.description}</p>
                        <p>$${dish.price}</p>
                        <button class="add-dish-button">Add Dish</a>
                        </button></div>`
    return orderDiv;     
}


function addDish() {

    $('.dishes').on('click','.add-dish-button', function(event) {
        let dishName = $(event.currentTarget).closest('.dish-choice').find('h3').show();
        $('#summary-items').append(`${dishName}`);
    });


    // const token = localStorage.getItem('token');

    // const headers = {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    // };

    // return fetch('http://localhost:8080/dishes/:id', {
    //     headers: headers
    // }).then(rawResponse => {
    //     return rawResponse.json();
    // }).then(response => {
    //     console.log('request- worked', response.dishes);
    //     return response.dishes;
    // }).catch(error => {
    //     console.log('an error occurred', error);
    // });
}



// eventually will be post orders
// function postDishes() {
//     $('#addit').click(function() {
//         let itemId = $('#itemId').val();
//         let itemName = $('#itemName').val();
//         let itemQuantity = $('itemQuantity').val();

//         let order = {
//             'itemId': 'itemId',
//             'itemName': 'itemName',
//             'itemQuantity': 'itemQuantity'
//         };

//         const token = localStorage.getItem('token');
//         const guestId = localStorage.getItem('user_id');
        
//         const headers = {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//             'guests': `${guestId}`
//         };

//         console.log(order);
    
//      return fetch('http://localhost:8080/orders', {
//             method: 'POST',
//             body: JSON.stringify(order),
//             headers: headers
//         }).then(rawResponse => {
//             return rawResponse.json(); 
//         }).then(response => {
//             console.log('request worked', response);
//             return response;
//         }).catch(error => {
//             console.log('an error occured', error);
//         });
//     });  
// }

function dateTimeSelect(time) {
    $('#today').val = new Date();
}


// allow to select dishes

// GET MENU DISHES, how to pass menuId without a query

// function getMenuDishes() {

//     $('#create-button').on('click', function(event) {
//         event.preventDefault();
//         console.log('working');
        
//         const token = localStorage.getItem('token');
//         const headers = {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//             'menuId': `${menuId}`
//         };

//         const menuId = // how do i get the menuID

//         return fetch(`http://localhost:8080/menus/${menuId}/dishes`, {
//             headers: headers
//         }).then(rawResponse => {
//             return rawResponse.json(); 
//         }).then(response => {
//             console.log('request worked', response);
//             return response;
//         }).then(response => {
//             let menu = response.menus[0]; //response object, menu is first index
//             let dishes = menu.dishes; // array of objects, each object is a dish

//             let dishArr = dishes.map(({ name, description, price }) => ({name, description, price}));
            
//             $.each(dishArr, function () {
//                 $.each(this, function (key, value) {
//                     let dish = value;
//                     $('.dishes').append(`<p> ${dish} </p>`);
//                 });
//              });

//              //AFTER ALL APPENDED, NOW CHECK SELECTIONS

//         }).catch(error => {
//             console.log('an error occured', error);
//         });
//     });
// }

// // TESTING THIS ON ORDERDASH.html
// // how to submit this without giving order ID

// function getOrders() {
//     $('.find-order').on('click', event => {
//         event.preventDefault();
//         $('.order-search').hide();
//         console.log('working');

//         const orderId = $('#order-id').val();

//         const token = localStorage.getItem('token');
        
//         const headers = {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//             'OrderId': `${orderId}`
//         };

//     return fetch(`http://localhost:8080/orders/${orderId}`, {
//             headers: headers 
//         }).then(rawResponse => {
//             console.log(rawResponse);
//             return rawResponse.json();
//         }).then(response => {
//             let dishes = response.dishes; //an array of objects that is empty right now
//             let beverages = response.beverages;
//             let location = response.location;
//             let deliveryDate = response.deliveryDate;
//             let parsedDate = new Date (`${deliveryDate}`); // REFORMATS DATE 
//             let notes = response.notes; 

//             $('.order-items').text(`<p> Details: ${location}, ${parsedDate}, ${notes} </p>`); 

//             // if (dishes !== undefined || dishes.length > 0) {
//             //     $('.order-list').append(`${dishes}`);    
//             // }

//             // if (beverages !== undefined || beverages.length > 0) {
//             //     $('.order-list').append(`${beverages}`);
//             // }
            
//             // // display the order sent
//             console.log('request worked', response);
//             return response;
//         }).catch(error => {
//             console.log('an error occured', error);
//         });
//     });

// }

// THIS TESTING ON 
// function addDish() {
//     // HAS TO LOAD DISHES / GET AVAILABLE DISHES FROM DB
//     // GET REQUEST FIRST RIGHT???


//     // $('#add-dish').on('click', function() 
//     //    // get dish name from object
//     //     let selected = $('input[type=checkbox]:checked').map(function(_, item) {
//     //         return $(item).val();
//     //     }).get();
        
//     //     $('.dish-ordered').append(`<ul>${selected}</ul>`);

//     // //pass orderId 
//     // //const orderId = $('#order-id').val();
//     // // pass dish_id 
//         const token = localStorage.getItem('token');
        
//         const headers = {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//             'OrderId': `${orderId}`
//         };


//     return fetch(`http://localhost:8080/orders/${orderId}/dishes/${dishId}`, {
//             method: 'PUT',
//             headers: headers
//         }).then(rawResponse => {
//             return rawResponse.json(); 
//         }).then(response => {
//             console.log('request worked', response);
//             return response;
//         }).catch(error => {
//             console.log('an error occured', error);
//         });    
//     });  
// }
// }

