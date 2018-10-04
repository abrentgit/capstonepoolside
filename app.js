function main() {
    console.log('loading app.js');
    performLogin();
}
$(main);

function performLogin() {
    $('#signup-form').on('submit', function(event) {
        event.preventDefault();
        console.log('working');

        const email = $('#user-email').val();
        const password = $('#user-password').val();

        return fetch('http://localhost:8080/login', { 
            method: 'POST'
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

