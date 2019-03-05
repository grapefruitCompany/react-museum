import React from 'react';
import ArtObjectItem from '../ArtObjectItem';
import Paginator from '../Paginator';
import OnPageButtons from '../OnPageButtons';
import SelectFilter from '../SelectFilter';
import './style.scss';
import '../../Styles/main.scss';

//Search by maker doesn't work at all: https://github.com/Rijksmuseum/api-issues/issues/11

class MainPage extends React.Component {
  state = {
    filter: {
      tag: '',
      value: ''
    },
    artObjects: [],
    count: null,
    pageNumber: 1,
    objectsOnPage: 20,
    baseUrl: 'https://www.rijksmuseum.nl/api/nl/collection?key=E7u3uumr&format=json',
    lastUrl: 'https://www.rijksmuseum.nl/api/nl/collection?key=E7u3uumr&format=json',
    byAuthor: false, //is it should be sorted by author or not
    //further goes lists of tags
    type: [],
    datingPeriod: [],
    material: [],
    technique: [],
    normalized32Colors: []
  }

  componentDidMount() {
    if (this.props.location.state) {
      //if we passed some props by link, it happens from components ArtObjectDetails
      // and SelectFilter we receive tag and value in location.state
      this.matchingUrlAndFilter(this.props.location.state.tag, this.props.location.state.value);
    } else {
      //if not, just launching regulart api request
      this.getCollection(this.state.pageNumber, this.state.objectsOnPage);
    }
  }

  matchingUrlAndFilter(tag, value) {
    //this function specifies url link for each api request depending on tag and value
    //that we received from components ArtObjectDetails and SelectFilter
    let currentUrl;
    switch (tag) {
      case ('normalized32Colors'):
        value = value.match(/\w*/g).join('');//we receive value of color like, #B0B0B0 but for api request we must put aside hashtag symbol
        currentUrl = this.state.baseUrl + '&f.normalized32Colors.hex=%23' + value;//here we specify link for api request depending on each tag
        this.setState({
          filter: {
            //updating state with actual filters working
            tag: 'normalized32Colors',
            value: value
          }
        });
        this.getFilter(currentUrl);//luanching api request with specified url
        break;
      case ('type'):
        currentUrl = this.state.baseUrl + '&type=' + value;
        this.setState({
          filter: {
            tag: 'type',
            value: value
          }
        });
        this.getFilter(currentUrl);
        break;
      case ('datingPeriod'):
        currentUrl = this.state.baseUrl + '&f.dating.period=' + value;
        this.setState({
          filter: {
            tag: 'datingPeriod',
            value: value
          }
        });
        this.getFilter(currentUrl);
        break;
      case ('material'):
        currentUrl = this.state.baseUrl + '&material=' + value;
        this.setState({
          filter: {
            tag: 'material',
            value: value
          }
        });
        this.getFilter(currentUrl);
        break;
      case ('technique'):
        currentUrl = this.state.baseUrl + '&technique=' + value;
        this.setState({
          filter: {
            tag: 'technique',
            value: value
          }
        });
        this.getFilter(currentUrl);
        break;
      default:
        console.log('Error!\n', this.props.location.state.tag, '\n No match!');
        this.getCollection(this.state.pageNumber, this.state.objectsOnPage);
    }
  }

  getFilter(currentUrl) {
    this.setState({
      lastUrl: currentUrl, //updationg current url for request in state
      pageNumber: 1
    });
    fetch(`${currentUrl}&p=${this.state.pageNumber}ps=${this.state.objectsOnPage}`)
      .then(response => {
        response.json()
        .then(data => {
          if (this.state.byAuthor) {
            data.artObjects = this.sortByAuthor(data.artObjects);
          }
          this.setState({
            //refreshing all data in state
            artObjects: data.artObjects,
            count: data.count,
          });
        })
      })
  }

