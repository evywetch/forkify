import { async } from 'regenerator-runtime';
import { API_URL } from './config.js'; // import Name importing by specifying variable names in {}
import { getJSON } from './helpers.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
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
    console.log(data);
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
    console.log(state.search.results);
  } catch (err) {
    console.error(`${err}🔥🔥🔥🔥`);
    throw err; // let controller handle it
  }
};

loadSearchResults('pizza');
