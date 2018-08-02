// MOCK DATA FOR ORDER SENT 

const pendingOrders = {
    id: "111111",
    guestName: "Sean James",
    dish: {name: "Roasted Beet Salad", price: 14.00},
    beverage: {name: "Ode to Picon", price: 12.00},
    dateOrder: ISODate("2017-01-01"),
    deliveryTime:ISODate("2017-01-02"),
    location: "Pool",
    notes: "Put dressing on side"
}

function getPendingOrders(callbackFn) {
    setTimeout(function(){ callbackFn(pendingOrders)}, 100);
}

function displaypendingOrders(data) {
    for (index in data.pendingOrders) {
       $('body').append(
        '<p>' + data.pendingOrders[index].text + '</p>');
    }
}

function getAndDisplaypendingOrders() {
    getRecentPendingOrders(displaypendingOrders);
}

$(function() {
    getAndDisplaypendingOrders();
})