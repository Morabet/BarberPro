#!/usr/bin/python3
""" class Review """

from models.base_model import BaseModel, Base
from sqlalchemy import  Column, String, ForeignKey
from sqlalchemy.orm import relationship


class Review(BaseModel, Base):
    """Representation of a review"""
    __tablename__ = 'reviews'

    barber_id = Column(String(60), ForeignKey(
        'users.id', ondelete='CASCADE'), nullable=False)
    client_id = Column(String(60), ForeignKey(
        'users.id', ondelete='CASCADE'), nullable=False)
    name = Column(String(60), nullable=False)
    email = Column(String(256), nullable=False)
    comment = Column(String(256), nullable=False)

    # Relationship with Review (barber_reviews and client_reviews will be dynamically created)
    barber = relationship('User', foreign_keys=[
        barber_id], back_populates='barber_reviews')
    client = relationship('User', foreign_keys=[
        client_id], back_populates='client_reviews')

    def __init__(self, *args, **kwargs):
        """Initializing the review instance"""
        super().__init__(*args, **kwargs)
