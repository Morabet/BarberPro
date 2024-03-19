#!/usr/bin/python3

import unittest
from datetime import datetime
from models.base_model import BaseModel, time
import uuid


class TestBaseModel(unittest.TestCase):
    def setUp(self):
        """Set up the test case environment"""
        pass

    def test_initialization_no_args(self):
        """Test BaseModel initialization without arguments"""
        model = BaseModel()
        self.assertIsNotNone(model.id)
        self.assertIsInstance(model.id, str)
        self.assertTrue(len(model.id) > 0)

    def test_initialization_with_args(self):
        """Test BaseModel initialization with arguments"""
        # Assumed that **kwargs will include 'id' and 'created_at' for testing purposes
        custom_id = str(uuid.uuid4())
        custom_created_at = datetime.utcnow()

        model = BaseModel(
            id=custom_id, created_at=custom_created_at.isoformat())

        self.assertEqual(model.id, custom_id)
        self.assertEqual(model.created_at, custom_created_at)

    def test_initialization_with_existing_id(self):
        """Test BaseModel initialization with existing 'id' in kwargs"""
        custom_id = str(uuid.uuid4())
        model = BaseModel(id=custom_id)
        self.assertEqual(model.id, custom_id)

    def test_initialization_created_at_as_str(self):
        """Test BaseModel initialization with 'created_at' as a string in kwargs"""
        custom_created_at = datetime.utcnow().isoformat()
        model = BaseModel(created_at=custom_created_at)
        self.assertEqual(model.created_at.isoformat(), custom_created_at)

    def test_string_representation(self):
        """Test the string representation of BaseModel"""
        model = BaseModel()
        string = str(model)
        self.assertIn(f"[BaseModel] ({model.id})", string)

    def test_to_dict(self):
        """Test conversion of BaseModel to dictionary"""
        model = BaseModel()
        model_dict = model.to_dict()

        self.assertEqual(model_dict["id"], model.id)
        self.assertEqual(model_dict["created_at"],
                         model.created_at.strftime(time))
        self.assertNotIn("_sa_instance_state", model_dict)
        self.assertNotIn("password", model_dict)

    def test_to_dict_with_extra_attribute(self):
        """Test to_dict method with extra attribute added to BaseModel"""
        model = BaseModel()
        model.name = "Test Model"
        model_dict = model.to_dict()

        self.assertEqual(model_dict["name"], "Test Model")

    def test_init_with_class_attribute_in_kwargs(self):
        """Test initialization with '__class__' passed in kwargs"""
        model = BaseModel(__class__="MyModel")
        self.assertNotEqual(model.__class__.__name__, "MyModel")

    def test_init_with_invalid_created_at(self):
        """Test initialization with invalid 'created_at' format in kwargs"""
        with self.assertRaises(ValueError):
            BaseModel(created_at="invalid-date-format")

    def tearDown(self):
        """Clean up the test case environment"""
        pass


if __name__ == '__main__':
    unittest.main()
