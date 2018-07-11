import React, { Component } from 'react';
import Popup from 'react-popup';
import './style.css'
import {CSVLink, CSVDownload} from 'react-csv';
import './App.css';




/** The prompt content component */
class Datetime_Prompt extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value,
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
                <input type={this.state.type} placeholder={this.props.placeholder} max="4000-12-31" className="mm-popup__input"  value={this.state.value} onChange={this.onChange}  onFocus={this.onFocus} />

            </div>
        )
    }
}


class Text_Prompt extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value
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
                <input type="text" className="mm-popup__input"  value={this.state.value} onChange={this.onChange}  />

            </div>
        )
    }
}

class Radio_Button extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            priority : this.props.value,
            retrieval: this.props.retrieve
        };


    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.priority !== this.state.priority) {
            this.props.onChange(this.state.priority);
        }
    }

    onInputChange = (event) => {
        this.setState({
            priority: event.target.value
        })
    }


    render() {
        let allEventsButton = ""
        if (this.state.retrieval == "True"){
            allEventsButton = <div><input type="radio" value="AllEvents"
                                          checked={this.state.priority === 'AllEvents'}
                                          onChange={this.onInputChange}  />
                <label htmlFor="high">All Events</label></div>
        }

        return (
            <div className='radiogroup'>
                {allEventsButton}
                <input type="radio" value="high"
                       checked={this.state.priority === 'high'}
                       onChange={this.onInputChange}  />
                <label htmlFor="high">High</label>

                <input type="radio" value="medium"
                       checked={this.state.priority === 'medium'}
                       onChange={this.onInputChange}  />
                <label htmlFor="medium">Medium</label>

                <input type="radio" value="low"
                       checked={this.state.priority === 'low'}
                       onChange={this.onInputChange}  />
                <label htmlFor="low">Low</label>
            </div>

        )
    }
}

Popup.registerPlugin('new', function (defaultValue, add_action, startdate, enddate, callback) {
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

    let priorityValue = "high";
    let priorityChange = function (value) {
        priorityValue = value
    }

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
            <p></p><p>Priority</p>
            <div>
                <Radio_Button value="high" onChange={priorityChange} retrieve="False"/>
            </div>


        </div>,
        buttons: {
            left: ['cancel'],
            right: [{
                text: 'Save',
                key: '⌘+s',
                className: 'success',
                action: function () {
                    callback(start_promptValue, end_promptValue, title_promptValue, description_promptValue, priorityValue, add_action);
                    Popup.close();
                }
            }

            ]
        }
    });
});

/** Prompt plugin */
Popup.registerPlugin('modify', function (defaultValue, edit_action, delete_action, startdate, enddate, title, description, priority, callback) {
    let start_promptValue = startdate;
    let start_promptChange = function (value) {
        start_promptValue = value;
    };

    let end_promptValue = enddate;
    let end_promptChange = function (value) {
        end_promptValue = value;
    };

    let title_promptValue = title;
    let title_promptChange = function (value) {
        title_promptValue = value;
    };

    let description_promptValue = description;
    let description_promptChange = function (value) {
        description_promptValue = value;
    };

    let priorityValue = priority;
    let priorityChange = function (value) {
        priorityValue = value
    }

    this.create({
        title: 'Modify Your Event',
        content: <div>
            <p>Start Time</p>
            <Datetime_Prompt onChange={start_promptChange} placeholder={startdate}  value={startdate} />
            <p>End Time</p>
            <Datetime_Prompt onChange={end_promptChange} placeholder={enddate}  value={enddate} />
            <p>Title</p>
            <Text_Prompt onChange={title_promptChange} placeholder={title}  value={title} />
            <p>Description</p>
            <Text_Prompt onChange={description_promptChange}  placeholder={description} value={description} />
            <p></p><p>Priority</p>
            <div>
                <Radio_Button value={priority} onChange={priorityChange} />
            </div>

        </div>,
        buttons: {
            left: ['cancel'],
            right: [{
                text: 'Save',
                key: '⌘+s',
                className: 'success',
                action: function () {
                    callback(start_promptValue, end_promptValue, title_promptValue, description_promptValue, priorityValue, edit_action);
                    Popup.close();
                }
            },
                {
                    text: 'delete',
                    key: '⌘+s',
                    action: function () {
                        callback(start_promptValue, end_promptValue, title_promptValue, description_promptValue, priorityValue, delete_action);
                        Popup.close();
                    }
                }

            ]
        }
    });
});

Popup.registerPlugin('csv', function (events, callback) {

    var data = []
    var i = 0
    for (i = 0; i < events.length; i++) {

        var event = {
            start: events[i].start.toLocaleString(),
            end: events[i].end.toLocaleString(),
            title: events[i].title,
            description: events[i].desc,
            priority: events[i].prior
        }
        data.push(event)


    }
    var today = new Date()
    var month = today.getMonth()+1
    var filename = "backup-" + today.getFullYear() + "-" + month + "-" + today.getDate() + ".csv"


    this.create({
        title: 'Download Your Events Data',
        content:<div>
            <CSVLink data={data} filename={filename}>Click me to Download ⬇</CSVLink>


        </div>,
        buttons: {
            left: ['cancel'],
            right: [{
                text: 'back',
                key: '⌘+s',
                className: 'success',
                action: function () {
                    callback(events);
                    Popup.close();
                }
            }

            ]
        }
    });
});


Popup.registerPlugin('merge', function (defaultValue, action, id, callback) {


    let id_promptValue = id;
    let id_promptChange = function (value) {
        id_promptValue = value;
    };

    this.create({
        title: 'Modify Your Event',
        content: <div>

            <p>Enter Calendar ID</p>
            <Text_Prompt onChange={id_promptChange}  placeholder={id} value={id} />

        </div>,
        buttons: {
            left: ['cancel'],
            right: [{
                text: 'merge',
                key: '⌘+s',
                className: 'success',
                action: function () {
                    callback(id_promptValue, action);
                    Popup.close();
                }
            }]
        }
    });
});



export {
    Radio_Button,
    Text_Prompt
}

