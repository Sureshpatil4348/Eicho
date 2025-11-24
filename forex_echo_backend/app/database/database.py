"""SQLAlchemy database setup."""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST, MYSQL_DB, MYSQL_PORT, MYSQL_SSL_DISABLED
from app.utilities.forex_logger import forex_logger

logger = forex_logger.get_logger(__name__)

# Force SSL for Azure MySQL
DATABASE_URL = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
connect_args = {
    "charset": "utf8mb4",
    "ssl": {
        "ssl_disabled": False,
        "check_hostname": False,
        "verify_mode": 0
    }
}
logger.info(f"Connecting to database: {MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB} (SSL: REQUIRED)")

engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True, pool_recycle=3600)
logger.info("Database engine created successfully")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def create_tables():
    """Create all database tables if they don't exist"""
    try:
        # Import all entities to register them with Base
        from app.database.entities.auth_entity import AuthEntity, PasswordResetTokenEntity
        from app.database.entities.trading_entity import TradingSessionEntity, TradingTaskEntity, TradeEntity
        from app.database.entities.capital_allocation_entity import PortfolioEntity, StrategyAllocationEntity, PairAllocationEntity, RiskEventEntity

        
        logger.info("Creating database tables if they don't exist...")
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created/verified")
        
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
        raise

def get_db():
    """Database dependency with enhanced error handling."""
    db = None
    try:
        logger.debug("Creating database session")
        db = SessionLocal()
        yield db
    except Exception as e:
        logger.error(f"Database session error: {e}")
        if db:
            db.rollback()
        raise Exception("Database operation failed")
    finally:
        if db:
            logger.debug("Closing database session")
            db.close()