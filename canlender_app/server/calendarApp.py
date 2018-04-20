from flask import Flask, jsonify
import flask
from flask import request
#import flask_restful
from flask_restful import Resource, Api
import pdb
import logging
import json
from flask_cors import CORS


#app = flask.Flask(__name__, template_folder='public', static_folder='422demo')
app = flask.Flask(__name__)
#CORS(app)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
api = Api(app)


tasks = [
         {
         'id': 1,
         'title': u'Buy groceries',
         'description': u'Milk, Cheese, Pizza, Fruit, Tylenol',
         'done': False
         },
         {
         'id': 2,
         'title': u'Learn Python',
         'description': u'Need to find a good Python tutorial on the web',
         'done': False
         }
         ]

@app.route('/todo/api/v1.0/tasks', methods=['GET'])
def get_tasks():
    return jsonify({'tasks': tasks})

@app.route("/")
@app.route("/index")
def index():
    return "pass"


@app.errorhandler(404)
def page_not_found(error):
    app.logger.debug("Page not found")
    flask.session['linkback'] = flask.url_for("index")
    return flask.render_template('404.html'), 404



class calendarFile(Resource):

    #Get request will return all the events from the file
    def get(self):
        result = [
        {
            "id": '0',
            "title": 'All Day Event very long title',
            "allDay": True,
            "start": '2018-03-31T07:00:00.000Z',
            "end": '2018-04-01T07:00:00.000Z'
        },
        {
            "id": '6',
            "title": 'Meeting',
            "start": '2018-04-12T17:30:00.000Z',
            "end": '2018-04-12T19:30:00.000Z',
            "desc": 'Pre-meeting meeting, to prepare for the meeting'
        }
        ]
        #result = retrieveEventsFromFile()
        return flask.jsonify(result = result)


    """
    Post request will post new Event(s) to the file
    (then return all events including new ones?)
    -Not sure about the post request, might have to be a put request instead
        (modifying the file by adding only one new event at a time)
        it will depend on how the frontend works
    """
    
    def post(self):
        #first retrieve all events to be saved to the file
        #events = request.args.get('Events')
        events = request.get_json() #this is the way you can get the data from front end

#        saveEventsToFile(Events)

        result = {}
        result = events
        print(result)
        print(events["a"])
#        result = retrieveEventsFromFile()
#        return flask.jsonify(result = result)
        return flask.jsonify(result = result)



    #delete request will send info about the event to be deleted
    #will probably have to return status code (saying whether the
    #event to be deleted was in the file)
    def delete(self):
        eventTodelete = request.args.get('event')
        deleteEventFromFile(eventToDelete)
        return 



#The functions below are what Evan and John are working on

def retrieveEventsFromFile():
    pass

def saveEventsToFile(Events):
    pass

def deleteEventFromFile(eventToDelete):
    pass


api.add_resource(calendarFile, '/useApi')        

if __name__ == "__main__":
    app.secret_key = 'super secret key'
    app.run(debug=True, threaded=True, port=5002, host="0.0.0.0")
