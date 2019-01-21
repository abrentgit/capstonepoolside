function main() {
    console.log('loading app.js');
    getLoginPage();
    getHomePage();
    deleteOrder();
    restart();
    orderDone();
    registerGuest();
    logoHome();
    getRegisterPage();
    addDish();
    deleteDish();
    logOut();  //added logout
}

orderDone();
signUpLink();
loginLink();
getAboutPage();
performLogin();
postOrder();


$(main);

// GET HOME PAGE

function getHomePage() {
    $('.homepage').show();
    $('.register-form').hide();
    $('.login-form').hide();
    $('.make-order').hide();
    $('.about').hide();
    $('.order-feedback').hide();
}

// LOGIN 

function performLogin() {
    $('.login-form').on('submit', function(event) {
        event.preventDefault();
        console.log('working');

        const email = $('#user-email-login').val();
        const password = $('#user-password-login').val();
        
        const session = {
            'email': `${email}`,
            'password': `${password}`,
        };

        const headers = {
            'Content-Type': 'application/json'
        };
    
        return fetch('https://orderinn.herokuapp.com/login', { 
            method: 'POST',
            body: JSON.stringify(session),
            headers: headers
        }).then(rawResponse => {
            return rawResponse.json(); 
        }).then(response => {
            console.log('request worked', response);
            const { authToken } = response;
            localStorage.setItem('token', authToken);
            localStorage.setItem('userId', response.user_id);
            getMakeOrderPage(); 

            // let userLoggedIn = response.user_id;
            // if (userLoggedIn) {
            //     $('order-feedback').hide();
            // }
            // if (userId === )
            // // IF USER IS ALREADY LOGGED IN IF STATEMENT, HIDE THE ORDER FEEDBACK DIV
            // // AND THEN EMPTY OUT THE MAKE ORDER DIV 
            return response;
        }).catch(error => {
            console.log('an error occured', error);
        });
    });
}

// GET MAKE ORDER PAGE
function getMakeOrderPage() {
    $('.login-form').hide();
    $('.homepage').hide();
    $('.make-order').show();
    $('.order-feedback').show();
    getDishes();
}

// REGISTER GUEST
function registerGuest() {
    $('.register-form').on('submit', function(event) {
        event.preventDefault();
        console.log('working');

        const name = $('#user-name').val();
        const email = $('#user-email-reg').val();
        const password = $('#user-password-reg').val();
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
    
        return fetch('https://orderinn.herokuapp.com/guests', { 
            method: 'POST',
            body: JSON.stringify(session),
            headers: headers
        }).then(rawResponse => {
            return rawResponse.json(); 
        }).then(response => {
            console.log('request worked', response);
            const { authToken } = response;
            localStorage.setItem('token', authToken);
            console.log('user is registered');       
            loginAfterRegister(); // CALL LOGIN PAGE AFTER REGISTRATION
            return response;
        }).catch(error => {
            console.log('an error occured', error);
        });
    });
}

function loginAfterRegister() {
    $('.register-form').hide();
    $('.login-form').show();
    $('.login-link').hide(); // hide the nav
    $('.register-link').hide();
    $('.about-link').hide();
    $('body').css('background-image', 'none');    
    $('body').css('background-color', 'FAF7F3'); 
    $('.logo').show();
    $('.homepage-title').css('color', '#000000');
}

// GET LOGIN PAGE

function getLoginPage() {
    $('.login-link').on('click', 'a', function(event) {
    event.preventDefault();
    $('.register-form').hide();
    $('.login-form').show();
    $('.login-link').hide(); // hide the nav
    $('.register-link').hide();
    $('.about-link').hide();
    $('body').css('background-image', 'none');    
    $('body').css('background-color', 'FAF7F3'); 
    $('.logo').show();
    $('.homepage-title').css('color', '#000000');
})
}

// GET DISHES FROM API

let dishes = [];

