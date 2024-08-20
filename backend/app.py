from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)   

# MongoDB Connection
client = MongoClient('mongodb://localhost:27017/')
db = client['hostel_management']
students = db['students']

# Route: Register Student
@app.route('/api/register', methods=['POST'])
def register_student():
    data = request.json
    name = data.get('name')
    email = data.get('email')

    if students.find_one({"email": email}):
        return jsonify({"success": False, "message": "Student already registered"}), 400
    
    students.insert_one({"name": name, "email": email, "room": None})
    return jsonify({"success": True, "message": "Registered successfully. Room will be allotted soon."})

# Route: Allot Room (Admin)
@app.route('/api/allot', methods=['POST'])
def allot_room():
    data = request.json
    student_email = data.get('studentEmail')
    room_number = data.get('roomNumber')

    result = students.update_one({"email": student_email}, {"$set": {"room": room_number}})

    if result.matched_count > 0:
        return jsonify({"success": True, "message": "Room allotted successfully."})
    else:
        return jsonify({"success": False, "message": "Student not found."}), 404

# Route: Get Room Details
@app.route('/api/room/<email>', methods=['GET'])
def get_room(email):
    student = students.find_one({"email": email})

    if student and student.get('room'):
        return jsonify({"success": True, "room": student['room']})
    return jsonify({"success": False, "message": "Room not allotted yet."}), 404

# Route: Get All Allotted Students
@app.route('/api/allotted_students', methods=['GET'])
def get_all_allotted_students():
    allotted_students = students.find({"room": {"$ne": None}}, {"_id": 0, "name": 1, "email": 1, "room": 1})
    return jsonify({"students": list(allotted_students)})

if __name__ == '__main__':
    app.run(debug=True)
