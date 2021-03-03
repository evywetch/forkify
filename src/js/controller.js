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

// https://forkify-api.herokuapp.com/v2
// https://forkify-v2.netlify.app/
*/

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import 'core-js/stable'; // For polyfilling everthing else
import 'regenerator-runtime/runtime'; // For polyfilling async/await

///////////////////////////////////////

// This function will handle the showing recipe according to what recipe user chooses
const controlRecipes = async function () {
  try {
    /*
     =>  window.location = the entire url og our page
     => hash = # + id = #5ed6604591c37cdc054bc88
     => Using slice(1) coz we only want the id number, cut off #
     */
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // 1. Loading recipe
    // do await coz loadRecipe(id) is async function, it returns a promise
    // We don't assign model.loadRecipe(id) to a variable coz it returns an empty promise
    await model.loadRecipe(id);

    // 2. Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

// This function handles the displaying all recipes according to the query
const controlSearchResults = async function () {
  try {
    // 1) Get search query
    const query = searchView.getQuery();
    console.log(query);
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    console.log(model.state.search.results);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};

controlSearchResults();
init();