  getCollection(pageNumber, objectsOnPage = this.state.objectsOnPage) {
    //this function is making request for pagination or for displaying different quantity of art objects on page 
    let currentUrl = this.state.lastUrl;
    fetch(`${currentUrl}&p=${this.state.pageNumber}&ps=${objectsOnPage}`)
      .then(response => {
        response.json().then(data => {
          if (this.state.byAuthor) {
            data.artObjects = this.sortByAuthor(data.artObjects);
          }
          this.setState({
            artObjects: data.artObjects,
            count: data.count,
            pageNumber: pageNumber,
            objectsOnPage:  objectsOnPage,
            type: data.facets[1].facets,
            datingPeriod: data.facets[2].facets,
            material: data.facets[4].facets,
            technique: data.facets[5].facets,
            normalized32Colors: data.facets[6].facets
          });
        })
      })
      .catch(error => console.log(error)); 
  }

  getAllMatches(query) {
    //this function is looking all matches in ort object also it's used for reset
    let currentUrl = `${this.state.baseUrl}&q=${query}`;
    this.setState({
      lastUrl: currentUrl,
      pageNumber: 1
    });
    fetch(`${currentUrl}&p=${this.state.pageNumber}&ps=${this.state.objectsOnPage}`)
      .then(response => {
        response.json().then(data => {
          if (this.state.byAuthor) {
            data.artObjects = this.sortByAuthor(data.artObjects);
          }
          this.setState({
            artObjects: data.artObjects,
            count: data.count,
            type: data.facets[1].facets,
            datingPeriod: data.facets[2].facets,
            material: data.facets[4].facets,
            technique: data.facets[5].facets,
            normalized32Colors: data.facets[6].facets
          });
        })
      })
      .catch(error => console.log(error)); 
  }

  sortByAuthor(arr) {
    return arr.sort((a, b) => {
      if (a.principalOrFirstMaker > b.principalOrFirstMaker) return 1;
      if (a.principalOrFirstMaker < b.principalOrFirstMaker) return -1;
    });
  }

  handleChange(e) {
    //when we put somting in search input
    if (e.target.value && e.target.value.length > 1) {
      this.getAllMatches(e.target.value);
    } else if (e.target.value.length === 0) {
    this.getAllMatches('');
    }
  }

  orderByAuthor() {
    this.setState({
      byAuthor: !this.state.byAuthor
    });
    this.getCollection(1);
  }

  reset() {
    //when we reset our form
    this.getAllMatches('');
  }

  render() {
    let count = this.state.count > 10000 ? 10000 : this.state.count,//we reseive by api no more then 10 000 art objects
        numberArtObjectsFrom = this.state.objectsOnPage * this.state.pageNumber - this.state.objectsOnPage + 1,
        numberArtObjectsTo = (numberArtObjectsFrom + this.state.objectsOnPage) > count ? count : (this.state.objectsOnPage * this.state.pageNumber);
    return (
      <div className="main-page" >
        <form className="main-page__form">
          <div className="main-page__order-by">
            <input
              onChange={ this.orderByAuthor.bind(this) }
              id="orderByAuthor"
              type="checkbox"
              className="main-page__cbx"
            />
            <label htmlFor="orderByAuthor" className="main-page__box"></label>
            <label htmlFor="orderByAuthor" className="main-page__lbl">
              Order By Author
            </label>
          </div>
          <SelectFilter
            filter={ this.state.filter }
            data={ this.state }
            matchingUrlAndFilter={ this.matchingUrlAndFilter.bind(this) }
          />
          <div className="main-page__search">
            <input
              id="search"
              type="text"
              onChange={ this.handleChange.bind(this) }
              className="main-page__search-input"
              placeholder="Search for..."
            />
            <span className="main-page__search-border"></span>
          </div>
          <button className="main-page__reset" type="reset" value="reset" onClick={ this.reset.bind(this) }>Reset</button>
        </form>
        
        <ArtObjectItem artObjects={ this.state.artObjects }/>
        <div className="main-page__bottom">
          <div className="main-page__info">
            <p className="main-page__text">
              Show { numberArtObjectsFrom } to { numberArtObjectsTo } from { count } Art Objects
            </p>
          </div>
          <div className="main-page__paginator">
            <Paginator
              pageNumber={ this.state.pageNumber }
              objectsOnPage={ this.state.objectsOnPage }
              count={ count }
              getCollection={ this.getCollection.bind(this) }
            />
          </div>
          <div className="main-page__on-page">
            <OnPageButtons
              objectsOnPage={ this.state.objectsOnPage }
              getCollection={ this.getCollection.bind(this) }
            />
          </div>
        </div>
      </div>
    )
  }
}

export default MainPage;