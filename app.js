
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
            return response;
        // }).then(token => {
        //     const token = localStorage.getItem('token');
        //     // SET TO TOKEN TO SESSION? 
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

