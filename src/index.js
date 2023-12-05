const express=require("express");
const app=express();
const ejs=require("ejs");
const mongoose=require("mongoose");
const User=require("../schema/login");
const Brewery=require("../schema/brewery");
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

// database connecting 
mongoose.connect("mongodb://localhost:27017/Brewery", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB", error);
    });

app.set('view engine', 'ejs');


app.get("/", (req, res)=> {
    res.render("home")
  //  console.log("home");
   // res.send("hello");
})
app.get("/signup", (req, res)=> {
   // res.render("home")
    res.render("signup");
})
app.get("/login", (req, res) => {
    res.render("login");
})
app.get("/createBrewery", (req, res) =>{
    res.render("createBrewery");
})
//pp.get("/createBrewery/")

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user in the database
        const user = await User.findOne({ username, password });

        if (user) {
            res.render('home');
        } else {
            res.send('Invalid credentials. Please try again.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.send('Username already exists. Please choose another username.');
        }

        // Create a new user in the database
        const newUser = new User({ username, password });
        await newUser.save();

        res.send('Signup successful! You can now log in.');
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/search', async (req, res) => {
    const { searchType, searchTerm } = req.query;

    try {
        let query = {};

        // Construct the query based on the search type
        switch (searchType) {
            case 'city':
                query = { city: new RegExp(searchTerm, 'i') };
                break;
            case 'name':
                query = { name: new RegExp(searchTerm, 'i') };
                break;
            case 'type':
                query = { type: new RegExp(searchTerm, 'i') };
                break;
            default:
                return res.send('Invalid search type');
        }

        // Perform the search in the database (replace 'Brewery' with your actual model name)
        const results = await Brewery.find(query);

        res.send(`Search results: ${JSON.stringify(results)}`);
    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/createbreweries', async (req, res) => {
    const breweriesData = req.body; // Assuming an array of brewery data in the request body

    try {
        // Create breweries dynamically
        const createdBreweries = await Brewery.create(breweriesData);

        //res.send(`Created ${createdBreweries.name} breweries successfully!`);
        res.render('showBrewery');
    } catch (error) {
        console.error('Error creating breweries:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(3000, ()=> {
    console.log("port connected");
})