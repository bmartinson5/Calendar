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


BigCalendar.momentLocalizer(moment); // or globalizeLocalizer


class App extends Component {


    constructor(props) {
        super(props);

        this.state = {
            events:[],
            loggedIn: false,
            calenderID:''

        };


        this.boom = this.boom.bind(this);
        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
        this.load_events = this.load_events.bind(this);
        this.sayHi = this.sayHi.bind(this);
        this.create_new = this.create_new.bind(this);

    }

    componentDidMount() {

        //var event_list = []

        //this.load_events()

        // axios.get('http://localhost:5002/useApi')
        //     .then(res => {
        //
        //         // //console.log(res.data.result)
        //         //
        //         // var d = new Date(2015, 3, 12, 12, 30, 0, 0)
        //         //
        //         // //var d2 = new Date('2019-09-17T21:28:00.000Z')
        //         // console.log(d.toJSON())
        //
        //         for ( var i = 0; i < res.data.result.length; i++){
        //
        //             res.data.result[i]['start'] = new Date(res.data.result[i]['start'])
        //             res.data.result[i]['end'] = new Date(res.data.result[i]['end'])
        //             event_list.push(res.data.result[i])
        //
        //         }
        //
        //         this.setState({
        //             events: event_list
        //         });
        //
        //     })

    }

    load_events(){

        var event_list = []


        //get request

        axios.get('http://localhost:5002/useApi')
            .then(res => {


                for ( var i = 0; i < res.data.result.length; i++){

                    res.data.result[i]['start'] = new Date(res.data.result[i]['start'])
                    res.data.result[i]['end'] = new Date(res.data.result[i]['end'])

                    event_list.push(res.data.result[i])

                }

                console.log(event_list)


                this.setState({
                    events: event_list
                });

            })

    }


    edit(event){

        console.log(event)

        var identify_id = event['id']




        console.log("edit!!!!!")
        // //console.log(this.state.events)
        //
        var event_list = this.state.events.slice() //copy the array
        var i = 0
        for (i = 0; i< event_list.length; i++){
            if (event_list[i]['id'] === identify_id){
                event_list[i] = event
            }


        }
        this.setState({events: event_list}) //set the new state

        //push request

    }

    delete(event){

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


    }

    modify(slotInfo){

        // Popup.plugins().prompt('', 'Type event info', function (value, n) {
        //     Popup.alert('You typed: ' + value + " " + n);
        // });
        // console.log("lol")

        Popup.plugins().modify('', this.edit, this.delete, slotInfo.start.toLocaleString(), slotInfo.end.toLocaleString(), slotInfo.title, slotInfo.desc ,function (start, end, title, description, action) {
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

    boom(event){
        console.log(event)
        this.setState({
            events: this.state.events.concat(event)
        })


        //post request

        axios.post('http://localhost:5002/useApi', {

            event: event
        })


    }

    add(slotInfo){

        const uuidv4 = require('uuid/v4');
        var id = uuidv4()

        Popup.plugins().new('', this.boom, slotInfo.start.toLocaleString(), slotInfo.end.toLocaleString(),function (start, end, title, description, boom) {
            //Popup.alert('You typed: ' + start + " " + end + " " + title + " " + description);

            var event = {
                id: id,
                title: title,
                start: new Date(start),
                end: new Date(end),
                desc: description
            }

            boom(event)

        });



    }

    sayHi(){

        console.log("Hi Hi Hi!!!")
    }

    create_new(){

        const uuidv4 = require('uuid/v4');
        var canlender_uuid = uuidv4()

        this.setState(
                {
                    loggedIn: true,
                    calenderID: canlender_uuid
                }
            )
        //this.load_events()
    }






  render() {

      //conditional rendering

      var calender = ""

      if (this.state.loggedIn){
          calender = <BigCalendar
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

      }
      else{
          let uuid_promptValue = " ";
          let uuid_promptChange = function (value) {
              uuid_promptValue = value;
              console.log(uuid_promptValue)
          };


          calender = <div className='rowC'>
                  <div className='center'>
                      <p>Enter your uuid to get to your calender</p>
                      <Text_Prompt onChange={uuid_promptChange} placeholder={"sssss"}  value={""} />
                      <button onClick={this.sayHi}>
                          Get Canlender
                      </button>
                  </div>

                  <div className='center'>
                      <p>Create a new calender</p>
                      <button onClick={this.create_new}>
                          Create New
                      </button>
                  </div>
              </div>
      }




    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Canlender App!</h1>
        </header>
        <p className="App-intro">
          ------------------------------------------------------
        </p>


         <div style={{height: 700}}>

              <div  style={{ height: 50 }}>
                  <p>Your calender ID is ({this.state.calenderID})</p>
              </div>

             <Popup />


             {calender}


         </div>

      </div>

    );
  }
}

export default App;