function getDishes() {

    const token = localStorage.getItem('token');

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    return fetch('https://orderinn.herokuapp.com/dishes', {
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
    const orderDiv = `<div class="dish-choice"><p><b>${dish.name}</b></p>
                        <p>${dish.description}</p>
                        <p class="dish-price">$${dish.price}</p>
                        <button data-dish="${dish._id}" 
                        class="add-dish-button">Add Dish</button>
                        <button data-dish="${dish._id}" class="delete-dish-button">Delete Dish</button>
                        </div>`
    return orderDiv;     
}

// ADD DISHES TO ORDER

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
            console.log(cartPrice, 'this is final cart total from add button');
            console.log(cartTotal, 'outside cartTotal working');
            console.log(cart, 'these are my cart items');
        }

        renderCart();
        return cart;
    });
} 

// DELETE DISHES FROM ORDER

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

function renderCart() {
    $('.summary-items').html('');
    $('.total-price').html('');
    $('.price-adder').hide();

    cart.forEach(function(item) {
    let newItem = $(".summary-items").append(`<li class="order-item"> ${item.item.name} - ${item.quantity} </li>`);
    
    $('.price-adder').show();
    $('.total-price').html(`<h3 class="price"> Total: $${cartTotal} </h3>`);
    });
}

// POST AN ORDER TO API

let newOrder = {}; 

function postOrder() {
    $('.checkout-btn').on('click', function() {
        console.log('HELLO, I AM CLICKED');
                
        const date = $('.date-input').val();
        const location = $('#location').val();

        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        console.log(userId, 'this is user ID');
        
        let dishIds = []; 

        cart.forEach(dish => {
            dishIds.push(dish.item._id); 
        });

        console.log(dishIds, 'these are the cart dishes');

        let order = {
            'guests': `${userId}`,
            'dishes': `${dishIds}`,
            'deliveryDate': `${date}`,
            'location': `${location}`,
            'notes': '',
        };
        
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

     return fetch('https://orderinn.herokuapp.com/orders', {
            method: 'POST',
            body: JSON.stringify(order),
            headers: headers
        }).then(rawResponse => {
            return rawResponse.json(); 
        }).then(response => {
            console.log('request worked', response);
            const newOrder = response;
            console.log(newOrder, 'NEW ORDER COMPLETED HERE');
            orderFeedback(newOrder);
        }).catch(error => {
            console.log('an error occured', error);
        });
    });
}

//AFTER ORDER IS POSTED, GIVE AN ORDER SUMMARY

function orderFeedback(newOrder) {
    $('.make-order').hide();
    $('header').remove('h1');
    
    let dishList = '';
    let date = new Date (newOrder.deliveryDate);
    let location = newOrder.location;

    console.log(date, 'DATE CONVERTED');
    console.log(newOrder, 'this is the new order');
    console.log(newOrder.dishes._id, "this is dish id inside new order");

    // NEED TO ACCESS QUANTITY OF DISHES, THEN DISPLAY ******** 
    
    newOrder.dishes.forEach(dish => {
        dishList = dishList.concat(`<li>
         <div class="dishOrder"> 
            <h4>${dish.name}</h4>
            <p>${dish.description}<p>
         </div>
         </li>`);
    })

    let cartVal = `${cartTotal}`;

    $('.order-feedback').append(`<nav class="feedback-header">
                                    <p class="order-id"> Order#: ${newOrder._id} </p>
                                    <ul>${dishList}</ul>
                                </nav>

                                <div role="region" class="order-details"> 
                                    <p><i>Reservation: </i> ${date} at ${location}</p>
                                </div>

                                <div role="region" class="cart-total">
                                    <img role="img" class="logo-feedback" src="../cutlery-icon.svg" alt="Cutlery" />
                                    <p class="cart-cost">Total Cost: $${cartVal}</p>
                                    <p class="thanks">Thanks for Your Order!</p>
                                </div>

                                <div role="region" class="feedback-btns">
                                    <button type="button" data-order="${newOrder._id}" class="cancel-btn">Cancel Order</button>
                                    <button type="button" class="done-btn">Home</button>
                                </div>`)
}

// CONFIRM ORDER CANCEL

function cancelConfirm() {
    if (confirm('Are you sure you want to cancel your order?') === true) {
        deleteOrderFeedback();
    } else {
        return false;
    }
}

// DELETE ORDER

