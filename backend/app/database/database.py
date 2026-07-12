"""
Database connection setup.

Creates the SQLAlchemy engine + session factory used throughout the app,
and exposes `get_db`, a FastAPI dependency that yields a scoped session
per request and always closes it afterwards.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config.settings import settings

# SQLite require karta hai check_same_thread=False jab multi-threading use ho rahi ho (FastAPI me common hai)
if settings.DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        settings.DATABASE_URL, 
        connect_args={"check_same_thread": False}
    )
else:
    # PostgreSQL ke liye normal engine configurations
    engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency: yields a DB session and guarantees it's closed."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()