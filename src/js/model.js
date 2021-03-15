import { async } from 'regenerator-runtime';
import { API_URL, REC_PER_PAGE } from './config.js'; // import Name importing by specifying variable names in {}
import { getJSON } from './helpers.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: REC_PER_PAGE,
  },
};

// It's an async function, so it returns a promise by default.
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

    /* 
    => Reformat the property names in 'recipe' by assigning data.data.recipe object to 'recipe'
    =>  const { recipe } = data.data;  :  const recipe  = data.data.recipe;
    */
    const { recipe } = data.data; //
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    // console.log(state.recipe);
  } catch (err) {
    console.error(`${err}🔥🔥🔥🔥`);
    throw err; // let controller handle it
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);
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
      };
    });
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