function deleteOrder() {
    $('.order-feedback').on('click', '.cancel-btn', function(event) {

    cancelConfirm();
    
    let orderId = $(event.currentTarget).data('order');
        console.log(orderId, 'this is current orderId');
    
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    return fetch(`https://orderinn.herokuapp.com/${orderId}`, {
        method: 'DELETE',
        headers: headers
    }).then(response => {
        return response;
    }).catch(error => {
        console.log('an error occured', error);
    });  
})

}

// AFTER ORDER DELETED, func to take back to homepage
function deleteOrderFeedback() {
    $('.order-title').hide();    
    $('.order-feedback').html(`<div role="region" class="delete-feedback">
                                <img role="img" class="logo-order-delete" src="../cutlery-icon.svg" alt="Cutlery" /> 
                                <p class="cancel-text"><i>Your order has been canceled.</i></p>
                                <p class="cancel-text"><i>Thanks for using Order Inn.</i></p>
                                <button type="button" class="done-deleted-btn">Home</button>
                           </div>`);
}

function logOut() {
    const token = localStorage.getItem('token');

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
    return fetch(`https://orderinn.herokuapp.com/logout`, {
        headers: headers
    }).then(response => {
        return response;
    }).catch(error => {
        console.log('an error occured in logout', error);
    });
}

// IF DONE AND GOOD WITH ORDER - GO BACK TO HOMEPAGE, USER LOGGED OUT
function orderDone() {    
    $('.order-feedback').on('click', '.done-btn', function() {
        logOut();
        getHomePage();
        event.preventDefault(); 
        $('.login-link').show(); 
        $('.register-link').show();
        $('.about-link').show();
        $('.homepage-title').css('color', '#FFFFFF');
        $('body').css({'background-image': ''});
    });
}

// AFTER ORDER IS DELETED RETURN TO HOMEPAGE

function restart() {    
    $('.order-feedback').on('click', '.done-deleted-btn', function() {
        getHomePage();
        event.preventDefault();
        $('.login-link').show(); 
        $('.register-link').show();
        $('.about-link').show();
        $('.homepage-title').css('color', '#FFFFFF');
        $('body').css({'background-image': ''});
    });
}

// GET REGISTER PAGE FROM HOMEPAGE

function getRegisterPage() {
    $('.register-link').on('click', 'a', function(event) {
        event.preventDefault();
        $('.register-form').show();
        $('.footer-register').append(`<p>Already have an account? <a class="login-footer" href="">Log in</a></p>`)
        $('.homepage-title').css('color', '#000000');
        $('.login-form').hide();
        $('.make-order').hide();
        $('.login-link').hide(); // hide the nav
        $('.register-link').hide();
        $('.about-link').hide();
        $('body').css('background-image', 'none'); // empty BG    
        $('body').css('background-color', 'FAF7F3'); 
        $('.logo').show();
    })
}

// GET ABOUT PAGE FROM HOMEPAGE

function getAboutPage() {
    $('.about-link').on('click', 'a', function(event) {
        event.preventDefault();
        $('.about').show();
        $('.homepage-title').css('color', '#000000');
        $('.register-form').hide();
        $('.login-form').hide();
        $('.make-order').hide();
        $('.login-link').hide(); 
        $('.register-link').hide();
        $('.about-link').hide();
        $('body').css('background-image', 'none');     
        $('body').css('background-color', 'FAF7F3'); 
        $('.logo').show();
    })
}

// CLICK ON LOGO ON ABOUT PAGE - GO TO HOMEPAGE
function logoHome() {
    $('.homepage-header').on('click', '.homepage-title', function() {
        getHomePage();
        $('.login-link').show(); 
        $('.register-link').show();
        $('.about-link').show();
        $('body').css('background-image', '');   
        $('.homepage-title').css('color', '#FFFFFF');
    })
}

// FOOTER ON LOGIN PAGE
function signUpLink() {
    $('.footer').on('click', '.register-footer', function(event) {
        event.preventDefault();
        $('.register-form').show();
        $('.login-form').hide();
    })
}

// FOOTER ON REGISTER PAGE
function loginLink() {
    $('.footer-register').on('click', '.login-footer', function(event) {
        event.preventDefault();
        $('.register-form').hide();
        $('.login-form').show();
    })
}


