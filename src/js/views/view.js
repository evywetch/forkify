/*
 => This class is going to be a Parent class of all the view.
 => We export a class itself coz we r not going to create any instance of this view. We will only use it as a parent class of other child views.
 => With Parcel and Babel, inharitance between truely private fields and methods(with #) does not work yet. So here we have to use the the old  way of JS of protected methods and properties(using _ )
 */
import icons from 'url:../../img/icons.svg'; // Parcel 2

export default class View {
  _data;

  render(data) {
    // data can be an object or an array object, so we check both cases
    if (!data || (Array.isArray(data) && data.length === 0)) {
      // Exit this function immediately and also so render the error
      return this.renderError();
    }

    this._data = data;
    const markup = this._generateMarkup();
    // Set recipeContainer empty first
    this._clear();
    // Then add recipe in the recipeContainer
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
  // Make it public method,so then the controller can call this method in the controller.js
  renderSpinner() {
    const markup = `
      <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div> 
      `;
    // Empty parent element
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
  
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
