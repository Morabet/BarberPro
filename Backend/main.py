#!/usr/bin/python3

from models.engine.db_storage import DBStorage
from models.user import User
from models.review import Review
from models.style import Style
from models.booking import Booking
from datetime import datetime


# Assuming you have already defined a DBStorage class and configured the necessary relationships

storage = DBStorage()

user_dict1 = {"name": "ali", "phone": "0000",
              "email": "ali@gmail.com",
              "password": "aaaa",
              "role": "barber",
              "location": "tetuan"
              }
user_dict2 = {"name": "moha", "phone": "0000",
              "email": "moha@gmail.com",
              "password": "aaaa",
              "role": "client"
              }
user_dict3 = {"name": "hmed", "phone": "0000",
              "email": "hmed@gmail.com",
              "password": "aaaa",
              "role": "client"
              }
user_dict4 = {"name": "ismail", "phone": "0000",
              "email": "ismail@gmail.com",
              "password": "aaaa",
              "role": "barber",
              "location": "tanger"
              }
user_dict5 = {"name": "ismaill", "phone": "0000",
              "email": "ismaill@gmail.com",
              "password": "aaaa",
              "role": "barber",
              "location": "tanger"
              }
user_dict6 = {"name": "ismailll", "phone": "0000",
              "email": "ismailll@gmail.com",
              "password": "aaaa",
              "role": "barber",
              "location": "tanger"
              }
user_dict7 = {"name": "ismaillll", "phone": "0000",
              "email": "ismaillll@gmail.com",
              "password": "aaaa",
              "role": "barber",
              "location": "tanger"
              }
# Create users
user1 = User(**user_dict1)
user2 = User(**user_dict2)
user3 = User(**user_dict3)
user4 = User(**user_dict4)
user5 = User(**user_dict5)
user6 = User(**user_dict6)
user7 = User(**user_dict7)


# Create a review and associate it with the users
rev_dict1 = {"barber_id": user1.id, "client_id": user2.id,
             "name": user2.name, "email": user2.email, "comment": "Great service!"}
rev_dict2 = {"barber_id": user1.id, "client_id": user3.id,
             "name": user3.name, "email": user3.email, "comment": "Good service!"}
review1 = Review(**rev_dict1)
review2 = Review(**rev_dict2)

style_dict = {"barber_id": user1.id, "style_name": "hair", "price": 10}
style = Style(**style_dict)

book_dict1 = {"barber_id": user1.id, "client_id": user2.id,
              "Booking_date": datetime.utcnow()}
book_dict2 = {"barber_id": user1.id, "client_id": user3.id,
              "Booking_date": datetime.utcnow()}
# book1 = Booking(barber=user1, client=user2, Booking_date=datetime.utcnow())
# book2 = Booking(barber=user1, client=user3, Booking_date=datetime.utcnow())
book1 = Booking(**book_dict1)
book2 = Booking(**book_dict2)

# Add the objects to the session
storage.new(user1)
storage.new(user2)
storage.new(user3)
storage.new(user4)
storage.new(user5)
storage.new(user6)
storage.new(user7)
storage.new(review1)
storage.new(review2)
storage.new(style)
storage.new(book1)
storage.new(book2)

# Save the changes to the database
storage.save()

# Reload the session
storage.reload()

# Print users and their associated reviews
all_users = storage.all("User")
print(all_users)
for user_key, user in all_users.items():
    for style in user.style:
        print(f"Barber Style : {style.style_name}")

for user_key, user in all_users.items():
    for barber_review in user.barber_reviews:
        print(f"Barber name : {user.name}")
        print(f"  Rating: {barber_review.rating}, Comment: {barber_review.comment}")

for user_key, user in all_users.items():
    for book in user.barber_appointments:
        print(f"Barber Appointment date:{user.name} {book.Booking_date}")

for user_key, user in all_users.items():
    for client_review in user.client_reviews:
        print(f"Client name : {user.name}")
        print(f"  Rating: {client_review.rating}, Comment: {client_review.comment}")

for user_key, user in all_users.items():
    for book in user.client_appointments:
        print(f"Client Appointment date:{user.name} {book.Booking_date}")
