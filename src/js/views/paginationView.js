import View from './view.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  //publisher
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      // the closest button of the clicked element
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      // Get the page that the user wants to go from data-goto attribute
      const gotoPage = +btn.dataset.goto;
      handler(gotoPage);
    });
  }
  _generateMarkup() {
    const curPage = this._data.page;
    // round up
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return this._generateNextButton(curPage);
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return this._generatePreviousButton(curPage);
    }
    // Other page
    if (curPage < numPages) {
      return (
        this._generatePreviousButton(curPage) +
        this._generateNextButton(curPage)
      );
    }
    // Page 1, and there are NO other pages
    return ''; // dont render any pagination button
  }
  _generateNextButton(curPage) {
    return `
      <button data-goto ="${
        curPage + 1
      }"class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
  }
  _generatePreviousButton(curPage) {
    return `
      <button data-goto ="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button>
      `;
  }
}

export default new PaginationView();
