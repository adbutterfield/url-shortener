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

const app = express();

app.set('view engine', 'html');
nunjucks.configure('views', { express: app, watch: true });

app.get('/', (req, res) => {
  const data = {
    title: 'URL SHORTENER!!!',
    formLabel: 'Enter a URL to shorten:',
    formInputPlaceholder: 'Long URL goes here...',
  };
  return res.render('form', data);
});

app.listen(1337, () => console.log('URL shortener app listening on port 1337!'));
