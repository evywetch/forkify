import View from './view.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded :)';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  /*
  => NOTE: We create the constructor for class, coz we want to initialize _addHandlerShowWindow() when the page load. Normally we will call the handler methid in the init() of the controller coz most of handler in this app has to use the function in the controller. But this handler doesn't lean on any functions of controller, and the controller does not interfere it at all, so we just call it here.
  => this constructor will be executed if we export new AddRecipeView() and import this object in the controller, then the controller will execute this file, then the object here will be created
  */
  constructor() {
    // We have to call super() coz this class is a child class, so then we can use 'this' keyword
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }
  _toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    /*
     =>  NOTE: BUG example: this code will create a bug coz we CAN'T use 'this' keyword inside of a handler function or any function ('this' keyword won't work in the function). 
     => NOTE: this._overlay.classList.toggle('hidden'); == 'this' keyword of this line points to _btnOpen(the element that attach to addEventListener()). Which is not wat we want. We want 'this' keyword points to the object of this class.
     => Use bind(this) to make this' keyword inside of a handler function points to the AddRecipeView object
      ============================
    this._btnOpen.addEventListener('click', function () {
      this._overlay.classList.toggle('hidden');
      this._window.classList.toggle('hidden');
    });
    */
    this._btnOpen.addEventListener('click', this._toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this._toggleWindow.bind(this));
    // overlay = if the user click outside the form, the form will also disappear
    this._overlay.addEventListener('click', this._toggleWindow.bind(this));
  }
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      // Pass a form element in  FormData constructor, this = _parentElement
      // FormData returns a wierd object that we can't really use, so we have to spread that object into an array
      // [...new FormData(this)] == an array contains arrays of each field
      // This array will contain all the fields with all the values in there.
      const dataArr = [...new FormData(this)];
      // Covert an array of arrays To an object with many properties
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
