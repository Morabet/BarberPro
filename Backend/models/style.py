#!/usr/bin/python3
""" class Style """

from models.base_model import BaseModel, Base
from sqlalchemy import Integer, Column, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship


class Style(BaseModel, Base):
    """Representation of a style"""
    __tablename__ = 'styles'

    barber_id = Column(String(60), ForeignKey(
        'users.id', ondelete='CASCADE'), nullable=False)
    style_name = Column(String(128), nullable=False)
    price = Column(Integer, nullable=False)

    # Add a unique constraint across barber_id and style_name
    __table_args__ = (UniqueConstraint('barber_id', 'style_name'),)

    barber = relationship('User', back_populates='style')

    def __init__(self, *args, **kwargs):
        """Initializing the style instance"""
        super().__init__(*args, **kwargs)
