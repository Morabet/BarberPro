#!/usr/bin/python3
""" bookings api endpoints"""

from api.v1.views import app_views
from flask import abort, jsonify, request, make_response
from models.user import User
from models.booking import Booking
from datetime import datetime, date
from models.engine.db_storage import DBStorage
from dateutil.parser import isoparse

storage = DBStorage()

@app_views.route('/users/<user_id>/appointments', methods=['GET'], strict_slashes=False)
def get_appointments(user_id):
    """ Get appointments for a user based on role. """

    user = storage.get(User, user_id)
    if not user:
        abort(404)

    if user.role == "barber":
        appointments = [appointment.to_dict()
                        for appointment in user.barber_appointments]
    elif user.role == "client":
        appointments = [appointment.to_dict()
                        for appointment in user.client_appointments]
    else:
        abort(400, description="Invalid user role.")

    return jsonify(appointments)

@app_views.route('/users/<user_id>/appointments/<appointment_id>', methods=['DELETE'], strict_slashes=False)
def delete_appointment(user_id, appointment_id):
    """ Deletes an appointment """

    user = storage.get(User, user_id)
    if not user:
        abort(404)

    appointment = storage.get(Booking, appointment_id)
    if not appointment:
        abort(404)

    if user.role == "barber" and appointment.barber_id != user_id:
        abort(400, description="You are not allowed to delete this appointment.")
    elif user.role == "client" and appointment.client_id != user_id:
        abort(400, description="You are not allowed to delete this appointment.")

    storage.delete(appointment)
    storage.save()

    return make_response(jsonify({}), 200)

@app_views.route('/appointments', methods=['POST'], strict_slashes=False)
def create_appointment():
    """ Create a new appointment (client reserves a barber) """

    data = request.get_json()
    if not data:
        return make_response(jsonify({'error': 'Not a JSON'}), 400)
    if "barber_id" not in data:
        return make_response(jsonify({'error': 'Missing barber_id'}), 400)
    if "client_id" not in data:
        return make_response(jsonify({'error': 'Missing client_id'}), 400)
    if "booking_date" not in data:
        return make_response(jsonify({'error': 'Missing booking_date'}), 400)

    client = storage.get(User, data.get('client_id'))
    barber = storage.get(User, data.get('barber_id'))

    if not client or not barber:
        abort(404, description="Client or Barber not found.")

    if barber.role != 'barber':
        abort(400, description="Selected user is not a barber.")

    data['booking_date'] = isoparse(data['booking_date'])
    appointment = Booking(**data)
    storage.new(appointment)
    storage.save()

    return make_response(jsonify(appointment.to_dict()), 201)

@app_views.route('/users/<user_id>/appointmentsDate', methods=['GET'], strict_slashes=False)
def get_appointments_by_date(user_id):
    """ Get appointments for a user by date. """

    user = storage.get(User, user_id)
    if not user:
        abort(404)

    try:
        date_param = request.args.get('date', str(date.today()))
        print("Received Date Parameter:", date_param)

        selected_date = datetime.strptime(date_param, '%Y-%m-%d').date()

        if user.role == "barber":
            appointments = [appointment.to_dict()
                            for appointment in user.barber_appointments]
        elif user.role == "client":
            appointments = [appointment.to_dict()
                            for appointment in user.client_appointments]
        else:
            abort(400, description="Invalid user role.")

        # Add these lines for debugging
        print("All Appointments (before filtering):", appointments)
        print("Selected Date:", selected_date)

        # Filter appointments based on the selected date
        appointments = [appointment
                        for appointment in appointments
                        if appointment['booking_date'].date() == selected_date]

        # Add this line for logging
        print("Filtered Appointments (after filtering):", appointments)

        return jsonify(appointments)
    except ValueError:
        abort(400, description="Invalid date format. Use YYYY-MM-DD.")
