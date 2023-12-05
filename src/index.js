const express=require("express");
const app=express();
const ejs=require("ejs");
const mongoose=require("mongoose");
const User=require("../schema/login");
const Brewery=require("../schema/brewery");
const bodyParser = require('body-parser');
const flash=require('connect-flash');
const session = require('express-session'); 

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({ 
    secret:'brewery', 
    saveUninitialized: true, 
    resave: true
})); 


app.use(flash());

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
           // res.render('home');
           res.redirect('/');
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
         
       // res.render('home');
       // res.send('Signup successful! You can now log in.');
       req.flash('success', 'Account created successfully!');

       res.redirect('/');
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

        const htmlResponse = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Search Results</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                    }
                    h2 {
                        color: #333;
                    }
                    ul {
                        list-style-type: none;
                        padding: 0;
                    }
                    li {
                        margin-bottom: 10px;
                    }
                </style>
            </head>
            <body>
                <h2>Search results:</h2>
                <ul>
                    ${results.map(result => `
                        <li>
                            <strong>Name:</strong> ${result.name}<br>
                            <strong>Brewery Type:</strong> ${result.brewery_type || result.type}<br>
                            <strong>Address:</strong> ${result.address}<br>
                            <strong>City:</strong> ${result.city}<br>
                            <strong>State:</strong> ${result.state}<br>
                            <strong>Postal Code:</strong> ${result.postal_code}<br>
                            <strong>Phone:</strong> ${result.phone}<br>
                            <strong>Website URL:</strong> ${result.website_url}<br>
                            <strong>Country:</strong> ${result.country}<br>
                        </li>
                    `).join('')}
                </ul>
            </body>
            </html>
        `;

        res.send(htmlResponse);

       // res.send(`Search results: ${JSON.stringify(results)}`);
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
       // res.render ('home');
       res.redirect('/');
    } catch (error) {
        console.error('Error creating breweries:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(3000, ()=> {
    console.log("port connected");
})