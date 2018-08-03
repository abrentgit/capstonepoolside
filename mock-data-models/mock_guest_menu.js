// MOCK MENU ORDER DATA WILL HAVE DISHES AND DRINKS



const dishData = {
    dishes: [{id: '22222', name: "Omelette Nature", price: 15.00},
    {id: '22223', name: "Omelette Nature", descripton: "Avocado and Feta", price: 16.00},
    {id: '22224', name: "Boston Salad", description: "Walnuts and Dijon vinagrette", price: 14.00},
    {id: '22225', name: "Double Cheeseburger", description: "Fois gras bordelaise sauce", price: 17.00},
    {id: '22226', name: "Ham and Cheese Sandwich", description: "Parisian Ham and Swiss Cheese", price: 12.00},]     
};

const beverageData = {
    beverages: [{id:'33333', name: 'Beauty School Dropout', description: 'grey goose, st.germain, aperol, lemon', price: 14.00},
    {id:'33334', name: 'Beauty School Dropout', description: 'grey goose, st.germain, aperol, lemon', price: 18.00},
    {id:'33335', name: 'Gold River', description: 'mezcal, amaro angeleno, apricot, lime, tumeric, agave', price: 15.00},
    {id:'33336', name: 'Dream Well', description: 'scotch, chai, pear brandy, honey, lemon, egg white, angostura', price: 16.00},
    {id:'33337', name: 'Sundriver', description: 'campari, lillet rouge, grapefruit, prosecco', price: 17.00},
    {id:'33338', name: 'Kronenbourg', description: 'draft, pale lager', price: 7.00},
    {id:'33333', name: 'Cabernet Franc', description: 'sancerre france 2016', price: 14.00}
]};

// HOW TO SET UP CLIENT GET FOR DISH AND BEV 

function getDishes(callbackFn) {
    setTimeout(function(){ callbackFn(dishData)}, 100);
}

function getBeverages(callbackFn) {
    setTimeout(function(){ callbackFn(beverageData)}, 100);
}

function displayDishes(data) {
    for (index in data.dishes) {
       $('body').append(
        '<p>' + data.dishes[index].text + '</p>');
    }
}

function displayBeverages(data) {
    for (index in data.beverages) {
        $('body').append(
         '<p>' + data.beverages[index].text + '</p>');
    }
}

function getAndDisplaydishes() {
    getRecentDishData(displayDishes);
}

function getAndDisplayBeverages() {
    getRecentBeverageData(displayBeverages);
}


$(function() {
    getAndDisplaydishes();
    getAndDisplayBeverages();
})


