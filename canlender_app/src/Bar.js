import React, { Component } from 'react';
import Popup from 'react-popup';
import './style.css'
import './App.css';
import {Radio_Button} from './Prompt.js'


class Bar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 'value',
            type: 'text'
        };

        this.onChange = (e) => this._onChange(e);
        this.onFocus = () => this._onFocus();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.value !== this.state.value) {
            this.props.onChange(this.state.value);
        }
    }

    _onChange(e) {
        let value = e.target.value;

        this.setState({value: value});
    }

    _onFocus(){
        console.log("he")
        this.setState({type: 'datetime-local'});
    }

    render() {
        return (
            <div className='bar'>
                <button className='barbutton' onClick={this.props.merge}>Merge</button>
                <button className='barbutton' onClick={this.props.add} >Add</button>


                <Radio_Button className='radiogroup' value="AllEvents" onChange={this.props.priority} retrieve="True"/>

                <button className='barbutton' onClick={this.props.csv} >CSV</button>

                <button className='barbutton' onClick={this.props.logout} >Log Out</button>
            </div>
        )
    }
}

export default Bar;