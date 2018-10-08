
function main() {
    console.log('loading app.js');
    performLogin();
    postOrder();
    getOrders();
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

function getOrders() {
    $('.view-order').on('click', event => {
        event.preventDefault();
        console.log('working');

        const token = localStorage.getItem('token');
        const headers = {
            'Authentication': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

    return fetch('http://localhost:8080/orders', {
            headers: headers 
        }).then(rawResponse => {
            console.log(rawResponse);
            return rawResponse.json();
        }).then(response => {
            console.log('request worked', response);
            return response;
        }).catch(error => {
            console.log('an error occured', error);
        });
    });
}


// ASK RODRIGO HOW TO GET GUEST ID TO CLIENT

function postOrder() {
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

