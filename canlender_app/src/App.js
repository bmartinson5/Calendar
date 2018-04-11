import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import events from './events'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';

BigCalendar.momentLocalizer(moment); // or globalizeLocalizer


class App extends Component {


    constructor(props) {
        super(props);

        this.state = {
            person: []
        };
    }

    componentDidMount() {


        axios.get('http://localhost:5002/useApi')
            .then(res => {

                console.log(res.data.result[0])
            })



        console.log(this.state)
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

          <BigCalendar
              selectable
              events={events}
              defaultView="week"
              scrollToTime={new Date(1970, 1, 1, 6)}
              defaultDate={new Date(2015, 3, 12)}
              onSelectEvent={event => alert(event.title)}
              onSelectSlot={slotInfo =>
                  alert(
                      `selected slot: \n\nstart ${slotInfo.start.toLocaleString()} ` +
                      `\nend: ${slotInfo.end.toLocaleString()}` +
                      `\naction: ${slotInfo.action}`
                  )
              }
          />
      </div>

      </div>

    );
  }
}

export default App;
