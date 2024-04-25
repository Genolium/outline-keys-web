import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask import Blueprint, render_template, request, redirect, url_for
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, unset_jwt_cookies
from db import *
from dotenv import load_dotenv

load_dotenv() 
app = Flask(__name__)
#cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['JWT_SECRET_KEY'] = os.getenv('SECRET_KEY')  
cors = CORS(app)
jwt = JWTManager(app)

@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    
    if username == os.getenv('ADMIN_LOGIN') and password == os.getenv('ADMIN_PASSWORD')  :
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"msg": "Bad username or password"}), 401
    
@app.route('/api/logout', methods=['POST'])
@jwt_required()
def logout():
    response = jsonify({"msg": "Successfully logged out"})
    unset_jwt_cookies(response)
    return response

@app.route('/api_open/keys', methods=['GET'])
def get_keys_api():
    keys = get_keys()
    return jsonify(keys)

@app.route('/api_open/countries', methods=['GET'])
def get_countries_api():
    countries = get_countries()
    return jsonify(countries)

@app.route('/api_open/country/<id>', methods=['GET'])
def get_countries_id_api(id):
    countries = get_country_by_id(id)
    return jsonify(countries)

@app.route('/api_open/key/<id>', methods=['GET'])
def get_keys_id_api(id):
    countries = get_key_by_id(id)
    return jsonify(countries)

@app.route('/api_open/link', methods=['GET'])
def get_link(id):
    link = get_link()
    return jsonify(link)



# API для добавления нового государства в таблицу countries
@app.route('/api/countries', methods=['POST'])
@jwt_required()
def create_country():
    data = request.get_json()
    name = data['name']
    code = data['code']
    insert_country(name, code)
    return jsonify({'message': 'Country created successfully'})

# API для обновления информации о государстве в таблице countries
@app.route('/api/countries/<id>', methods=['PUT'])
@jwt_required()
def upd_country(id):
    data = request.get_json()
    name = data['name']
    code = data['code']
    print(id, name, code)
    update_country(id, name, code)
    return jsonify({'message': 'Country updated successfully'})

# API для удаления государства из таблицы countries
@app.route('/api/countries/<id>', methods=['DELETE'])
@jwt_required()
def del_country(id):
    delete_country(id)
    return jsonify({'message': 'Country deleted successfully'})


# API для добавления нового ключа в таблицу keys
@app.route('/api/keys', methods=['POST'])
@jwt_required()
def create_key():
    data = request.get_json()
    country = data['country']
    key = data['key']
    insert_key(country, key)
    return jsonify({'message': 'Key created successfully'})

# API для обновления информации о ключе в таблице keys
@app.route('/api/keys/<id>', methods=['PUT'])
@jwt_required()
def upd_key(id):
    data = request.get_json()
    country = data['country']
    key = data['key']
    print(id, country, key)
    update_key(id, country, key)
    return jsonify({'message': 'Key updated successfully'})

@app.route('/api/link', methods=['PUT'])
@jwt_required()
def upd_link(link):
    data = request.get_json()
    country = data['link']
    change_link(str(link))
    return jsonify({'message': 'Link updated successfully'})

# API для удаления ключа из таблицы keys
@app.route('/api/keys/<id>', methods=['DELETE'])
@jwt_required()
def del_key(id):
    delete_key(id)
    return jsonify({'message': 'Key deleted successfully'})

if __name__ == "__main__":
    create_tables()
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=True)