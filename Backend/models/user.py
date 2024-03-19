#!/usr/bin/python3
""" class User """

from models.base_model import BaseModel, Base
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship


class User(BaseModel, Base):
    """Representation of a user"""
    __tablename__ = 'users'

    name = Column(String(128), nullable=False)
    location = Column(String(128))
    phone = Column(String(20))
    email = Column(String(128), unique=True, nullable=False)
    password = Column(String(128), nullable=False)
    role = Column(String(50), nullable=False)

    # Relationship with Review (barber_reviews and client_reviews will be dynamically created)
    barber_reviews = relationship(
        'Review', foreign_keys='Review.barber_id', back_populates='barber', cascade="all, delete-orphan")

    client_reviews = relationship(
        'Review', foreign_keys='Review.client_id', back_populates='client', cascade="all, delete-orphan")
    style = relationship('Style', back_populates='barber',
                         cascade="all, delete-orphan")
    barber_appointments = relationship(
        'Booking', foreign_keys='Booking.barber_id', back_populates='barber', cascade="all, delete-orphan")
    client_appointments = relationship(
        'Booking', foreign_keys='Booking.client_id', back_populates='client', cascade="all, delete-orphan")

    def __init__(self, *args, **kwargs):
        """Initializing the user instance"""
        super().__init__(*args, **kwargs)
