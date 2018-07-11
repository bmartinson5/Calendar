from flask import Flask, jsonify
import flask
from flask import request
#import flask_restful
from flask_restful import Resource, Api
import pdb
import logging
import json
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId


#app = flask.Flask(__name__, template_folder='public', static_folder='422demo')
app = flask.Flask(__name__)
#CORS(app)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
api = Api(app)

MONGO_URL = "mongodb://test:pass123@ds157740.mlab.com:57740/proj5db"
client = MongoClient(MONGO_URL)
db = client.get_database("proj5db")
users = db.users

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
        try:
            userId = request.args.get('calID')
            print("there is get!")
            print(userId)
        
            allEvents = users.find({"_id":userId})
            result = allEvents[0]['Events']
            return flask.jsonify(result = result)
        except:
               return flask.jsonify({'error':'Invalid uuid', 'result':'None'})



    def post(self):
        event = request.get_json() #this is the way you can get the data from front end
        userID = event['calID']
        print(userID)
        doc = users.find({"_id": userID})
        users.update({"_id": userID}, {'$push': {'Events': event['event']}}) 
        return flask.jsonify(result = "success")



    def delete(self):
        data = request.get_json()
        eventID = data['eventId']
        userID = data['calID']
        users.update({"_id": userID}, { '$pull': {'Events': {'id': eventID}}})
        #users.update({}, { '$pull': {'Events': {'id': eventId}}})
        return flask.jsonify(result = "success")

    def put(self):
        event = request.get_json()
        eventID = event['event']['id']
        userID = event['calID']
        users.update({"_id": userID}, { '$pull': {'Events': {'id': eventID}}})
        users.update({"_id": userID}, {'$push': {'Events': event['event']}})  
        return flask.jsonify(result = "success")

class UserFile(Resource):
    def post(self):
        data = request.get_json()
        userID = data['calID']
        users.insert( { "_id": userID, "Events": [] } )
        return flask.jsonify(result = "success")
        

api.add_resource(calendarFile, '/useApi')        
api.add_resource(UserFile, '/createUser')        

if __name__ == "__main__":
    app.secret_key = 'super secret key'
    app.run(debug=True, threaded=True, port=5002, host="0.0.0.0")
