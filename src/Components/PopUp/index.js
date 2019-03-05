import React from 'react';
import { Link } from 'react-router-dom'
import './style.scss';
import '../../Styles/main.scss';

class PopUp extends React.Component {
  render() {
    let popUpClass = ['pop-up '],
        urlArtObjectDetail = '/';
    const popUpContent = this.props.popUpContent;
    if (popUpContent.objectNumber.length) {
      //when it's clicked on art object item we receive props 
      //and we are changing class name to display popUp 
      popUpClass.push('pop-up--show');
      //setting url that we will use when go to Art Object Details Page
      urlArtObjectDetail = urlArtObjectDetail + this.props.popUpContent.objectNumber;
    } 

    return (
      <div className={ popUpClass.join(' ') }>
        <div className="pop-up__inner">
          <img className="pop-up__img" src={ popUpContent.webImageUrl } alt="masterpiece"/>
            <div className="pop-up__content">
              <div className="pop-up__text">
                <h2 className="pop-up__title">{ popUpContent.longTitle }</h2>
                <p className="pop-up__desc">{ popUpContent.description }</p>
              </div>
              <Link to={ urlArtObjectDetail } className="pop-up__btn">View more details</Link>
            </div>
          <button onClick={ () => this.props.closeModalWindow() } className="pop-up__close">&#10006;</button>
        </div>        
    </div>
    )
  }
}

export default PopUp;
