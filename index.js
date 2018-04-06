/*
  Objective: Create a url shotenter!

  Modify the code to do the following:
    1. Submit a long URL into the input form, and return a shorter URL.
      ex: http://some-domain.com/some-looooooooog-url-that-is-really-really-long-and-stuff
          -> http://localhost:1337/short-url-afda8
    2. Do not create a short url if the submitted input is empty.
    3. Make the application redirect from the short URL to the full URL.

  Extra:
    1. Check if the long URL has already been submitted, and return the short
       URL directy instead of generating a new one.
    2. Validate that a short URL is unique before saving it.
    3. Save the data by writing it to a file, so that the data persists even
       if you restart the server.
    4. Submit the form asynchronously so the page doesn't have to refrest to show
       the short URL.
 */

const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const sh = require('shorthash');
const randomstring = require('randomstring');
const fs = require('fs');

// Extra 3
const URL_MAP = require('./url-map.json');

const app = express();

app.set('view engine', 'html');
nunjucks.configure('views', { express: app, watch: true });
app.use(bodyParser.urlencoded({ extended: true }));

// Extra 3
function writeUrlMapToFile() {
  fs.writeFileSync('./url-map.json', JSON.stringify(URL_MAP));
}

// Extra 2
function shortUrlIsUnique(shortUrl) {
  return !Object.keys(URL_MAP).filter((key) => key === shortUrl).length;
}

// Extra 1
function getShortUrlFromLong(longUrl) {
  return Object.keys(URL_MAP).filter((key) => URL_MAP[key] === longUrl);
}

// Extra 1
function urlAlreadySubmitted(longUrl) {
  return !!Object.keys(URL_MAP).filter((key) => URL_MAP[key] === longUrl).length;
}

function generateShortUrl(longUrl) {
  // Extra 2
  const shortUrl = `${sh.unique(longUrl)}-${randomstring.generate(4)}`;
  if (shortUrlIsUnique(shortUrl)) {
    return shortUrl;
  }
  return generateShortUrl(longUrl);
}

function saveUrlToMap(longUrl, shortUrl) {
  URL_MAP[shortUrl] = longUrl;
  // Extra 3
  writeUrlMapToFile();
}

app.get('/:slug', (req, res) => res.redirect(URL_MAP[req.params.slug]));

app.get('/', (req, res) => res.render('form'));

app.post('/', (req, res) => {
  if (req.body.url) {
    let shortUrl;
    // Extra 1
    if (urlAlreadySubmitted(req.body.url)) {
      shortUrl = getShortUrlFromLong(req.body.url);
    } else {
      shortUrl = generateShortUrl(req.body.url);
      saveUrlToMap(req.body.url, shortUrl);
    }
    // Extra 4
    return res.json({ shortUrl: `http://localtest.me:1337/${shortUrl}` });
  }
  // Extra 4
  return res.json();
});

app.listen(1337, () => console.log('URL shortener app listening on port 1337!'));
