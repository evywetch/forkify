class SearchView {
  _parentElement = document.querySelector('.search');
  getQuery() {
    // Get the query
    const query = this._parentElement.querySelector('.search__field').value;
    // Clear the search input field
    this._clearInput();
    return query;
  }
  // Clear the input field after user submit the search box
  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }
  // The publisher
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      /* 
          => Can't pass a handler function here directly coz when we submit the form, we need to first prevent the default action, otherwise the page is going to reload
          */
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
