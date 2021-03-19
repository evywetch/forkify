/*
=> The goal of this module, is to contain a couple of functions that we reuse over and over in our project
=> getJSON function will be an async function which will do the fetching and also converting to json all in 1 step.
=> Setting a time after which we make the request fail. This is important for preventing if we have really bad internet connections. Otherwise the fetch() could be running forever. 
=> timeout() will return a new Promise, and a promise will reject after a certain amount of seconds.
*/
import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// This function can do both get data from OR send data to API
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

/*

// Get JSON from API
export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
  
    // Promise.race() will let 2 promises race with each other, take only 1 promise which occurs 1st
    // We do it for preventing if we have really bad internet connections. Otherwise the fetch() could be running // forever.
   
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    // convert a response to json // json() is available on all response objects // res.json() returns a Promise
    const data = await res.json();
     
   // Throw error here for errors that r not from the internet connection problem. Coz the promise will rejects for // only 1 case, internet connection.
   // Use message from data.message coz it gives more info 
    
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    // this data is a resolved value of the promise that getJSON() returns
    return data;
  } catch (err) {
    // Rethrow the error coz we want model.js to handle it
    throw err;
  }
};

// Send JSON to API
=> headers{} == some snippets of text which are informations about the request itself
=> 'Content-Type': 'application/json' == we tell API that the data we gonna send is gonna be in json format, then the API can correctly accept the data and create a new recipe in the DB
=> body == the data that we want to send, must be in json format

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    // API will return a data back after we send a recipe data to it
    // This data contains status and a recipe with id, createdAt and key that is created from API
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};


*/
