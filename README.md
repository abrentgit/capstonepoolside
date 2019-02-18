# Order Inn App

PROTOYPE LINK:

Find a working prototype with Node at http://orderinn.herokuapp.com/ . 

SUMMARY:  

The Order Inn app is a food ordering app designed for lifestyle and concept driven hotels.
Depending on the partnering hotel’s amenities and communal spaces, users can order special dishes or limited time “pop up” menu items offered by the kitchen and book to eat them at several locations within the hotel. 

FUNCTIONALITY:

When users land on the homepage they are given an option to login and register up front. 

There is also a link to an about page where users can click to find out more about the app itself. 

In order to register,  a user supplies an email and a password.

Once a user logs on, it is provided with a menu of available dishes from which they can create an order. 
Using the “add dish” and “delete dish” buttons, a user can adapt its selections.

If a dish is added, it is shown inside the order box along with the quantity of the dishes selected and total price of the order. 

If a dish is deleted, it is reflected in both the total order price and in the quantity. 

A user is asked to choose the time, date, and hotel selection of their order. 
Once the order is submitted, the user can choose to cancel the order. 
  
TECHNICAL:

Front End
HTML5
CSS3
JavaScript
jQuery
Back End
Node.js
Express.js
MongoDB
Mongoose
mLab database
Mocha and Chai for testing
Responsive
The app is responsive and optimized for both desktop and mobile viewing and use.
Security
User passwords are encrypted using bcrypt.js.

API DOCUMENTATION:

API endpoints for the back end include:
POST to '/guests' for creating a new user
POST to '/register' to sign in an existing user 
POST to '/orders' to create a user order
GET to '/dishes' to access available dishes
DELETE to '/orders/:id' to delete order

DEVELOPMENTAL ROADMAP
Possible additional features, functionality and improvements:

Add dashboard of user orders at a later time.
Add in that dashboard an ability to update and edit the order
Add feature so that order times can be limited according to amount of bookings. 
Add feature so you can register legit emails,  and only harder password combinations. 
Add photos of guest and meals to pages. 

SCREENSHOTS: 
![A screenshot of my great app](/..homepage.png)
 





 
