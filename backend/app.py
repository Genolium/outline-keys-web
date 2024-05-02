import html
import os
import hashlib
import asyncio
import aiohttp
from translate import Translator
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, unset_jwt_cookies
from dotenv import load_dotenv
from cachetools import TTLCache
from db import *
from flask_compress import Compress

load_dotenv() 
app = Flask(__name__)
#cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['JWT_SECRET_KEY'] = os.getenv('SECRET_KEY')  
Compress(app)
cors = CORS(app)
cache = TTLCache(maxsize=1000, ttl=3600)
jwt = JWTManager(app)

@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    
    if username == os.getenv('ADMIN_LOGIN') and password == os.getenv('ADMIN_PASSWORD')  :
        access_token = create_access_token(identity=username, expires_delta=False)
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
    lng = request.args.get('lng')
    keys = get_keys()
    if lng!="ru":
        for i in range(len(keys)):
            translator= Translator(from_lang="ru",to_lang=lng,provider="mymemory")
            country_mod = list(keys[i])
            try:
                country_mod[1] = cache[lng+":"+country_mod[1]]
                keys[i] = tuple(country_mod)   
            except:
                tmp = country_mod[1]
                country_mod[1] = translator.translate(country_mod[1])
                cache[lng+":"+tmp]=country_mod[1]                     
                keys[i] = tuple(country_mod)   
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    tasks = [check_shadowsocks_key(key[-1]) for key in keys]
    latencies = loop.run_until_complete(asyncio.gather(*tasks))
    keys_with_latency = list(zip(keys, latencies))
    return jsonify([list(tup) for tup in keys_with_latency])

@app.route('/api_open/countries', methods=['GET'])
def get_countries_api():
    lng = request.args.get('lng')
    countries = get_countries()
    if lng!="ru":
        for i in range(len(countries)):
            translator= Translator(from_lang="ru",to_lang=lng,provider="mymemory")
            country_mod = list(countries[i])
            try:
                country_mod[1] = cache[lng+":"+country_mod[1]]
                countries[i] = tuple(country_mod)   
            except:
                tmp = country_mod[1]
                country_mod[1] = translator.translate(country_mod[1])
                cache[lng+":"+tmp]=country_mod[1]                     
                countries[i] = tuple(country_mod)   
    return jsonify(countries)

@app.route('/api_open/country/<id>', methods=['GET'])
def get_countries_id_api(id):
    lng = request.args.get('lng')
    countries = get_country_by_id(id)
    if lng!="ru":
        for i in range(len(countries)):
            translator= Translator(from_lang="ru",to_lang=lng,provider="mymemory")
            country_mod = list(countries[i])
            try:
                country_mod[1] = cache[lng+":"+country_mod[1]]
                countries[i] = tuple(country_mod)   
            except:
                tmp = country_mod[1]
                country_mod[1] = translator.translate(country_mod[1])
                cache[lng+":"+tmp]=country_mod[1]                     
                countries[i] = tuple(country_mod)   
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    tasks = [check_shadowsocks_key(key[-1]) for key in countries]
    latencies = loop.run_until_complete(asyncio.gather(*tasks))
    countries_with_latency = list(zip(countries, latencies))
    return jsonify(countries_with_latency)

@app.route('/api_open/key/<id>', methods=['GET'])
def get_keys_id_api(id):    
    key = get_key_by_id(id)
    key = list(key)
    lng = request.args.get('lng')
    if lng!="ru":
        translator= Translator(from_lang="ru",to_lang=lng,provider="mymemory")
        try:
            key[1] = cache[lng+":"+key[1]]
        except:
            tmp = key[1]
            key[1] = translator.translate(key[1])
            cache[lng+":"+tmp]=key[1]                     
    print(key)
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    latency = loop.run_until_complete(check_shadowsocks_key(key[-1]))
    key += (latency,)
    return jsonify(key)

@app.route('/api_open/link', methods=['GET'])
def get_l():
    link = get_link()
    return jsonify(link)

@app.route('/api/countries', methods=['POST'])
@jwt_required()
def create_country():
    data = request.get_json()
    name = data['name']
    code = data['code']
    insert_country(name, code)
    return jsonify({'message': 'Country created successfully'})

@app.route('/api/countries/<id>', methods=['PUT'])
@jwt_required()
def upd_country(id):
    data = request.get_json()
    name = data['name']
    code = data['code']
    print(id, name, code)
    update_country(id, name, code)
    return jsonify({'message': 'Country updated successfully'})

@app.route('/api/countries/<id>', methods=['DELETE'])
@jwt_required()
def del_country(id):
    delete_country(id)
    return jsonify({'message': 'Country deleted successfully'})

@app.route('/api/link', methods=['PUT'])
@jwt_required()
def upd_link():
    data = request.get_json()
    link = data['link']
    change_link(str(link))
    return jsonify({'message': 'Link updated successfully'})

@app.route('/api/keys', methods=['POST'])
@jwt_required()
def create_key():
    data = request.get_json()
    country = data['country']
    key = data['key']
    insert_key(country, key)
    return jsonify({'message': 'Key created successfully'})

@app.route('/api/keys/<id>', methods=['PUT'])
@jwt_required()
def upd_key(id):
    data = request.get_json()
    country = data['country']
    key = data['key']
    print(id, country, key)
    update_key(id, country, key)
    return jsonify({'message': 'Key updated successfully'})

@app.route('/api/keys/<id>', methods=['DELETE'])
@jwt_required()
def del_key(id):
    delete_key(id)
    return jsonify({'message': 'Key deleted successfully'})

@app.route('/api_open/posts', methods=['GET'])
def get_all_posts():
    posts = get_all_posts_from_db()
    output = []
    for post in posts:
        output.append({
            'id': post[0],
            'title': post[1].encode('utf-8').decode('utf-8'),
            'text': html.unescape(post[2]),
            'cover': post[3]
        })
    return jsonify(output)

@app.route('/api/posts', methods=['POST'])
@jwt_required()
def create_post():
    data = request.get_json()
    title = data['title'].encode('utf-8').decode('utf-8')
    text = html.unescape(data['text'])
    cover = data['cover']
    create_post_in_db(title, text, cover)
    return jsonify({'message': 'Post created successfully'})

@app.route('/api_open/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    post = get_post_from_db(post_id)
    if post is None:
        return jsonify({'message': 'Post not found'}), 404
    return jsonify({
        'id': post[0],
        'title': post[1].encode('utf-8').decode('utf-8'),
        'text':  html.unescape(post[2]),
        'cover': post[3]
    })

@app.route('/api/posts/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_post(post_id):
    data = request.get_json()
    title = data['title']
    text = data['text']
    cover = data['cover']
    update_post_in_db(post_id, title, text, cover)
    return jsonify({'message': 'Post updated successfully'})

@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    delete_post_from_db(post_id)
    return jsonify({'message': 'Post deleted successfully'})

async def check_shadowsocks_key(key):
    print(f"Checking shadowsocks key: {key}")
    encoded_key = str(key.split("#")[0].split("@")[1])
    print(cache)
    try:        
        latency = cache[encoded_key]
        print(f"Key found in cache, latency: {latency}")
    except:
        print(f"Key not found in cache, checking server")
        async with aiohttp.ClientSession() as session:
            async with session.get(f'http://localhost:8080/check-connection?transport={key}') as resp:
                data = await resp.json()
                if data["error"]=="ошибка":
                    latency=-1
                    cache[encoded_key] = -1
                    return latency
                latency = data["max_delay"]
                print(f"Server response, latency: {latency}")
                cache[encoded_key] = latency
    return latency

if __name__ == "__main__":
    create_tables()
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=True)