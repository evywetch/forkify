/*
=> About import icons from '../img/icons.svg'; 
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
import { MODEL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable'; // For polyfilling everthing else
import 'regenerator-runtime/runtime'; // For polyfilling async/await
/*
Activate hot module reloading 
 => updating modules in the browser at runtime without needing a whole page refresh
 => module.hot != real JS
 => module.hot = coming from Parcel
 */
if (module.hot) {
  module.hot.accept();
}

/**
 * This function controls redering the recipe according to what recipe user chooses
 */
const controlRecipes = async function () {
  try {
    /*
     =>  window.location = get the entire url of our page
     => hash = # + id = #5ed6604591c37cdc054bc88
     => Using slice(1) coz we only want the id number, cut off #
     */
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // 0. Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());
    // 1. Update bookmarks view to mark selected if the recipe is also in the bookmark
    bookmarksView.update(model.state.bookmarks);

    // 2. Loading recipe
    // do await coz loadRecipe(id) is async function, it returns a promise
    // We don't assign model.loadRecipe(id) to a variable coz it returns an empty promise
    await model.loadRecipe(id);

    // 3. Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

/**
 * This function controls the displaying all recipes according to the query(on the left)
 */
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // console.log(resultsView);
    // 1) Get search query
    const query = searchView.getQuery();
    // console.log(query);
    if (!query) return;

    // 2) Load search results (model.state.search.results == an array contain many recipe objects)
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
    resultsView.renderError();
  }
};

/**
 * This function controls rendering the recipes results when user clicking next/previous page
 * @param {Number} goToPage = the page number that user wants to go to
 */

const controlPagination = function (goToPage) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServing = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

/**
 * Control adding or removing bookmarks and update the bookmark view
 */
const controlAddBookMark = function () {
  // 1) Add OR Remove a bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // 2) Update the text and attribute in HTML of current recipe / then the bookmark icon will appear
  recipeView.update(model.state.recipe);
  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

/**
 * Render bookmarks view
 */
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

/**
 * This function controls adding new recipe
 * @param {Object} The new recipe object
 */
const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();
    // Upload new recipe data
    const ingredients = await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    // Render recipe
    recipeView.render(model.state.recipe);
    // Success message
    addRecipeView.renderMessage();
    // Render bookmark view - don't use update() coz we want to insert new bookmark NOT editing the existing one
    bookmarksView.render(model.state.bookmarks);
    // Change ID in URL -- add id of the newly added recipe in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // Close form after 2.5 sec
    setTimeout(function () {
      addRecipeView._toggleWindow();
    }, MODEL_CLOSE_SEC * 1000); // * 1000 to convert to milliseconds
  } catch (err) {
    console.error('🔥', err);
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServing);
  recipeView.addHandlerAddBookMark(controlAddBookMark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
