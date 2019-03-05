import React from 'react';
import './style.scss';
import '../../Styles/main.scss';

class Paginator extends React.Component {
  render() {
    let showPageNumbers = () => {
      let {pageNumber, objectsOnPage, getCollection, count} = this.props,
          totalPages = Math.ceil(count / objectsOnPage),
          result = [];

      if (pageNumber === 1) {
        //if it's current page our 'previous page' arrow should be disabled 
        result.push(
          <button className="paginator__item paginator__item--disabled" key={ 0 }>
            &#8592;
          </button>
        );
      } else {
        result.push(
          <button onClick={ () => getCollection(pageNumber - 1) } className="paginator__item" key={ 0 }>
            &#8592;
          </button>
        );
      }

      for (let i = 1; i <= totalPages; i++) {
        let markup = (
              <button onClick={ () => getCollection(i) } className="paginator__item" key={ i }>
                { i }
              </button>
            );
  
        switch(true) {
          case (i === pageNumber):
            //if it's current page, we are changing class name in markup
            markup = (
              <button className="paginator__item  paginator__item--current" key={ i }>
                { i }
              </button>
            );
            break;
          case (i === 1|| i === 2 || i === (totalPages - 1) || i === totalPages):
          case (Math.abs(pageNumber - i) === 2 && pageNumber === totalPages):
          case (Math.abs(pageNumber - i) === 2 && pageNumber === 1):
          case (Math.abs(pageNumber - i) === 1):
            //if it's closest page numbers, or first and last page number
            //we are not changing our markup
            break;
          case (Math.abs(pageNumber - i) === 2):
          case (pageNumber === 1 && Math.abs(pageNumber - i) === 3):
          case (pageNumber === totalPages && Math.abs(pageNumber - i) === 3):
            //here we changing markup to dispaly dots
            markup = (
              <button className='paginator__dots' key={ i }>
                ...
              </button>
              );
            break;
          default:
            //for all other ceses we are displaying nothing 
            markup = '';
            break;
        }
      result.push(markup);  
      }
  
      if (pageNumber === totalPages) {
        //last element is 'next page' arrow, and if it's last page, so it should be disabled
        result.push(
          <button className="paginator__item paginator__item--disabled" key={ result.length + 1 }>
            &#8594;
          </button>
        );
      } else {
        result.push(
          <button onClick={ () => getCollection(pageNumber + 1) } className="paginator__item" key={ result.length + 1 }>
            &#8594;
          </button>
        );
      }

      return result;
    }

    return (
      <div className="paginator">
        { showPageNumbers() }
      </div>
    )
  }
}

export default Paginator;
