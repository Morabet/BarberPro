#!/usr/bin/python3
""" class Booking """

from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship


class Booking(BaseModel, Base):
    """Representation of a booking"""
    __tablename__ = 'bookings'

    barber_id = Column(String(60), ForeignKey(
        'users.id', ondelete='CASCADE'), nullable=False)
    client_id = Column(String(60), ForeignKey(
        'users.id', ondelete='CASCADE'), nullable=False)
    booking_date = Column(DateTime)

    barber = relationship('User', foreign_keys=[
        barber_id], back_populates='barber_appointments')
    client = relationship('User', foreign_keys=[
        client_id], back_populates='client_appointments')

    def __init__(self, *args, **kwargs):
        """Initializing the booking instance"""
        super().__init__(*args, **kwargs)
