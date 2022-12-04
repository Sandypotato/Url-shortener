const express = require('express')
const ShortUrl = require('./models/shortUrl')
const mongoose = require('mongoose');

const app = express()
const port = process.env.PORT;
mongoose.connect('mongodb+srv://AndersChoo:Andersch00zq@cluster0.upih0fl.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true
})
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.get('/', async (req, res) => {
    const aSpecialName = await  ShortUrl.find()
    res.render('index', {shortUrls: aSpecialName})
})

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({full: req.body.fullURL})
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl});
    if(shortUrl == null) return res.sendStatus(404);
    shortUrl.clicks++
    shortUrl.save()
    res.redirect(shortUrl.full)
})

app.listen(port || 5000);
