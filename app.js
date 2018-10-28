
function main() {
    console.log('loading app.js');
    performLogin();
    getDishes();
    registerGuest();
    addDish();
    dateSelect();
    deleteDish();
    renderCart();
    postOrder();
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
            alert('logged in');
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
let dishes = [];

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
        dishes = response.dishes;
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
                        <p class="dish-price">$${dish.price}</p>
                        <button data-dish="${dish._id}" 
                        class="add-dish-button">Add Dish</button>
                        <button data-dish="${dish._id}" class="delete-dish-button">Delete Dish</button>
                        </div>`
    return orderDiv;     
}


let cart = [];
let cartTotal = ''; 

function addDish() {

    $('.dishes').on('click','.add-dish-button', function(event) {
        let dishId = $(event.currentTarget).data('dish');
        console.log(dishId);
  
        const itemPresent = cart.find(item => {
            return item.item._id === dishId;
        });

        for (let i = 0; i < dishes.length; i++) {
            let dish = dishes[i];
            console.log(dish);
            if (dishId === dish._id && !itemPresent) {
                cart.push({ item: dish, quantity: 1, price: dish.price });
            }
        }

        if (itemPresent) {
            itemPresent.quantity += 1;
        }

        let cartPrice = 0;

        // loop through cart to check the price 
        for (let i = 0; i < cart.length; i++) {
            let dish = cart[i];
            let price = dish.quantity * dish.price;
            cartPrice += price;
            cartTotal = cartPrice;
            console.log(cartPrice, cart, 'this is final cart total from add button');
            console.log(cartTotal, 'outside cartTotal working')
        }

        renderCart();
        return cart;
    });
} 


function deleteDish() {
    $('.dishes').on('click', '.delete-dish-button', function(event) {
        let dishId = $(event.currentTarget).data('dish');
        // gets ID from the click
        
        const dishPresent = cart.find(item => {
            return item.item._id === dishId;
        });

        let dishIdx = cart.findIndex(dish => dish === dishPresent); 
        
        let cartPrice = 0; 

        for (let i = 0; i < cart.length; i++) {
            let dish = cart[i];
            let dishPrice = dish.quantity * dish.price;
            cartPrice += dishPrice;
            cartTotal = cartPrice;
            console.log(cartPrice, 'this is current cart price from delete button');
            console.log(cartTotal, 'this is outside cartTotal');
        }

        // if dish exists and quantity is greater than 1, splice it out, delete from price
        if (dishPresent && dishPresent.quantity === 1) {
            cart.splice(dishIdx, 1);
            
            let dishPrice = dishPresent.quantity * dishPresent.price;
            cartPrice -= dishPrice;
            cartTotal = cartPrice;
            console.log(cartTotal, 'this is outside cartTotal');
            console.log(cartPrice, 'dish was deleted, this is current cartPrice');
        } else if (dishPresent && dishPresent.quantity > 1) {
            dishPresent.quantity -= 1; 
            let dishPrice = dishPresent.quantity * dishPresent.price;
            cartPrice -= dishPrice;
            cartTotal = cartPrice;
            console.log(cartTotal, 'this is outside cartTotal');
            console.log(cartPrice, 'dish was deleted, this is current cartPrice');
        }

        renderCart();
        return cart;
    });
}


function renderCart()  {
    $('.summary-items').html('');
    $('.total-price').html('');
    $('.price-adder').hide();

    cart.forEach(function(item) {
    let newItem = $(".summary-items").append(`<li class="order-item"> ${item.item.name} - ${item.quantity} </li>`);
    
    $('.price-adder').show();
    $('.total-price').html(`<h3 class="price"> Total: $${cartTotal} </h3>`);
    });
}

const orderObj = {};

function postOrder() {
    $('.checkout-button').on('click', '.checkout-btn',function() {
        event.preventDefault();
        console.log('HELLO, I AM CLICKED')
    });  
}

        // on click of checkout button, grab the dish Ids from cart
        //for each item in the cart, grab the dish Ids
//         cart.forEach(dish => {
//             let dishId = dish._id;
//             let dishName = dish.name; 
//             console.log(dishName, dishId);
//         });

//         //going to save each dish as a key value pair 
//         //into an order object - CALLED ORDER OBJ
        
//         //GETTING, DATE, TIME, LOCATION OF ORDER
           
//         const date = $('#datepicker').val();
//         const time = $('#time').val();
//         const location = $('#location-select').val();

        // let order = {
        //     'deliveryDate': `${date}`,
        //     'dishes': [],  //array of the dish ids???
        //     // 'time': `${time}`,
        //     'location': `${location}`
        // };

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



    // const token = localStorage.getItem('token');
    // this WILL BE FOR EDIT ORDERS

    // const headers = {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    // };

    // return fetch('http://localhost:8080/dishes/:id', {
    //     method: PUT,
    //     headers: headers
    // }).then(rawResponse => {
    //     return rawResponse.json();
    // }).then(response => {
    //     console.log('request- worked');
    //     return response.dishes;
    // }).catch(error => {
    //     console.log('an error occurred', error);
    // });


// function deleteOrder() {

//     const token = localStorage.getItem('token');
//     const guestId = localStorage.getItem('user_id'); 
//     const orderId = localStorage.getItem('order_id'); 

//     const headers = {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//         'guests': `${guestId}`,
//         'orderId': `${orderId}`
//     };
        

//     return fetch(`http://localhost:8080/orders/${orderId}`, {
//             method: 'DELETE',
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


// function submitOrder() {

//     const token = localStorage.getItem('token');
//     const guestId = localStorage.getItem('user_id');
        
//         const headers = {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//             'guests': `${guestId}`
//         };

//     return fetch('http://localhost:8080/orders', {
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

