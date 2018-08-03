// MOCK DATA NEEDED FOR SIGNUP/LOGIN SCREEN


// SIGN UP GUEST USER



// LOGIN GUEST USER

const guestSchema = mongoose.Schema({
    name: String, required: true,
    password: String, required: true,
    phone: String, required: true,
    email: String, reqired: true,
    room: String, required: true
});


// when guest logs in 
// want a ask for email, name and room number 