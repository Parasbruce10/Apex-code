from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from bson.errors import InvalidId

app = Flask(__name__)
# CORS allow karega taake app.js is server se baat kar sakay
CORS(app)

# ✅ MONGODB CONNECTION
# Note: password mein '#' tha jo URL mein special hota hai, isay %23 se encode kiya hai
MONGO_URI = "mongodb+srv://paras_in_10:Bruceparas%23%230@cluster0.qtxbrsi.mongodb.net/apexcode?retryWrites=true&w=majority"

client = MongoClient(MONGO_URI)
db = client["apexcode"]

admin_collection = db["admin_credentials"]
jobs_collection = db["jobs"]
websites_collection = db["websites"]


# ✅ MANUALLY DATABASE AUR DEFAULT ADMIN SETTING
def init_db():
    try:
        # Check karein agar admin collection khali hai toh default admin insert karein
        if admin_collection.count_documents({}) == 0:
            admin_collection.insert_one({
                'email': 'parashamza955@gmail.com',
                'password': '1122'
            })
            print("👤 Default Admin Created: parashamza955@gmail.com / 1122")

        print("✨ MongoDB Connected & Ready Successfully!")
        print("📋 Jobs Collection Ready!")
    except Exception as e:
        print("🚫 Database Initialization Error: ", e)

# App shuru hote hi database initialize karein
init_db()


# Helper functions: MongoDB document ko clean dict mein convert karte hain (id string ke roop mein)
def job_to_dict(job):
    return {
        'id': str(job['_id']),
        'title': job.get('title'),
        'salary': job.get('salary'),
        'description': job.get('description')
    }

def website_to_dict(site):
    return {
        'id': str(site['_id']),
        'name': site.get('name'),
        'price': site.get('price'),
        'imageLink': site.get('imageLink'),
        'siteLink': site.get('siteLink'),
        'description': site.get('description')
    }


# 1. ADMIN LOGIN API (MongoDB Version)
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        admin = admin_collection.find_one({'email': email})

        if admin and admin.get('password') == password:
            return jsonify({'success': True, 'message': 'Welcome Paras! Login Successful.'})
        else:
            return jsonify({'success': False, 'message': 'Incorrect Email ya Password!'}), 401

    except Exception as e:
        return jsonify({'success': False, 'message': f'Server Error: {str(e)}'}), 500


# 2. UPDATE PASSWORD API (MongoDB Version)
@app.route('/api/admin/update-password', methods=['POST'])
def update_password():
    try:
        data = request.json
        new_password = data.get('newPassword')

        result = admin_collection.update_one(
            {'email': 'parashamza955@gmail.com'},
            {'$set': {'password': new_password}}
        )

        if result.modified_count > 0:
            return jsonify({'success': True, 'message': 'Password successfully updated in MongoDB!'})
        return jsonify({'success': False, 'message': 'Failed to update password.'}), 500

    except Exception as e:
        return jsonify({'success': False, 'message': f'Server Error: {str(e)}'}), 500


# 3. SAB JOBS GET KARO (Public — Available Jobs page ke liye)
@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    try:
        jobs_cursor = jobs_collection.find().sort('_id', -1)
        jobs = [job_to_dict(j) for j in jobs_cursor]
        return jsonify({'success': True, 'jobs': jobs})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Server Error: {str(e)}'}), 500


