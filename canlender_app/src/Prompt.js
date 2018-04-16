import React, { Component } from 'react';
import Popup from 'react-popup';
import './style.css'





/** The prompt content component */
class Datetime_Prompt extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.datetime,
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
            <div>
            <input type={this.state.type} placeholder={this.props.placeholder} className="mm-popup__input"  value={this.state.value} onChange={this.onChange}  onFocus={this.onFocus} />

            </div>
    )
    }
}


class Text_Prompt extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.datetime
        };

        this.onChange = (e) => this._onChange(e);

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




    render() {
        return (
            <div>
                <input type="text" placeholder={this.props.placeholder} className="mm-popup__input"  value={this.state.value} onChange={this.onChange}  />

            </div>
        )
    }
}

Popup.registerPlugin('new', function (defaultValue, boom, startdate, enddate, callback) {
    let start_promptValue = startdate;
    let start_promptChange = function (value) {
        start_promptValue = value;
    };

    let end_promptValue = enddate;
    let end_promptChange = function (value) {
        end_promptValue = value;
    };

    let title_promptValue = "";
    let title_promptChange = function (value) {
        title_promptValue = value;
    };

    let description_promptValue = "";
    let description_promptChange = function (value) {
        description_promptValue = value;
    };

    this.create({
        title: 'Your Event',
        content:<div>

            <p>Start Time</p>
            <Datetime_Prompt onChange={start_promptChange} placeholder={startdate}  value={startdate} />
            <p>End Time</p>
            <Datetime_Prompt onChange={end_promptChange} placeholder={enddate}  value={enddate} />
            <p>Title</p>
            <Text_Prompt onChange={title_promptChange} placeholder={"Type title here"}  value={""} />
            <p>Description</p>
            <Text_Prompt onChange={description_promptChange} placeholder={"Type description here"}  value={""} />


        </div>,
        buttons: {
            left: ['cancel'],
            right: [{
                text: 'Save',
                key: '⌘+s',
                className: 'success',
                action: function () {
                    callback(start_promptValue, end_promptValue, title_promptValue, description_promptValue, boom);
                    Popup.close();
                }
            }

            ]
        }
    });
});

/** Prompt plugin */
Popup.registerPlugin('prompt', function (defaultValue, placeholder2, callback) {
    let promptValue = null;
    let promptChange = function (value) {
        promptValue = value;
    };

    this.create({
        title: 'Your Event',
        content: <Datetime_Prompt onChange={promptChange} placeholder1={placeholder2} value={defaultValue} />,
        buttons: {
            left: ['cancel'],
            right: [{
                text: 'Save',
                key: '⌘+s',
                className: 'success',
                action: function () {
                    callback(promptValue, 0);
                    Popup.close();
                }
            },
                {
                    text: 'delete',
                    key: '⌘+s'
            }

            ]
        }
    });
});

