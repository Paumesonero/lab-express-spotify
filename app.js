require('dotenv').config();

const express = require('express');
const res = require('express/lib/response');
const hbs = require('hbs');
const async = require('hbs/lib/async');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/artist-search', (req, res) => {
    const { artist } = req.query;
    spotifyApi
        .searchArtists(`${artist}`)
        .then(data => {
            let artistFound = res.render('artist-search-results', data.body.artists)
            console.log('the recieved data from api :', data.body.artists.items)
            return artistFound
        })
        .catch(err => console.log('errrrrroooooooor', err))
})

app.get('/albums/:id', (req, res) => {
    const { id } = req.params;
    spotifyApi
        .getArtistAlbums(id)
        .then(data => {
            //console.log('Artist albums', data.body)
            res.render('albums', data.body)
        })
        .catch(err => console.log('errrrrroooooooor', err))

})

app.get('/tracks/:id', (req, res) => {
    const { id } = req.params;
    spotifyApi
        .getAlbumTracks(id)
        .then(data => {
            res.render('tracks', data.body)
        })
        .catch(err => console.log('audio error', err))
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
