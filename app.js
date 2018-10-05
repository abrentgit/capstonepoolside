
function main() {
    console.log('loading app.js');
    performLogin();
}
$(main);

// ADD SAVE OF TOKEN

function performLogin() {
    $('.signup-form').on('submit', function(event) {
        event.preventDefault();
        console.log('working');

        const email = $('#user-email').val();
        const password = $('#user-password').val();

        // have to create a token to reference to

        const token = localStorage.getItem('token');

        const data = {
            'email': `${email}`,
            'password': `${password}`,
            'token': `${token}`
        };

        console.log(data, 'hey this is working');
        // USER SENDS TOKEN? 
        // TOKEN NEEDS TO BE SENT BACK IN THE RESPONSE TO USER

        return fetch('http://localhost:8080/login', { 
            method: 'POST',
            data: data
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

// function getOrders() {
//     const token = localStorage.getItem('token');
//     const headers = {
//         'Authentication': `Bearer ${token}`
//     };
//     return fetch('http://localhost:8080/orders', {
//             headers: headers 
//         }).then(rawResponse => {
//             return rawResponse.json();
//         }).then(response => {
//             console.log('request worked', response);
//             return response;
//         }).catch(error => {
//             console.log('an error occured', error);
//         });
// }

