// MOCK SIGNUP STAFF USER



// MOCK LOGIN STAFF USER

const staffSchema = mongoose.Schema({
    name: String, required: true,
    password: String, required: true,
    role: String
});