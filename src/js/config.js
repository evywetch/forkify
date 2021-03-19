/*
 => In this file, we will basically put all the variables that should be constants and should be reused accross the project.
 => The goal of having this file with all these variables, is that it will allow us to easily configure our project by simply changing some of the data that is here, in this configuration file.
 => The variables that we want to put here are the ones that are responsible for kind of defining some important data about the application itself
 => Constant variables naming convention -> use capital letter, coz its a constant that will never change.
 => We get the KEY from the Forkify API
 */

export const API_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes/';
export const TIMEOUT_SEC = 10;
export const REC_PER_PAGE = 10;
export const KEY = '94cbc54a-fbcc-4ec5-89d5-6f6a51a378fb';
export const MODEL_CLOSE_SEC = 2.5;
