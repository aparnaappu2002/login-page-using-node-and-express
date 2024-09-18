const express = require('express')
const app = express()
const hbs = require('hbs')
const session = require('express-session')
const nocache = require('nocache')

app.use(express.static('public'))
app.set('view engine', 'hbs')

app.use(nocache())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

const email = "admin@gmail.com"
const password = "admin123"

app.get('/', (req, res) => {
    if (req.session.user) {
        res.render('home')
    } else {
        res.render('login', { msg: req.session.errorMessage })
        req.session.errorMessage = null  // Clear the error message after rendering
    }
})

app.post('/verify', (req, res) => {
    if (req.body.email === email && req.body.password === password) {
        req.session.user = req.body.email
        res.redirect('/home')
    } else {
        req.session.errorMessage = "Invalid email or password"
        res.redirect('/')
    }
})

app.get('/home', (req, res) => {
    if (req.session.user) {
        res.render('home')
    } else {
        res.redirect('/')
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
            res.send("Error");
        } else {
            res.redirect('/');
        }
    });
})

app.listen(3003, () => {
    console.log("Server started in http://localhost:3003")
})