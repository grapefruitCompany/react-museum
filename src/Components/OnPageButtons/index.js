import React from 'react';
import './style.scss';
import '../../Styles/main.scss';

//this component is displaying buttons which switch quantity of objects on page

class OnPageButtons extends React.Component {

  render() {
    let showButtons = () => {
      let {objectsOnPage, getCollection} = this.props,
          values = [10, 20, 50, 100],
          result =[];
      for (let i = 0; i < values.length; i++) {
        let value = values[i],
            classCurrent = objectsOnPage === value ? 'btn-on-page btn-on-page--current' : 'btn-on-page';
        result.push(
          <button
            onClick={ () => getCollection(1, value) }
            className={ classCurrent }
            key={ i }
          >
            { value }
          </button>
        );
      }
      return result;
    }

    return (
      <>
        { showButtons() }
      </>
    )
  }
}

export default OnPageButtons;
