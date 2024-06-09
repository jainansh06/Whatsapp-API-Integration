from sqlalchemy import create_engine, Column, String, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Define the database URL
DATABASE_URL = "sqlite:///phone_numbers.db"

# Create a database engine
engine = create_engine(DATABASE_URL, echo=True)

# Define a base class for declarative class definitions
Base = declarative_base()

# Define the PhoneNumber model
class PhoneNumber(Base):
    __tablename__ = 'phone_numbers'
    id = Column(Integer, primary_key=True, autoincrement=True)
    phone_number = Column(String, unique=True, nullable=False)

# Create the phone_numbers table
Base.metadata.create_all(engine)
