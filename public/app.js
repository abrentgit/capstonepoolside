function main() {
    console.log('app is loaded');
    getHomePage();
    getLoginPage();
    getRegisterPage();
    signUpLink();
    loginLink();
    getAboutPage();
}

orderDone();
performLogin();
postOrder();
registerGuest();
logoHome();
restart();
deleteOrder();
addDish();
deleteDish();
homeRegister();    
loginHome();
aboutHome();
menuHome();

$(main);

function getHomePage() {
    $('.homepage').fadeIn('slow');
    $('.unhidden').fadeIn('slow');
    $('.hidden').hide();
}

function performLogin() {
    $('.login-form').on('submit', function (event) {
        event.preventDefault();

        const email = $('#user-email-login').val();
        const password = $('#user-password-login').val();

        let session = {
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
            const {
                authToken
            } = response;
            localStorage.setItem('token', authToken);
            localStorage.setItem('userId', response.user_id);

            if (!authToken === undefined || response.user_id === undefined) {
                alert('Invalid Login. Please try again');
                event.preventDefault();
            } else {
                getMakeOrderPage();
            }
            return response;
        }).catch(error => {
            throw error;
        });
    });
}

function getMakeOrderPage() {
    $('.login-form').hide();
    $('.homepage').hide();
    getDishes();
    $('.make-order').fadeIn('slow');
}

function registerGuest() {
    $('.register-form').on('submit', function (event) {
        event.preventDefault();

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

        if (session.password !== session.pswRepeat) {
            alert('Register Error: Passwords do not match');
        } else {

            return fetch('https://orderinn.herokuapp.com/guests', {
                method: 'POST',
                body: JSON.stringify(session),
                headers: headers
            }).then(rawResponse => {
                return rawResponse.json();
            }).then(response => {
                const {
                    authToken
                } = response;
                localStorage.setItem('token', authToken);
                loginAfterRegister();
                return response;
            }).catch(error => {
                throw error;
            });
        }
    });
}

function loginAfterRegister() {
    $('.register-form').hide();
    $('.login-form').fadeIn('slow');
    $('.login-link').hide();
    $('.register-link').hide();
    $('.about-link').hide();
    $('body').css('background-image', 'none');
    $('body').css('background-color', 'FAF7F3');
    $('.logo').show();
    $('.homepage-title').css('color', '#000000');
}

function getLoginPage() {
    $('.login-link').on('click', 'a', function (event) {
        event.preventDefault();
        $('.register-form').hide();
        $('.login-link').hide();
        $('.register-link').hide();
        $('.about-link').hide();
        $('body').css('background-image', 'none');
        $('body').fadeIn('fast');
        $('body').css('background-color', 'FAF7F3');
        $('.logo').fadeIn();
        $('.homepage').hide();
        $('.login-title').fadeIn('slow')
        $('.login-form').fadeIn('10000');
    })
}

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
        dishes = response.dishes;
        response.dishes.forEach(dish => {
            let dishHtml = renderDish(dish);
            dishesHtml = dishesHtml.concat(dishHtml);
        });
        $('.dishes').append(dishesHtml);
        return response.dishes;
    }).catch(error => {
        throw error;
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

let cart = [];

let cartTotal = '';

function addDish() {

    $('.dishes').on('click', '.add-dish-button', function (event) {
        let dishId = $(event.currentTarget).data('dish');

        const itemPresent = cart.find(item => {
            return item.item._id === dishId;
        });

        for (let i = 0; i < dishes.length; i++) {
            let dish = dishes[i];

            if (dishId === dish._id && !itemPresent) {
                cart.push({
                    item: dish,
                    quantity: 1,
                    price: dish.price
                });
            }
        }

        if (itemPresent) {
            itemPresent.quantity += 1;
        }

        let cartPrice = 0;

        for (let i = 0; i < cart.length; i++) {
            let dish = cart[i];
            let price = dish.quantity * dish.price;
            cartPrice += price;
            cartTotal = cartPrice;
        }

        renderCart();
        return cart;
    });
}

function deleteDish() {
    $('.dishes').on('click', '.delete-dish-button', function (event) {
        let dishId = $(event.currentTarget).data('dish');

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
        }

        if (dishPresent && dishPresent.quantity === 1) {
            cart.splice(dishIdx, 1);

            let dishPrice = dishPresent.quantity * dishPresent.price;
            cartPrice -= dishPrice;
            cartTotal = cartPrice;
        } else if (dishPresent && dishPresent.quantity > 1) {
            dishPresent.quantity -= 1;
            let dishPrice = dishPresent.quantity * dishPresent.price;
            cartPrice -= dishPrice;
            cartTotal = cartPrice;
        }

        renderCart();
        return cart;
    });
}

function renderCart() {
    $('.summary-items').html('');
    $('.total-price').html('');
    $('.price-adder').hide();

    cart.forEach(function (item) {
        let newItem = $('.summary-items').append(`<li class="order-item"> ${item.item.name} (${item.quantity}) </li>`);

        $('.price-adder').show();
        $('.total-price').html(`<h3 class="price"> Total: $${cartTotal} </h3>`);
    });
}

let newOrder = {};

function postOrder() {
    $('.checkout-btn').on('click', function () {

        const date = $('.date-input').val();
        const location = $('#location').val();
        const time = $('.time-input').val();

        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        let dishIds = [];

        cart.forEach(dish => {
            dishIds.push(dish.item._id);
        });

        let order = {
            'guests': `${userId}`,
            'dishes': `${dishIds}`,
            'deliveryDate': `${date}`,
            'location': `${location}`,
            'time': `${time}`,
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
            const newOrder = response;
            orderFeedback(newOrder);
            $('order-feedback').show();
        }).catch(error => {
            throw error;
        });
    });
}

