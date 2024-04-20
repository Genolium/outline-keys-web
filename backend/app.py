from flask import Flask, jsonify
from flask_cors import CORS

from db import *

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:*"}})

@app.route('/api/keys', methods=['GET'])
def get_keys_api():
    keys = get_keys()
    return jsonify(keys)

@app.route('/api/countries', methods=['GET'])
def get_countries_api():
    countries = get_countries()
    return jsonify(countries)

@app.route('/api/country/<id>', methods=['GET'])
def get_countries_id_api(id):
    countries = get_country_by_id(id)
    return jsonify(countries)

@app.route('/api/key/<id>', methods=['GET'])
def get_keys_id_api(id):
    countries = get_key_by_id(id)
    return jsonify(countries)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=True)