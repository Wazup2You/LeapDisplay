import _ from 'lodash';

// Classes
import DataItem from './js/classes/DataItem';

window.onload = () => {
    init();
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
        await fetch("http://127.0.0.1:5500/fakeData.json")
        .then(res => res.json())
        .then((data) => {
            for (let sensor of data.sensors) {
                let dataItem = new DataItem(sensor);
                dataItem.init();
            }
        });
    }
}