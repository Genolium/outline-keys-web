import sqlite3
from datetime import datetime

# Connect to SQLite database
def get_connection():
    return sqlite3.connect('database.db')

# Function to insert a country into the countries table
def insert_country(name, code):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('INSERT INTO countries (name, code) VALUES (?, ?)', (name, code))
        conn.commit()

def get_key_by_id(key_id):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''SELECT keys.id, countries.name, countries.code, keys.date, keys.key
        FROM keys
        INNER JOIN countries ON keys.country = countries.id WHERE keys.id = ?''', (key_id,))
        key = cursor.fetchone()
        return key
    
def get_country_by_id(country_id):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT keys.id, countries.name, countries.code, keys.date, keys.key
        FROM keys
        INNER JOIN countries ON keys.country = countries.id WHERE keys.country = ?
        ''', (country_id,))
        keys = cursor.fetchall()
        return keys

# Function to retrieve all countries from the countries table
def get_countries():
    print("Getting countries from database")
    with get_connection() as conn:
        cursor = conn.cursor()
        print("Connected to database")
        cursor.execute('SELECT * FROM countries')
        countries = cursor.fetchall()
        print(f"Retrieved {len(countries)} countries from database")
        return countries

# Function to update a country in the countries table
def update_country(country_id, name, code):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('UPDATE countries SET name = ?, code = ? WHERE id = ?', (name, code, country_id))
        conn.commit()

# Function to delete a country from the countries table
def delete_country(country_id):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM countries WHERE id = ?', (country_id,))
        conn.commit()


def insert_key(country, key):
    now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('INSERT INTO keys (country, date, key) VALUES (?, ?, ?)', (country, now, key))
        conn.commit()

# Function to retrieve all keys from the keys table
def get_keys():
    print("Getting keys from database")
    with get_connection() as conn:
        cursor = conn.cursor()
        print("Connected to database")
        cursor.execute('''SELECT keys.id, countries.name, countries.code, keys.date, keys.key
        FROM keys
        INNER JOIN countries ON keys.country = countries.id ORDER BY keys.date DESC;''')
        keys = cursor.fetchall()
        print(f"Retrieved {len(keys)} keys from database")
        return keys

# Function to update a key in the keys table
def update_key(key_id, country, key):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('UPDATE keys SET country = ?, key = ? WHERE id = ?', (country, key, key_id))
        conn.commit()

# Function to delete a key from the keys table
def delete_key(key_id):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM keys WHERE id = ?', (key_id,))
        conn.commit()
        
def create_tables():
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS countries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                code TEXT
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS keys (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                country INTEGER,
                date TEXT,
                key TEXT,
                FOREIGN KEY (country) REFERENCES countries (id)
            )
        ''')
        conn.commit()
        
    #insert_country('Россия', 'ru')
    #insert_country('Соединённые Штаты', 'us')
    #insert_key('1', '2022-01-01', 'abc123')
    #insert_key('2', '2022-01-02', 'def456')