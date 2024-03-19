#!/usr/bin/python3
""" users api endpoints"""


from api.v1.views import app_views
from flask import abort, request, jsonify, make_response, send_file, session
from models.user import User
from models.engine.db_storage import DBStorage
from werkzeug.security import generate_password_hash, check_password_hash
import os

storage = DBStorage()

@app_views.route('/signup', methods=['POST'], strict_slashes=False)
def signup():
    """ Create a user object"""

    try:
        username = request.get_json().get('name')
        phone = request.get_json().get('phone')
        email = request.get_json().get('email')
        password = request.get_json().get('password')
        role = request.get_json().get('role')

        hashed_password = generate_password_hash(password, method='sha256')

        if storage.check_email(email=email):
            return make_response(jsonify({"error": 'email exist'}), 400)

        print(f"Received hashed_password: {hashed_password}")

        if role == 'client':
            new_user = User(name=username, phone=phone,
                            email=email, password=hashed_password, role=role)
            storage.new(new_user)
            storage.save()
            return make_response(jsonify(new_user.to_dict()), 201)
        if role == 'barber':
            location = request.get_json().get('location')
            new_user = User(name=username, phone=phone,
                            email=email, password=hashed_password, role=role, location=location)
            storage.new(new_user)
            storage.save()
            return make_response(jsonify(new_user.to_dict()), 201)

    except Exception:
        return jsonify({"message": "Signup Failed"})

@app_views.route('/barbers', methods=['GET'], strict_slashes=False)
def get_barbers():
    """ Retrieves the list of all user objects with role barber """

    list_barber = []
    for barber in storage.all(User).values():
        if barber.role == "barber":
            list_barber.append(barber.to_dict())
    return jsonify(list_barber)

@app_views.route('/users/<user_id>', methods=['GET'], strict_slashes=False)
def get_user(user_id):
    """ Retrieves a user object """

    user = storage.get(User, user_id)
    if not user:
        abort(404)

    return jsonify(user.to_dict())

@app_views.route('/users/<user_id>', methods=['PUT'], strict_slashes=False)
def put_user(user_id):
    """ Update a user object """

    user = storage.get(User, user_id)
    if not user:
        abort(404)

    if not request.get_json():
        return make_response(jsonify({"error": 'Not a JSON'}), 400)

    ignore = ['id', 'created_at']
    data = request.get_json()
    for key, value in data.items():
        if key not in ignore:
            setattr(user, key, value)
    storage.save()
    return make_response(jsonify(user.to_dict()), 200)

@app_views.route('/login', methods=['POST'], strict_slashes=False)
def login():
    """check if user exists to login"""

    try:
        print("OK")
        email = request.get_json().get('email')
        password = request.get_json().get('password')

        user = storage.check_email(email=email)

        if user:
            print(f"email :{email}")

        if check_password_hash(user.password, password):
            print(f"password :{password}")

        if user and check_password_hash(user.password, password):
            return make_response(jsonify(user.to_dict()), 200)

         # Authentication failed
        return make_response(jsonify({'error': 'Invalid email or password '}), 401)

    except Exception:

        return make_response(jsonify({"message": "Login Failed"}), 404)

@app_views.route('/users_pictures/<user_id>', methods=['POST'], strict_slashes=False)
def save_user_picture(user_id):
    """save the user picture"""

    if 'image' in request.files:
        image_file = request.files['image']
        file_path = f"/home/ismail99/alx_learinng/BarberPro/api/v1/views/users_pictures/{image_file.filename}.png"
        image_file.save(file_path)
        # update the barber object
        user = storage.get(User, user_id)
        if not user:
            abort(404)

        storage.update(**{"picture_url": file_path})
        return {"picturePath": file_path}, 201
    else:
        return {"error": "No image provided"}, 400

@app_views.route('/image/<user_id>', methods=['GET'], strict_slashes=False)
def upload_image(user_id):
    """ upload the user/doc image """

    absolute_path = os.path.dirname(__file__)
    image_path = f"{absolute_path}/users_pictures/user_{user_id}_pic.png"
    print(absolute_path)
    if os.path.exists(image_path):

        return send_file(image_path, mimetype='image/png')

    else:
        return make_response("Image not found", 400)

# @app_views.route('/users/<user_id>', methods=['DELETE'], strict_slashes=False)
# def delete_user(user_id):
#     """ Deletes a user Object """

#     user = storage.get(User, user_id)
#     if not user:
#         abort(404)

#     storage.delete(user)
#     storage.save()
#     return make_response(jsonify({}), 200)



