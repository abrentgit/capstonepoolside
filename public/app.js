
function main() {
    console.log('loading app.js');
    performLogin();
    registerGuest();
    addDish();
    deleteDish();
    renderCart();
}

getLoginPage();
postOrder();
deleteOrder();


$(main);

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
            localStorage.setItem('userId', response.user_id);
            $('.homepage').hide();
            $('.login-form').hide();
            $('.logo').hide();
            getMakeOrderPage();
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
            registerGood();
            return response;
        }).catch(error => {
            console.log('an error occured', error);
        });
    });
}

function getLoginPage() {
    $('.logo').hide();
    $('.login-form').hide();
    $('.footer').hide();

    $('.login-link').on('click', 'a', function(event) {
    event.preventDefault();
    $('body').css('background-image', 'none'); // empty BG    
    $('body').css('background-color', 'FAF7F3');
    
    $('.login-link').hide(); // hide the nav
    $('.register-link').hide();
    $('.about-link').hide();
    $('.title').css('color', '#000000');
    $('.header').hide();
    $('.login-form').show();

    renderLoginPage();

    });
}

function renderLoginPage() {
    $('.login-form').show();
    $('.logo').show();
    $('.footer').show();
}


// get make order page
// call this make order page up top 
function getMakeOrderPage() {

return fetch('http://localhost:8080/orderinn/neworder', {

}).then((res) => {
      return res.text();
      console.log(res, 'this is html');
}).then((data) => {
     console.log(data, 'this is the data');
     $('.create-order').html(data);
});
}


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
            console.log(cartPrice, 'this is final cart total from add button');
            console.log(cartTotal, 'outside cartTotal working');
            console.log(cart, 'these are my cart items');
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

let newOrder = {}; 

function postOrder() {
    $('.checkout-btn').on('click', function() {
        console.log('HELLO, I AM CLICKED');
                
        const date = $('.date-input').val();
        const location = $('#location-select').val();

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

     return fetch('http://localhost:8080/orders', {
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

function orderFeedback(newOrder) {
    $('header').remove('h1');
    $('.order-title').html(`<h2 class="order-id"> Order#: ${newOrder._id} </h2>`);    
    
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

    $('.order-form').html(`<ul>${dishList}</ul>
                           <div class="order-details"> 
                                <p><i>Reservation:</i> ${date} at ${location}</p>
                            </div>
                            <div class="cart-total">
                                <p class="cart-cost">Total Cost: $${cartVal}</p>
                                <p class="thanks">Thanks for Your Order!</p>
                            </div>
                            <button data-order="${newOrder._id}" class="cancel-btn">Cancel Order</button>`)
                        }

function cancelConfirm() {
    if (confirm('Are you sure you want to cancel your order?') === true) {
        deleteOrderFeedback();
    } else {
        return false;
    }
}

function deleteOrder() {
    $('.order-form').on('click', '.cancel-btn', function(event) {
        console.log('HELLO, I AM CLICKED');

        cancelConfirm();
        // deleteOrderFeedback();
    
    let orderId = $(event.currentTarget).data('order');
    console.log(orderId, 'this is current orderId');

    
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');
    console.log(userId, 'this is user ID');

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    return fetch(`http://localhost:8080/orders/${orderId}`, {
        method: 'DELETE',
        headers: headers
    }).then(response => {
        return response;
        console.log('request worked', response);
    }).catch(error => {
        console.log('an error occured', error);
    });  
})

}

function deleteOrderFeedback() {
    $('.order-title').html(``);    
    $('.order-form').html(`<div class="delete-feedback"> 
                                <p class="cancel-text">Your order has been canceled.</p>
                                <a class="menu-link" href="../views/make-order.html">Menu</a>
                           </div>`);
}
