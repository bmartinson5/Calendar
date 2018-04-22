import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import events from './events'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import Popup from 'react-popup';
import Text_Prompt from './Prompt.js'


BigCalendar.momentLocalizer(moment); // or globalizeLocalizer.


class App extends Component {


    constructor(props) {
        super(props);

        this.state = {
            events:[],
            loggedIn: false,
            calenderID:''

        };


        this.add_action = this.add_action.bind(this);
        this.edit = this.edit.bind(this);
        this.delete_action = this.delete_action.bind(this);
        this.load_events = this.load_events.bind(this);
        this.getExistCalendar = this.getExistCalendar.bind(this);
        this.create_new_calendar = this.create_new_calendar.bind(this);

    }

    componentDidMount() {

    }

    load_events(uuId){

        var event_list = []

        //get request
        axios.get('http://localhost:5002/useApi', {
            params: {
                calID: uuId
            }
        })
            .then(res => {

                if(res.data.result === 'None'){
                    console.log("None")
                    Popup.alert('The uuid you typed in is not exist, please try again');
                }
                else{
                    for ( var i = 0; i < res.data.result.length; i++){
                        res.data.result[i]['start'] = new Date(res.data.result[i]['start'])
                        res.data.result[i]['end'] = new Date(res.data.result[i]['end'])
                        event_list.push(res.data.result[i])
                    }
                    console.log(event_list)
                    this.setState({
                        events: event_list,
                        loggedIn: true,
                        calenderID: uuId
                    });
                }
            })
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    modify(slotInfo){

        // Popup.plugins().prompt('', 'Type event info', function (value, n) {
        //     Popup.alert('You typed: ' + value + " " + n);
        // });
        // console.log("lol")

        Popup.plugins().modify('', this.edit, this.delete_action, slotInfo.start.toLocaleString(), slotInfo.end.toLocaleString(), slotInfo.title, slotInfo.desc ,function (start, end, title, description, action) {
            //Popup.alert('You typed: ' + slotInfo.id);

            var event = {

                id:slotInfo.id,
                title: title,
                start: new Date(start),
                end: new Date(end),
                desc: description
            }
            action(event)
        });

    }

    edit(event){

        console.log(event)

        var identify_id = event['id']

        console.log("edit!!!!!")
        // //console.log(this.state.events)
        var event_list = this.state.events.slice() //copy the array
        var i = 0
        for (i = 0; i< event_list.length; i++){
            if (event_list[i]['id'] === identify_id){
                event_list[i] = event
            }
        }
        this.setState({events: event_list}) //set the new state

        //put request

        axios.put('http://localhost:5002/useApi', {
            calID: this.state.calenderID,
            event: event
        })
    }

    delete_action(event){

        var identify_id = event['id']

        var event_list = this.state.events.slice() //copy the array

        var i = 0

        for (i = 0; i< event_list.length; i++){
            if (event_list[i]['id'] === identify_id){
                event_list.splice(i, 1);
            }
        }
        this.setState({events: event_list}) //set the new state

        //delete request

        axios.delete('http://localhost:5002/useApi', { data: {
            calID: this.state.calenderID,
            eventId: identify_id
        }
        })
    }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    add(slotInfo){

        const uuidv4 = require('uuid/v4');
        var id = uuidv4()

        Popup.plugins().new('', this.add_action, slotInfo.start.toLocaleString(), slotInfo.end.toLocaleString(),function (start, end, title, description, add_action) {
            //Popup.alert('You typed: ' + start + " " + end + " " + title + " " + description);

            var event = {
                id: id,
                title: title,
                start: new Date(start),
                end: new Date(end),
                desc: description
            }
            add_action(event)
        });
    }

    add_action(event){

        console.log(event)
        this.setState({
            events: this.state.events.concat(event)
        })

        //post request
        axios.post('http://localhost:5002/useApi', {
            calID: this.state.calenderID,
            event: event
        })
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    create_new_calendar(){

        const uuidv4 = require('uuid/v4');
        var calendar_uuid = uuidv4()

        this.setState(
                {
                    loggedIn: true,
                    calenderID: calendar_uuid
                }
        )
        this.create_user(calendar_uuid)
    }

    getExistCalendar(uuid_promptValue){

        console.log("Hi Hi Hi!!!")
        console.log(uuid_promptValue)
        this.load_events(uuid_promptValue)
    }

    create_user(uuid){

        axios.post('http://localhost:5002/createUser', {
            calID: uuid,
        })
        console.log('user created')
    }


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



  render() {

      //conditional rendering
      console.log('in render() ' + this.state.calenderID)

      var calender = ""

      if (this.state.loggedIn){
          calender =<div style={{height: 700}}>

              <BigCalendar
                  eventPropGetter={
                      (event, start, end, isSelected) => {
                          let newStyle = {
                              backgroundColor: "#4CAF50",
                              color: 'white',
                              borderRadius: "0px",
                              border: "3px solid rgba(63,145,12,0.36)"
                          };
                          return {
                              className: "",
                              style: newStyle
                          };
                      }
                  }
                  selectable
                  events={this.state.events}
                  defaultView="week"
                  scrollToTime={new Date(1970, 1, 1, 6)}
                  defaultDate={ new Date(2018,4,1)}
                  onSelectEvent={event => this.modify(event)
                      //alert(event.title)
                  }
                  onSelectSlot={
                      slotInfo => this.add(slotInfo)
                  }
              />


          </div>
      }
      else{
              let uuid_promptValue = " ";
              let uuid_promptChange = function (value) {
                  uuid_promptValue = value;
                  console.log(uuid_promptValue)
              };


              calender =
                  <div className='rowC'>
                          <div className='center'>
                              <p className='demoFont' >Enter your uuid</p>
                              <Text_Prompt  onChange={uuid_promptChange} placeholder={"sssss"}  value={""} />
                              <button className='getCalenderButton' onClick={() => this.getExistCalendar(uuid_promptValue)}>
                                  Get Canlender
                              </button>
                          </div>

                          <div className='center'>
                              <p className='demoFont'>Create a new calender</p>
                              <button className='createNewCalenderButton' onClick={this.create_new_calendar}>
                                  Create New
                              </button>
                          </div>
                  </div>
      }




    return (
          <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to Duck Calendar!</h1>
                </header>
                <p className="App-intro">
                  ------------------------------------------------------
                </p>

                <div style={{height: 700}}>

                    <div  style={{ height: 50 }}>
                        <p>//Your calender ID is ({this.state.calenderID})</p>
                    </div>
                    <Popup />
                    {calender}
                </div>

          </div>

    );
  }
}

export default App;
