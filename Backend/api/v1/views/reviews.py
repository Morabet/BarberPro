#!/usr/bin/python3
""" reviews api endpoints"""

from api.v1.views import app_views
from flask import abort, request, jsonify, make_response
from models.user import User
from models.review import Review
from models.engine.db_storage import DBStorage

storage = DBStorage()

@app_views.route('/reviews', methods=['POST'], strict_slashes=False)
def create_review():
    """ Create a review by a client for a barber """

    data = request.get_json()

    if not data:
        return make_response(jsonify({'error': 'Not a JSON'}), 400)
    if "barber_id" not in data:
        return make_response(jsonify({'error': 'Missing barber_id'}), 400)
    if "client_id" not in data:
        return make_response(jsonify({'error': 'Missing client_id'}), 400)
    if "name" not in data:
        return make_response(jsonify({'error': 'Missing name'}), 400)
    if "email" not in data:
        return make_response(jsonify({'error': 'Missing email'}), 400)
    if "comment" not in data:
        return make_response(jsonify({'error': 'Missing comment'}), 400)

    client = storage.get(User, data.get('client_id'))
    barber = storage.get(User, data.get('barber_id'))

    if not client or not barber:
        abort(404, description="Client or Barber not found.")

    if barber.role != 'barber':
        abort(400, description="Selected user is not a barber.")

    review = Review(**data)
    storage.new(review)
    storage.save()
    return make_response(jsonify(review.to_dict()), 200)

@app_views.route('/barbers/<barber_id>/reviews', methods=['GET'], strict_slashes=False)
def get_reviews(barber_id):
    """ Retrieve reviews for a specific barber """

    barber = storage.get(User, barber_id)

    if not barber or barber.role != 'barber':
        abort(404, description='Barber not found or invalid ID.')

    reviews = [review.to_dict()
               for review in barber.barber_reviews]

    return jsonify(reviews)
