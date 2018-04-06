/*
  Objective: Create a url shotenter!

  Modify the code to do the following:
    1. Submit a long URL into the input form, and return a shorter URL.
      ex: http://some-domain.com/some-looooooooog-url-that-is-really-really-long-and-stuff
          -> http://localhost:1337/short-url-afda8
    2. Make the application redirect from the short URL to the full URL.

  Extra:
    1. Check if the long URL has already been submitted, and return the short
       URL directy instead of generating a new one.
    2. Validate that a short URL is unique before saving it.
    3. Save the data to a database or write it to a file, so that the data
       persists even if you restart the server.
    4. Submit the form asynchronously so the page doesn't have to refrest to show
       the short URL.
 */

const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const sh = require('shorthash');

const app = express();

app.set('view engine', 'html');
nunjucks.configure('views', { express: app, watch: true });
app.use(bodyParser.urlencoded({ extended: true }));

const URL_MAP = {};

function generateShortUrl(longUrl) {
  return sh.unique(longUrl);
}

function saveUrlToMap(longUrl, shortUrl) {
  URL_MAP[shortUrl] = longUrl;
}

app.get('/:slug', (req, res) => res.redirect(URL_MAP[req.params.slug]));

app.get('/', (req, res) => res.render('form'));

app.post('/', (req, res) => {
  const shortUrl = generateShortUrl(req.body.url);
  saveUrlToMap(req.body.url, shortUrl);
  return res.render('form', { shortUrl: `http://localtest.me:1337/${shortUrl}` });
});

app.listen(1337, () => console.log('URL shortener app listening on port 1337!'));
