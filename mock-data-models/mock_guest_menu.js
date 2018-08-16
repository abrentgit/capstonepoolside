// MOCK MENU ORDER DATA WILL HAVE DISHES AND DRINKS

/// BOTH MENUS
{
   "name": "Bar",
    "dishes": [
      {
        "name": "Sunny Day Yogurt",
        "description": "Organic",
        "price": "16.00"
      },

      {
        "name": "French Bread and Cheese",
        "description": "Served with fruits",
        "price": "18.00"
      },

      {
        "name": "Ham Egg and Cheese",
        "description": "Scrambled",
        "price": "10.00"
      }
    ],

    "beverages": [
        {
          "name": "Ginger Smoothie",
          "description": "Ginger",
          "price": "10.00"
        },

        {
          "name": "Hotel Special Soda",
          "description": "Special Mix",
          "price": "11.00"
        },

        {
          "name": "House Coffee",
          "description": "Fair trade from Colombia",
          "price": "3.50"
        },

        {
          "name": "Supreme Juicer",
          "description": "Freshly squeezed Orange, Guava, or Mango juice",
          "price": "8.00"
        }
    ]
}


var brunchMenu = {
   "name": "Brunch",
    "dishes": [
      {
        "name": "Sunny Day Omelette",
        "description": "Served with toast and grits",
        "price": "16.00"
      },

      {
        "name": "Belgium Waffles",
        "description": "Served with fruits",
        "price": "15.00"
      },

      {
        "name": "Ham Egg and Cheese Delight",
        "description": "Served on French bread and cheese of choice",
        "price": "10.00"
      }
    ],

    "beverages": [
        {
          "name": "Berry Smoothie",
          "description": "Strawberries, Blueberries, and Raspberries",
          "price": "10.00"
        },

        {
          "name": "Green Smoothie",
          "description": "Spinach, Apples, Ginger and Honey",
          "price": "11.00"
        },

        {
          "name": "House Coffee",
          "description": "Fair trade from Colombia",
          "price": "3.50"
        },

        {
          "name": "Supreme Juicer",
          "description": "Freshly squeezed Orange, Guava, or Mango juice",
          "price": "8.00"
        }
    ]
}

db.menus.insertOne(brunchMenu);

const dinnerMenu = {
    name: "Brunch",
    dishes: [
      {
        name: "Beef Wellington",
        description: "Served with mashed potatoes",
        price: 20.00
      },

      {
        name: "Salmon and Asparagus",
        description: "Marinated with special hotel sauce",
        price: 18.00
      },

      {
        name: "Deluxe Hamburger",
        description: "12 oz. beef, choice of cheese",
        price: 10.00
      }

      {
        name: "Onion Soup",
        description: "Served with a side of french fries"
        price: 9.00
      }

      {
        name: "So Awesome Salad"
        description: "Served with roasted chicken, walnuts and dressing of choice"
        price: 11.00
      }

    ],

    beverages: [
        {
          name: "Paradise Punch",
          description: "Campari, lillet rouge, grapefruit, prosecco"
          price: 12.00
        },

        {
          name: "Gold River",
          description: "Mezcal, amaro angeleno, apricot, lime, tumeric, agave"
          price: 13.00
        },

        {
          name: "Kronenbourg IPA"
          description: "Draft, pale lager"
          price: 7.00
        },

        {
          name: "Beauty School Dropout"
          description: "Scotch, chai, pear brandy, honey, lemon, egg white, angostura"
          price: 8.00
        }

    ]
}

db.menus.insertOne(dinnerMenu);




// const dishData = {
//     dishes: [{id: '22222', name: "Omelette Nature", price: 15.00},
//     {id: '22223', name: "Omelette Nature", descripton: "Avocado and Feta", price: 16.00},
//     {id: '22224', name: "Boston Salad", description: "Walnuts and Dijon vinagrette", price: 14.00},
//     {id: '22225', name: "Double Cheeseburger", description: "Fois gras bordelaise sauce", price: 17.00},
//     {id: '22226', name: "Ham and Cheese Sandwich", description: "Parisian Ham and Swiss Cheese", price: 12.00},]
// };

// const beverageData = {
//     beverages: [{id:'33333', name: 'Beauty School Dropout', description: 'grey goose, st.germain, aperol, lemon', price: 14.00},
//     {id:'33334', name: 'Beauty School Dropout', description: 'grey goose, st.germain, aperol, lemon', price: 18.00},
//     {id:'33335', name: 'Gold River', description: 'mezcal, amaro angeleno, apricot, lime, tumeric, agave', price: 15.00},
//     {id:'33336', name: 'Dream Well', description: 'scotch, chai, pear brandy, honey, lemon, egg white, angostura', price: 16.00},
//     {id:'33337', name: 'Sundriver', description: 'campari, lillet rouge, grapefruit, prosecco', price: 17.00},
//     {id:'33338', name: 'Kronenbourg', description: 'draft, pale lager', price: 7.00},
//     {id:'33333', name: 'Cabernet Franc', description: 'sancerre france 2016', price: 14.00}
// ]};

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
