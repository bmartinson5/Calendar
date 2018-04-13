import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import events from './events'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import Popup from 'react-popup';
import './Prompt.js'

BigCalendar.momentLocalizer(moment); // or globalizeLocalizer


class App extends Component {


    constructor(props) {
        super(props);

        this.state = {
            events:[]
        };
    }

    componentDidMount() {

        var event_list = []



        axios.get('http://localhost:5002/useApi')
            .then(res => {

                // //console.log(res.data.result)
                //
                // var d = new Date(2015, 3, 12, 12, 30, 0, 0)
                //
                // //var d2 = new Date('2019-09-17T21:28:00.000Z')
                // console.log(d.toJSON())

                for ( var i = 0; i < res.data.result.length; i++){

                    res.data.result[i]['start'] = new Date(res.data.result[i]['start'])
                    res.data.result[i]['end'] = new Date(res.data.result[i]['end'])
                    event_list.push(res.data.result[i])

                }

                this.setState({
                    events: event_list
                });

            })

        // Popup.plugins().prompt('', 'Type event info', function (value) {
        //     Popup.alert('You typed: ' + value);
        // });

        // console.log(this.state)
    }

    lol(){

        Popup.plugins().prompt('', 'Type event info', function (value) {
            Popup.alert('You typed: ' + value);
        });
        console.log("lol")
    }






  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Canlender App!</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>


         <div style={{ height: 700}}>

              <div  style={{ height: 50 }}>
                  <p>hhahahahhahahahahahaha</p>
              </div>

             <Popup />

          <BigCalendar
              selectable
              events={this.state.events}
              defaultView="week"
              scrollToTime={new Date(1970, 1, 1, 6)}
              defaultDate={new Date(2015, 3, 12)}
              onSelectEvent={event => this.lol()
                  //alert(event.title)
              }
              onSelectSlot={event => this.lol()


                  // slotInfo =>
                  // alert(
                  //     `selected slot: \n\nstart ${slotInfo.start.toLocaleString()} ` +
                  //     `\nend: ${slotInfo.end.toLocaleString()}` +
                  //     `\naction: ${slotInfo.action}`
                  // )
              }
          />
      </div>

      </div>

    );
  }
}

export default App;
