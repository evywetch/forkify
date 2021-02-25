/*
=> Anout import icons from '../img/icons.svg'; 
  => We import it coz there are codes in const markup need to access icons from icons.svg
  => '../img/icons.svg' when we point out to the directory of a file, we look from the position that this file (controller.js) is, this file is in a src folder, we want to point to icons.svg. So the .. means the parent of this file with is src folder.
=> With Parcel 2
  => If we need to access the static assets that is not programming files eg. images, video,sound, etc. We need to write the path begin with url: Ex. import icons from 'url:../img/icons.svg'; 
=> App logic
  => Render recipe whenever the 'hash' on the page URL is changed
  => Or render recipe whenever the page is loading (this case, the url has to contain the hash)
=> File directory
  => './model.js'  . = the current directory coz controller.js and model.js are in the same folder. So to be able to reach model.js, we starting from the current folder(js folder) then go to model.js
 NOTE: 
 => If u call an async function, have to await 
*/

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import 'core-js/stable'; // For polyfilling everthing else
import 'regenerator-runtime/runtime'; // For pokufilling async/await
const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2
// https://forkify-v2.netlify.app/

///////////////////////////////////////

const controllRecipes = async function () {
  try {
    /*
     =>  window.location = the entire url og our page
     => hash = # + id = #5ed6604591c37cdc054bc88
     => Using slice(1) coz we only want the id number, cut off #
     */
    const id = window.location.hash.slice(1);
    console.log('id = ' + id);

    if (!id) return;
    recipeView.renderSpinner();

    // 1. Loading recipe
    // do await coz loadRecipe(id) is async function, it returns a promise
    // We don't assign model.loadRecipe(id) to a variable coz it returns an empty promise
    await model.loadRecipe(id);
    // 2. Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
  }
};

controllRecipes();

/*
window.addEventListener('hashchange', showRecipe);
// 'load' event = showRecipe will be called immediately after the page has completely loading
window.addEventListener('load', showRecipe);
*/

['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, controllRecipes)
);
