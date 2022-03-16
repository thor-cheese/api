from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
password = os.environ['PASSWORD']
username = os.environ['USERNAME']
database = os.environ['DATABASE']



app = Flask(__name__)
CORS(app)





app.config["SQLALCHEMY_DATABASE_URI"] = f"postgresql+psycopg2://{password}:{username}@db:5432/{database}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

print('hi')

@app.route('/')
def hello():
    return 'An API'

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)
