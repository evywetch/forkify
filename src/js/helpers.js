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

export const getJSON = async function (url) {
  try {
    /* 
    - Promise.race() will let 2 promises race with each other, take only 1 promise which occurs 1st
    - We do it for preventing if we have really bad internet connections. Otherwise the fetch() could be running forever.
    */
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    // convert a response to json // json() is available on all response objects // res.json() returns a Promise
    const data = await res.json();
    /* 
    => Throw error here for errors that r not from the internet connection problem. Coz the promise will rejects for only 1 case, internet connection.
    => Use message from data.message coz it gives more info 
    */
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    // this data is a resolved value of the promise that getJSON() returns
    return data;
  } catch (err) {
    // Rethrow the error coz we want model.js to handle it
    throw err;
  }
};
