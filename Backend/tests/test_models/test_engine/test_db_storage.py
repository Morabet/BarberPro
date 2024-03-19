#!/usr/bin/python3

import unittest
from unittest.mock import patch
from models.base_model import BaseModel, Base
from models.user import User
from models.booking import Booking
from models.review import Review
from models.style import Style
from sqlalchemy.orm import sessionmaker, scoped_session

# Import the DBStorage class
from models.engine.db_storage import DBStorage


class TestDBStorage(unittest.TestCase):
    def setUp(self):
        self.storage = DBStorage()
        self.sample_user = User(id="1234", email="test@example.com")
        self.sample_booking = Booking(id="2345")

        self.storage.new(self.sample_user)
        self.storage.new(self.sample_booking)
        self.storage.save()

    def tearDown(self):
        self.storage.delete(self.sample_user)
        self.storage.delete(self.sample_booking)
        self.storage.save()
        self.storage.close()

    @patch('models.base_model.Base.metadata')
    def test_init(self, mock_metadata):
        self.assertIsNotNone(self.storage._DBStorage__engine)
        self.assertIsNotNone(self.storage._DBStorage__session)

    def test_new(self):
        initial_count = len(self.storage.all())
        new_user = User(id="5678", email="new@example.com")
        self.storage.new(new_user)
        self.assertIn(new_user, self.storage._DBStorage__session.new)
        self.storage.delete(new_user)

    def test_all_without_class(self):
        objects = self.storage.all()
        self.assertIsInstance(objects, dict)
        self.assertGreaterEqual(len(objects), 2)  # At least user and booking

    def test_all_with_class(self):
        users = self.storage.all(User)
        bookings = self.storage.all(Booking)
        self.assertIsInstance(users, dict)
        self.assertIsInstance(bookings, dict)
        self.assertGreaterEqual(len(users), 1)
        self.assertGreaterEqual(len(bookings), 1)

    def test_save(self):
        new_user = User(id="9999", email="save@example.com")
        self.storage.new(new_user)
        self.storage.save()
        users = self.storage.all(User)
        self.assertIn('User.9999', users)
        self.storage.delete(new_user)

    def test_delete(self):
        initial_count = len(self.storage.all(User))
        self.storage.delete(self.sample_user)
        self.storage.save()
        new_count = len(self.storage.all(User))
        self.assertEqual(initial_count - 1, new_count)

    def test_check_email(self):
        self.assertEqual(self.storage.check_email(
            "test@example.com"), self.sample_user)
        self.assertIsNone(self.storage.check_email("notfound@example.com"))

    def test_get(self):
        self.assertEqual(self.storage.get(User, "1234"), self.sample_user)
        self.assertIsNone(self.storage.get(User, "not-existing-id"))
        self.assertIsNone(self.storage.get("NotAClass", "1234"))

    def test_reload(self):
        with patch.object(self.storage, '_DBStorage__session') as mock_session:
            self.storage.reload()
            mock_session.assert_called()

    def test_close(self):
        with patch.object(self.storage, '_DBStorage__session') as mock_session:
            self.storage.close()
            mock_session.remove.assert_called()


if __name__ == '__main__':
    unittest.main()