function orderFeedback(newOrder) {
    if (newOrder.dishes === undefined) {
        alert('Please choose dishes');
    }

    let dishList = '';

    let event = new Date(newOrder.deliveryDate);
    let date = event.toDateString();

    let location = newOrder.location;
    let time = newOrder.time;

    newOrder.dishes.forEach(dish => {
        dishList = dishList.concat(`<li>
         <div class="dish-order"> 
            <p class="dish-name"><strong>${dish.name}</strong></p>
            <p class="dish-description">${dish.description}<p>
         </div>
         </li>`);
    })

    let cartVal = `${cartTotal}`;

    $('.make-order').hide();
    $('header').remove('h1');
    $('.order-feedback').fadeIn('slow');
    $('.order-feedback').append(`<div class="feedback-order">
                                    <h3 class="order-id"> Order#: ${newOrder._id} </h3>
                                    <ul class="dish-item">${dishList}</ul>
                                </div>

                                <div role="region" class="order-details"> 
                                    <span class="reservation"><i><strong>Reservation: </strong></i> ${date} at ${time}</span>
                                    <br> 
                                    <span class="reservation">at ${location}</span>
                                </div>

                                <div role="region" class="cart-total">
                                    <p class="cart-cost">Total Cost: $${cartVal}</p>
                                    <p class="thanks">Thanks for Your Order!</p>
                                </div>

                                <div role="region" class="feedback-btns">
                                    <button type="button" data-order="${newOrder._id}" class="cancel-btn">Cancel Order</button>
                                    <button type="button" class="done-btn">Logout</button>
                                </div>`)
}

function deleteOrder() {
    $('.order-feedback').on('click', '.cancel-btn', function (event) {

        if (confirm('Are you sure you want to cancel your order') === true)

            $('.order-title').hide();
        $('.order-feedback').hide();
        deleteOrderFeedback();

        let orderId = $(event.currentTarget).data('order');

        const token = localStorage.getItem('token');

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        return fetch(`https://orderinn.herokuapp.com/orders/${orderId}`, {
            method: 'DELETE',
            headers: headers
        }).then(response => {
            return response;
        }).catch(error => {
            throw error;
        });
    })
}

function deleteOrderFeedback() {
    $('.order-feedback').fadeIn('slow');
    $('.order-feedback').html(`<div role="region" class="delete-feedback">
                                    <p class="cancel-text"><i>Your order has been canceled. Thanks for using Order Inn.</i></p>
                                    <button type="button" class="done-deleted-btn">Logout</button>
                                    <img role="img" class="logo-order-delete" src="../cutlery-icon.svg" alt="Cutlery" /> 
                               </div>`);
}

function orderDone() {
    $('.order-feedback').on('click', '.done-btn', function () {
        location.reload();
    })
}

function restart() {
    $('.order-feedback').on('click', '.done-deleted-btn', function (event) {
        location.reload();
    });
}

function getRegisterPage() {
    $('.register-link').on('click', 'a', function (event) {
        event.preventDefault();
        $('.homepage').hide();
        $('body').fadeIn('slow');
        $('.register-form').fadeIn('slow');
        $('.footer-register').append(`<p>Already have an account? <a class="login-footer" href="">Log in</a></p>`)
        $('.homepage-title').css('color', '#000000');
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

function getAboutPage() {
    $('.about-link').on('click', 'a', function () {
        $('.about').fadeIn('slow');
        $('.homepage').hide();
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

function logoHome() {
    $('.homepage-header').on('click', '.homepage-title', function () {
        location.reload();
    })
}

function loginHome() {
    $('.login-form').on('click', '.login-title', function () {
        location.reload();
    })
}

function aboutHome() {
    $('.about').on('click', '.about-title', function () {
        location.reload();
    })
}

function homeRegister() {
    $('.register-nav').on('click', '.register-title', function() {
        location.reload();
    })
}

function menuHome() {
    $('.order-header').on('click', '.logo-menu', function() {
        location.reload();
    })
}

function signUpLink() {
    $('.footer').on('click', '.register-footer', function (event) {
        event.preventDefault();
        $('.register-form').fadeIn('slow');
        $('.login-form').hide();
    })
}

function loginLink() {
    $('.footer-register').on('click', '.login-footer', function (event) {
        event.preventDefault();
        $('.register-form').hide();
        $('.login-form').fadeIn('slow');
    })
}