# 4. NAI JOB ADD KARO (Admin)
@app.route('/api/jobs', methods=['POST'])
def add_job():
    try:
        data = request.json
        title = data.get('title')
        salary = data.get('salary')
        description = data.get('description')

        if not title or not description:
            return jsonify({'success': False, 'message': 'Title aur Description zaroori hain!'}), 400

        jobs_collection.insert_one({
            'title': title,
            'salary': salary,
            'description': description
        })

        return jsonify({'success': True, 'message': 'Job successfully post ho gayi!'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Server Error: {str(e)}'}), 500


# 5. JOB EDIT KARO (Admin)
@app.route('/api/jobs/<job_id>', methods=['PUT'])
def update_job(job_id):
    try:
        data = request.json
        title = data.get('title')
        salary = data.get('salary')
        description = data.get('description')

        result = jobs_collection.update_one(
            {'_id': ObjectId(job_id)},
            {'$set': {'title': title, 'salary': salary, 'description': description}}
        )

        if result.modified_count > 0:
            return jsonify({'success': True, 'message': 'Job update ho gayi!'})
        return jsonify({'success': False, 'message': 'Job nahi mili.'}), 404
    except InvalidId:
        return jsonify({'success': False, 'message': 'Invalid Job ID.'}), 400
    except Exception as e:
        return jsonify({'success': False, 'message': f'Server Error: {str(e)}'}), 500


# 6. JOB DELETE KARO (Admin)
@app.route('/api/jobs/<job_id>', methods=['DELETE'])
def delete_job(job_id):
    try:
        result = jobs_collection.delete_one({'_id': ObjectId(job_id)})

        if result.deleted_count > 0:
            return jsonify({'success': True, 'message': 'Job delete ho gayi!'})
        return jsonify({'success': False, 'message': 'Job nahi mili.'}), 404
    except InvalidId:
        return jsonify({'success': False, 'message': 'Invalid Job ID.'}), 400
    except Exception as e:
        return jsonify({'success': False, 'message': f'Server Error: {str(e)}'}), 500

# ==========================================
# 🌐 WEBSITES API ROUTES SHURU
# ==========================================

# 7. SAB WEBSITES GET KARO
@app.route('/api/websites', methods=['GET'])
def get_websites():
    try:
        sites_cursor = websites_collection.find().sort('_id', -1)
        websites = [website_to_dict(s) for s in sites_cursor]
        return jsonify({'success': True, 'websites': websites})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Server Error: {str(e)}'}), 500


# 8. NAYI WEBSITE ADD KARO (Admin)
@app.route('/api/websites', methods=['POST'])
def add_website():
    try:
        data = request.json
        name = data.get('name')
        price = data.get('price')
        imageLink = data.get('imageLink')
        siteLink = data.get('siteLink')
        description = data.get('description')

        if not name or not description:
            return jsonify({'success': False, 'message': 'Name aur Description zaroori hain!'}), 400

        websites_collection.insert_one({
            'name': name,
            'price': price,
            'imageLink': imageLink,
            'siteLink': siteLink,
            'description': description
        })

        return jsonify({'success': True, 'message': 'Website successfully post ho gayi!'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Server Error: {str(e)}'}), 500


# 9. WEBSITE EDIT KARO (Admin)
@app.route('/api/websites/<site_id>', methods=['PUT'])
def update_website(site_id):
    try:
        data = request.json
        name = data.get('name')
        price = data.get('price')
        imageLink = data.get('imageLink')
        siteLink = data.get('siteLink')
        description = data.get('description')

        result = websites_collection.update_one(
            {'_id': ObjectId(site_id)},
            {'$set': {
                'name': name,
                'price': price,
                'imageLink': imageLink,
                'siteLink': siteLink,
                'description': description
            }}
        )

        if result.modified_count > 0:
            return jsonify({'success': True, 'message': 'Website update ho gayi!'})
        return jsonify({'success': False, 'message': 'Website nahi mili.'}), 404
    except InvalidId:
        return jsonify({'success': False, 'message': 'Invalid Website ID.'}), 400
    except Exception as e:
        return jsonify({'success': False, 'message': f'Server Error: {str(e)}'}), 500


# 10. WEBSITE DELETE KARO (Admin)
@app.route('/api/websites/<site_id>', methods=['DELETE'])
def delete_website(site_id):
    try:
        result = websites_collection.delete_one({'_id': ObjectId(site_id)})

        if result.deleted_count > 0:
            return jsonify({'success': True, 'message': 'Website delete ho gayi!'})
        return jsonify({'success': False, 'message': 'Website nahi mili.'}), 404
    except InvalidId:
        return jsonify({'success': False, 'message': 'Invalid Website ID.'}), 400
    except Exception as e:
        return jsonify({'success': False, 'message': f'Server Error: {str(e)}'}), 500


if __name__ == '__main__':
    print("🚀 Starting Python Flask Server on Port 5000...")
    app.run(port=5000, debug=True)