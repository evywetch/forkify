/*
 => This class is going to be a Parent class of all the view.
 => We export a class itself coz we r not going to create any instance of this view. We will only use it as a parent class of other child views.
 => With Parcel and Babel, inharitance between truely private fields and methods(with #) does not work yet. So here we have to use the the old  way of JS of protected methods and properties(using _ )
 */
import icons from 'url:../../img/icons.svg'; // Parcel 2
import recipeView from './recipeView';

export default class View {
  _data;

  render(data, render = true) {
    // data can be an object or an array object, so we check both cases
    if (!data || (Array.isArray(data) && data.length === 0)) {
      // Exit this function immediately and also so render the error
      return this.renderError();
    }

    this._data = data;
    const markup = this._generateMarkup();
    /* this if clause is for the rendering algorithm of Results and Bookmarks view, they use PreviewView to generate markup for them, so incase of PreviewView calling this method, we only want the markup.
     */
    if (!render) return markup;
    // Set recipeContainer empty first
    this._clear();
    // Then add recipe in the recipeContainer
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    /**
     NOTE: This method update only the info ex. servings number, amount of ingredients in the DOM, So when we edit some info, we don't have to load the page again, it will change only the TEXT and data ATTRIBUTES in the current page.
     => What we will do here is to create a new markup, but not render it. All we gonna do is to generate this markup and then compare that new HTML to the current HTML and then only change text and attributes that have changed from the old version to the new version.
     => We will convert this markup string to a DOM object that's living in the memory and that we can then use to compare with the actual DOM that's on the page. 
     => document.createRange() will create a range, and on the range we can then call another method.
     => creareContextualFragment() we can pass in a string of markup, it will convert the markup string into real DOM node objects. Basically const newDOM will become like a big object which is like a virtual DOM, means DOM that is not really living on the page but lives in our memory
     => newDOM.querySelectorAll('*') === we select all the element that the newDOM contains ex. span, div, buttons, etc.
     => Array.from() convert node list into an array
     => isEqualNode() used to compare if 2 nodes elements have SAME CONTENT.
     => nodeValue == is a property that is available for all nodes. It will return null if its an element ex. div, button, and reurn a string if its a text type of node
     => firstChild will return a node, a node is a first child of element. We need to select the child, coz child node is what contains the text. Element is just an element, it's an element node, not a text node
     => attributes == is an attribute property on an element, it will return an object contains all atributes of an element.
     NOTE: We have to update both TEXT && ATTRIBUTES coz in the case of increase or decrease number of servings, Ex. A meal for 4 pp, if user click + icon which means a meal for 5 pp. , the system will take the number from dataset of the btn--update-servings element, this number comes from current serving +/- 1, so the dataset from minus icon will be 3 and the dataset from plus icon will be 5. Then it will update the recipe object in the state which will be a recipe for 5 pp., then this new recipe will be use to create new recipe markup which we will use it to compare with the current markup, if there are elements that r not equal, the text will be replace with the new one. BUT we have to replace the attribute data-update-to as well, otherwise when user clicks + icon again, the system will take the dataset from plus icon will be 5 instead of 6, and take this number to update the recipe to become a recipe for 5 pp and update ingredients for 5 pp. servings. But the old recipe was already for 5 pp. So nothing change, then it will generate a new markup from new recipe which the new markup will look exactly the same as the current markup coz the current marup is already a recipe for 5 pp. That y we have to update the dataset of btn--update-servings. 
     */
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // 1) Update: change TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // Update the text content of curEl to text content of newEl
        curEl.textContent = newEl.textContent;
      }

      // 2) Update: change ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        console.log(Array.from(newEl.attributes));
        // Replace all attributes of current element with attributes of new element
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
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
