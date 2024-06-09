from sqlalchemy import Column, String, Integer, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class PhoneNumber(Base):
    __tablename__ = 'phone_numbers'
    id = Column(Integer, primary_key=True, autoincrement=True)
    phone_number = Column(String, unique=True, nullable=False)

# Define the database URL
DATABASE_URL = "sqlite:///phone_numbers.db"

# Create a database engine
engine = create_engine(DATABASE_URL, echo=True)

# Create the phone_numbers table
Base.metadata.create_all(engine)
