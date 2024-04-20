from flask import Flask, jsonify
from flask_cors import CORS
from flask import Blueprint, render_template, request, redirect, url_for
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



# API для добавления нового государства в таблицу countries
@app.route('/api/countries', methods=['POST'])
def create_country():
    data = request.get_json()
    name = data['name']
    code = data['code']
    insert_country(name, code)
    return jsonify({'message': 'Country created successfully'})

# API для обновления информации о государстве в таблице countries
@app.route('/api/countries/<id>', methods=['PUT'])
def upd_country(id):
    data = request.get_json()
    name = data['name']
    code = data['code']
    print(id, name, code)
    update_country(id, name, code)
    return jsonify({'message': 'Country updated successfully'})

# API для удаления государства из таблицы countries
@app.route('/api/countries/<id>', methods=['DELETE'])
def del_country(id):
    delete_country(id)
    return jsonify({'message': 'Country deleted successfully'})


# API для добавления нового ключа в таблицу keys
@app.route('/api/keys', methods=['POST'])
def create_key():
    data = request.get_json()
    country = data['country']
    key = data['key']
    insert_key(country, key)
    return jsonify({'message': 'Key created successfully'})

# API для обновления информации о ключе в таблице keys
@app.route('/api/keys/<id>', methods=['PUT'])
def upd_key(id):
    data = request.get_json()
    country = data['country']
    key = data['key']
    print(id, country, key)
    update_key(id, country, key)
    return jsonify({'message': 'Key updated successfully'})

# API для удаления ключа из таблицы keys
@app.route('/api/keys/<id>', methods=['DELETE'])
def del_key(id):
    delete_key(id)
    return jsonify({'message': 'Key deleted successfully'})

if __name__ == "__main__":
    create_tables()
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=True)