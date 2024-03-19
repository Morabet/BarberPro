#!/usr/bin/python3
""" styles api endpoints"""

from api.v1.views import app_views
from models.user import User
from models.style import Style
from flask import abort, request, make_response, jsonify
from models.engine.db_storage import DBStorage

storage = DBStorage()

@app_views.route('/barbers/<barber_id>/styles', methods=['GET'], strict_slashes=False)
def get_styles(barber_id):
    """ Retrieves the list of all Styles objects of a barber """

    barber = storage.get(User, barber_id)

    if not barber or barber.role != 'barber':
        abort(404, description="Barber not found.")

    styles = [style.to_dict() for style in barber.style]

    return jsonify(styles)

@app_views.route('/barbers/<barber_id>/styles', methods=['POST'], strict_slashes=False)
def create_style(barber_id):
    """ Create a new Style """

    data = request.get_json()

    if not data:
        return make_response(jsonify({'error': 'Not a JSON'}), 400)
    if "style_name" not in data:
        return make_response(jsonify({'error': 'Missing style_name'}), 400)
    if "price" not in data:
        return make_response(jsonify({'error': 'Missing price'}), 400)

    style = storage.check_style(
        style=data["style_name"], barber_id=data["barber_id"])

    if style:
        return make_response(jsonify({'error': 'Style Name Exist'}), 401)

    barber = storage.get(User, barber_id)
    if not barber or barber.role != 'barber':
        abort(404, description="Barber not found.")

    data["barber_id"] = barber_id
    style = Style(**data)
    storage.new(style)
    storage.save()

    return make_response(jsonify(style.to_dict()), 201)

@app_views.route('/styles/<style_id>', methods=['DELETE'], strict_slashes=False)
def delete_style(style_id):
    """ Deletes a Style Object """
    
    style = storage.get(Style, style_id)

    if not style:
        abort(404)

    storage.delete(style)
    storage.save()
    return make_response(jsonify({}), 200)

# @app_views.route('/styles/<style_id>', methods=['PUT'], strict_slashes=False)
# def put_style(style_id):
#     """ Updates a Style """

#     style = storage.get(Style, style_id)
#     data = request.get_json()

#     if not data:
#         return make_response(jsonify({'error': 'Not a JSON'}), 400)

#     ignore = ['id', 'created_at', 'barber_id']
#     for key, value in data.items():
#         if key not in ignore:
#             setattr(style, key, value)

#     storage.save()
#     return make_response(jsonify(style.to_dict()), 200)
