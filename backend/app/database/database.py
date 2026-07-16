"""
Database connection setup.

Creates the SQLAlchemy engine + session factory used throughout the app,
and exposes `get_db`, a FastAPI dependency that yields a scoped session
per request and always closes it afterwards.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config.settings import settings

# `pool_pre_ping` avoids "server closed the connection unexpectedly" errors
# on long-lived connections (common with PostgreSQL behind a load balancer).
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
