#!/usr/bin/python3
"""
Contains the class DBStorage
"""

import models
from models.base_model import BaseModel, Base
from models.user import User
from models.booking import Booking
from models.review import Review
from models.style import Style
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from os import getenv


classes = {"User": User, "Booking": Booking, "Review": Review, "Style": Style}


class DBStorage:
    """ interacts with the MySQL data """
    __engine = None
    __session = None

    def __init__(self):
        """ Instantiate a DBStorage object """
        self.__engine = create_engine(
            'mysql+mysqldb://barber_dev:barber_dev_pwd@localhost:3306/barber_dev_db')

        # Base.metadata.drop_all(self.__engine)
        self.reload()

    def all(self, cls=None):
        """query on the current database session"""
        new_dict = {}
        for clss in classes:
            if cls is None or cls is classes[clss] or cls is clss:
                objs = self.__session.query(classes[clss]).all()
                for obj in objs:
                    key = obj.__class__.__name__ + '.' + obj.id
                    new_dict[key] = obj
        return (new_dict)

    def new(self, obj):
        """add the object to the current database session"""
        self.__session.add(obj)

    def save(self):
        """commit all changes of the current database session"""
        self.__session.commit()

    def update(self, **kwargs):
        """update the instance"""
        ignore = ['id', 'email', 'created_at']
        if kwargs:
            for k, v in kwargs.items():
                if k not in ignore:
                    setattr(self, k, v)
            self.save()

    def delete(self, obj):
        """delete from the current database session obj if not None"""
        self.__session.delete(obj)

    def reload(self):
        """
        create current database session from the engine
        using a sessionmaker
        """
        Base.metadata.create_all(self.__engine)
        sess_factory = sessionmaker(bind=self.__engine, expire_on_commit=False)
        Session = scoped_session(sess_factory)
        self.__session = Session

    def check_style(self, style, barber_id):
        """
        returns object based on it's class and id
        None if not found        
        """
        for value in self.all(Style).values():
            if value.style_name == style and value.barber_id == barber_id:
                return value
        return None

    def check_email(self, email):
        """
        returns object based on it's class and id
        None if not found        
        """
        for value in self.all(User).values():
            if value.email == email:
                return value
        return None

    def get(self, cls, id):
        """
        Returns the object based on the class name and its ID
        """
        if cls not in classes.values():
            return None

        for value in self.all(cls).values():
            if (value.id == id):
                return value
        return None

    def close(self):
        """call remove() method on the private session attribute"""
        self.__session.remove()
