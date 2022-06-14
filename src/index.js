import _ from 'lodash';

// Classes
import DataItem from './js/classes/DataItem';

// Functions
import { currentTime } from './js/classes/Clock';

let fakeDate = {
    "sensors": [
        {
            "key": "Temperatuur",
            "value": 21
        },
        {
            "key": "CO2",
            "value": 45
        },
        {
            "key": "Geluid",
            "value": 75
        }
    ]
}

window.onload = () => {
    init();
    currentTime();
}

async function init() {
    console.log('App loaded!');

    await fetchApiToken();

    if (localStorage.getItem('access_token')) {
        fetchApiData();
    } else {
        createDataItems();
    }
}

/**
 * Fetches the auth token
 * Needs to be more secure
 */
async function fetchApiToken() {
    await fetch(`https://dashboard.cphsense.com/api/v2/auth/new`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({"username": process.env.API_USERNAME, "password": process.env.API_PASSWORD}),
    })
    .then(res => res.json())
    .then((data) => {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
    })
    .catch(err => console.error(err));
}

/**
 * Fetches the latest data of one device using auth token
 */
async function fetchApiData() {
    document.getElementById("data-container").innerHTML = "";

    await fetch(`https://dashboard.cphsense.com/api/v2/devices/${process.env.DEVICE_ID}/latest`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    })
    .then(res => res.json())
    .then(data => createDataItems(data))
    .catch((err) => {
        console.error(err)
    });
}

/**
 * Creates the dataItem dom for each data value
 * @param {Array} data - Array of the data from the fetch call
 */
async function createDataItems(data) {
    if (data) {
        for (let sensor of data.data.sensors) {
            let dataItem = new DataItem(sensor);
            dataItem.init();
        }
    } else {
        console.log("using fake data");
        document.getElementById("data-container").innerHTML = "";
        for (let sensor of fakeDate.sensors) {
            let dataItem = new DataItem(sensor);
            dataItem.init();
        };
    }
}