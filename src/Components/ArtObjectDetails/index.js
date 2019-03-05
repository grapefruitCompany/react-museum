import React from 'react';
import './style.scss';
import '../../Styles/main.scss';
import chroma from 'chroma-js';
import { Link } from "react-router-dom";

//this is page dispay all info about art object
//we are coming to this page from PopUp

class ArtObjectDetails extends React.Component {
  state = {
    objectNumber: null,
    longTitle: null,
    plaqueDescriptionDutch: null,
    plaqueDescriptionEnglish: null,
    webImageUrl: null,
    //further is tags wich we are using for filter
    type: null,
    datingPeriod: null,
    technique: null,
    normalized32Colors: null,
    material: null,
  }

  componentDidMount() {
    const { objectnumber } = this.props.match.params;
    let url = `https://www.rijksmuseum.nl/api/nl/collection/${objectnumber}?key=E7u3uumr&format=json`;//we are requesting additional info from api about this object
    fetch(url)
      .then(response => {
        response.json().then(data => {
          let {
              objectNumber,
              normalized32Colors,
              longTitle,
              plaqueDescriptionDutch,
              plaqueDescriptionEnglish,
              dating, 
              materials,
              webImage,
              techniques,
              objectTypes
            } = data.artObject;//destrusturing all data that we need
          if (!webImage) webImage = {url: './img/No_Image_available.jpg'};//if we don't have image, we are using no image piture
          this.setState({
            objectNumber: objectNumber,
            longTitle: longTitle,
            plaqueDescriptionDutch: plaqueDescriptionDutch,
            plaqueDescriptionEnglish: plaqueDescriptionEnglish,
            webImageUrl: webImage.url,
            //further is tags wich we using for filter
            material: materials,
            type: objectTypes,
            technique: techniques,
            datingPeriod: dating.period,
            normalized32Colors: normalized32Colors,
          });
        })
      })
  }

  render() {
    const image = {
      backgroundImage: 'url(' + this.state.webImageUrl + ')',
    };

    let showDecription = (lang, desc) => {
      //this function for displaying dicription if it has it
      let result;
      if (desc && lang === 'en') {//decription in english
        result = (
          <div>
            <h3 className='art-page__title art-page__title--sub'>Description in English</h3>
            <p>{ desc }</p>
          </div>
        );
      } else if (desc && lang === 'nl') {//decription in dutch
        result = (
          <div className='art-page__desc'>
            <h3 className='art-page__title art-page__title--sub'>Description in Dutch</h3>
            <p>{ desc }</p>
          </div>
        );
      }
      return result;
    }

    let showPeriod = (data) => {
      //this function is dispaying pariod and adding link to it
      let result;
        if (data) { //for each type of data there is different condition statement
          result = (
            <li className="art-page__item">
              Period: 
              <Link
                className="art-page__link"
                to={{
                  //here we pass parametrs by link
                  pathname: '/',
                  state: {
                    tag: 'datingPeriod', //name of the tag
                    value: data //value of tag
                  }
                }}
              >
                { data }
              </Link>
            </li>
          );
        }
      return result;
    }
    
    let showArray = (tagName, data) => {
      //this function is for dispaying array like material, type and so on
      let links = [];
        if (data && data.length) {
          for (let i = 0; i < data.length; i++) {
            let tagLowerCase = tagName.toLowerCase(); 
            links.push(
              <Link
                key={ i }
                className="art-page__link"
                to={{
                  pathname: '/',
                  state: {
                    tag: tagLowerCase,
                    value: data[i]
                  }
                }}
              >
                { data[i] }
              </Link>
            );
          }
        return (
          <li className="art-page__item">
            { tagName }: 
            { links }
          </li>
        );
        }
    }

    let showColor = (data) => {
      //for color we use specific funtion because of styling
      let links = [];
        if (data && data.length) {
          for (let i = 0; i < data.length; i++) {
            //we are changing color of background of the button depending on each color hex
            //for this we are using chroma() npm package
            let styling = { 'backgroundColor': chroma(data[i].match(/\#\w*/g).join('')) };
            links.push(
              <Link
                key={ i }
                className="art-page__link"
                style={ styling }
                to={{
                  pathname: '/',
                  state: {
                    tag: 'normalized32Colors',
                    value: data[i].match(/\#\w*/g).join('')
                  }
                }}
              >
                { data[i] }
              </Link>
            );
          }
        return (
          <li className="art-page__item">
            Normalized colors: 
            { links }
          </li>
          );
        }
    }

    return (
      <div className="art-page">
        <div className="art-page__container" style={image} >
        </div>
        <div className="art-page__content">
          <h1 className="art-page__title">{ this.state.longTitle }</h1>
          <div>
            <ul className="art-page__list">
              { showArray('Type', this.state.type) }
              { showPeriod(this.state.datingPeriod) }
              { showArray('Technique', this.state.technique) }
              { showArray('Material', this.state.material) }
              { showColor(this.state.normalized32Colors) }
            </ul>
            { showDecription('nl', this.state.plaqueDescriptionDutch) }
            { showDecription('en', this.state.plaqueDescriptionEnglish) }
          </div>
          <Link
            className="art-page__link art-page__link--main"
            to={{
              pathname: '/',
            }}
          >
            Go To Main Page
          </Link>
        </div>
      </div>
    );
  }
}

export default ArtObjectDetails;

