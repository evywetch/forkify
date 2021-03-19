import { async } from 'regenerator-runtime';
import { API_URL, REC_PER_PAGE, KEY } from './config.js'; // import Name importing by specifying variable names in {}
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: REC_PER_PAGE,
  },
  bookmarks: [],
};

/* 
    => Reformat the property names in 'recipe' by assigning data.data.recipe object to 'recipe'
    =>  const { recipe } = data.data;  :  const recipe  = data.data.recipe;
    */
const createRecipeObject = function (data) {
  /*
  NOTE: How to conditionally add a property to an object
         ...(recipe.key && { key: recipe.key })
   => && operator short-circuits
   => if recipe.key is falty value, if it doesn't exist, then nothing happens here, then ... (destructuring) does nothing
   => But if recipe.key has value, or does exist then the 2nd part of the operator { key: recipe.key }, is executed and returned. That means { key: recipe.key } is going to be returned, then the whole expression (recipe.key && { key: recipe.key }) will become the returned object, then we can spread that object to put the value here(the ... part). The outcome will be key: recipe.key
   */
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

// It's an async function, so it returns a promise by default.
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);
    // If the recipe is bookmarked, it will has bookmark icon when the recipe is loaded
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    console.log(state.recipe);
  } catch (err) {
    console.error(`${err}🔥🔥🔥🔥`);
    throw err; // let controller handle it
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    // By adding a KEY in url, it will load all recipes including the ones that contains our own key
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    // console.log(data);
    /*
     => We want to create a new array which contains the new objects where the property names are different. We want to follow the camel case convention for the varaible names Ex. image_url => image
     */
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    //Set page = 1 everytime that user querys new results, if not,it won't update the page for new results
    state.search.page = 1;
    // console.log(state.search.results);
  } catch (err) {
    console.error(`${err}🔥🔥🔥🔥`);
    throw err; // let controller handle it
  }
};
// This function responsible for pagination, returns 10 results(recipes) each page
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 10
  return state.search.results.slice(start, end); // slice() doesn't take the end position
};

export const updateServings = function (newServings) {
  // Update ingredients quantity
  state.recipe.ingredients.forEach(ing => {
    // newQt = (oldQt * newServings) / oldServinds
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  // Update servings
  state.recipe.servings = newServings;
};
const persistBookmarks = function () {
  // Add bookmark
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add to bookmarks array
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  /* 
  If the id of the recipe that we pass in here === the id of the current recipe(loaded on the page), then add bookmarked property and set it to true to this recipe
  */
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};
export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  // Delete bookmark
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

// Upload the recipe to the API : newRecipe = a recipe object
export const uploadRecipe = async function (newRecipe) {
  /*
We put code in try-catch block here coz we expect an error may occur here, then we rethrow it, coz we want the controller to handle it and render the orror on the page later.
  */
  console.log(newRecipe);
  try {
    // 1) Create an ingredients array format for a recipe
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // Replace an empty space with an empty string
        //   const ingArr = ing[1].replaceAll('', '').split(',');
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredients format! Please use the correct format :)'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    // 2) Create a recipe object for API
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    // The recipe that user create will have a key, use this to make an icon for the recipe that user create self
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
    console.log(data);
  } catch (err) {
    throw err;
  }
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();
