import React from 'react';
import chroma from 'chroma-js';

import './style.scss';
import '../../Styles/main.scss';


class ReactSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [
        'material',
        'type',
        'technique',

        'datingPeriod',
        'normalized32Colors'
      ],
      mainTag: '',
      mainValue: ''
    }
  }

  handleChangeTag = (e) => {
    if (e.target.value) {
      this.props.filter.tag = '';
      this.props.filter.value = '';
      this.setState({
        mainTag: e.target.value
      });
    } else {
      this.setState({
        mainTag: ''
      });
    }
  }

  handleChangeValue = (e) => {
    if (e.target.value) {
      this.setState({
        mainValue: e.target.value
      });
    }
    this.props.matchingUrlAndFilter(this.state.mainTag, e.target.value);
  }

  render() {    
    //function to show options of select for chosing tag
    let showTagsSelect = () => {
      const tags = this.state.tags,
            result = [];
      tags.sort();
      result.push(
        <option value='' key='-1' className="select-filter__option">Select filter</option>
      );
      for (let i = 0; i < tags.length; i++) {
        if (this.props.filter.tag && tags[i] === this.props.filter.tag) {
          result.push(
          <option
            id={ tags[i] }
            value={ tags[i] }
            key={ i }
            className="select-filter__option"
            selected
          >
            { tags[i] }
          </option>
          );
        } else {
          result.push(
          <option
            id={ tags[i] }
            value={ tags[i] }
            key={ i }
            className="select-filter__option"
          >
            { tags[i] }
          </option>
          );
        }
      }
      return result;
    }

    //after uder chosed tag, he can chose value for API request
    let showValueSelect = () => {
      let result = [],
          mainTag = this.props.filter.tag ? this.props.filter.tag : this.state.mainTag,
          data = this.props.data,
          filterValue = this.props.filter.value;
      result.push(
        <option value='' key='-1' className="select-filter__option">Select value</option>
        );
      if (mainTag) {
        //when something is selected in TagSelect
        //we are setting options for valueSelect
        let values = data[mainTag]; // getting from data our array of values
        values.sort((a,b) => {
          let x, y;
          if (mainTag === 'datingPeriod') {
            x = parseInt(a.key);
            y = parseInt(b.key);
          } else {
            x = a.key;
            y = b.key;
          }
          if (x > y) return 1;
          if (y > x) return -1;
        });
        for (let i = 0; i < values.length; i++) {
          let styling = {};
          if (mainTag === 'normalized32Colors') {
            //next string adding styling only when user chosed colors. we will change color of background optins to make it easier to see color
            styling = { 'backgroundColor': chroma(values[i].key.match(/\#\w*/g).join('')) }; //sometimes from api we receive value with space before hashtag symbol - our regexp is fixing this problem
            filterValue = '#' + this.props.filter.value;
          }
          if (filterValue && values[i].key == filterValue) {
            //when something is passed into filter
            //that happens only from ArtObjectDetails page
            //and value is same, so we add to this option tag selected
            //ERROR Cause i use selected attribute, we got error: 
            //Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>
            //https://github.com/zenoamaro/react-quill/issues/87 - soluting with defaultValue is not working
            //because when you render first time select with defaulValue... actualy it doesn't show this option 
            //been selected. So i decided to use 'selected' attribute 
            result.push(
              <option
                id={ values[i].key }
                value={ values[i].key }
                key={ i }
                className="select-filter__option"
                selected
                style={ styling }
              >
                { values[i].key }
              </option>  
              );
          } else {
            //for all other casess we do not add selected attribute
            result.push(
            <option
              id={ values[i].key }
              value={ values[i].key }
              key={ i }
              className="select-filter__option"
              style={ styling }
            >
              { values[i].key }
            </option>            
            );
          }
        }
      }

      return result;
    }
    
    //if tag is selected we can remove disabled class from 
    //second select(which show options of tag)
    let valueSelectClass = '';
    if (this.state.mainTag || this.props.filter.tag) {
      valueSelectClass = 'select-filter__input';
    } else {
     valueSelectClass = 'select-filter__input select-filter__input--disabled';
    }

    return (
      <div className="select-filter">
        <select
          onChange={this.handleChangeTag}
          name="tagSelect"
          id="tagSelect"
          className="select-filter__input"
        >
          { showTagsSelect() }
        </select>
        <select
          onChange={this.handleChangeValue}
          name="valueSelect"
          id="valueSelect"
          className={ valueSelectClass }>
          { showValueSelect() }
        </select>
      </div>
    );
  }
}

export default ReactSelect;
