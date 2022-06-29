import _ from 'lodash';

// Classes
import DataItem from './js/classes/DataItem';

// Functions
import { currentTime } from './js/classes/Clock';

// Functions
import { displaySlide } from './js/classes/SlideShow';

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
    // displaySlide();
}

async function init() {
    console.log('App loaded!');

    await fetchApiToken();

    if (localStorage.getItem('access_token')) {
      await fetchApiData();
    } else {
        await createDataItems();
    } 

} 

// Slide show
let currentSlideIndex = 0;
function showSlide() {
    console.log('in show slide')
    let i;
    for (i = 0; i < fakeDate.sensors.length; i++) {
        console.log('test')
    let showItem = document.getElementById(`dataItem-${i}`)
    showItem.classList.remove("data-wrapper")
    showItem.classList.add("hidden")
    }
    console.log(currentSlideIndex)
    currentSlideIndex++;
    console.log(currentSlideIndex)
    if (currentSlideIndex == fakeDate.sensors.length) {currentSlideIndex = 0}   
    let item = document.getElementById(`dataItem-${currentSlideIndex}`)
    item.classList.remove('hidden')
    item.classList.add('data-wrapper')
    setTimeout(showSlide, 3000); // Change image every 2 seconds
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
    .then(data => createDataItems(data[0]))
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
            let index = fakeDate.sensors.findIndex(item => item == sensor); 
            dataItem.init(index);

        };
    }
    showSlide()
}