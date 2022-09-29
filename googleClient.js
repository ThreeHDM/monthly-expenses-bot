const {google} = require('googleapis');
const keys = require('./keys.json')

const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

module.exports = client