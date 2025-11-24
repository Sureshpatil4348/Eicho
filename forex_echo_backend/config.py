import os
from decouple import config

# Email Configuration
EMAIL_HOST = config("EMAIL_HOST", default="smtp.gmail.com")
EMAIL_PORT = config("EMAIL_PORT", default=587, cast=int)
EMAIL_USE_TLS = config("EMAIL_USE_TLS", default=True, cast=bool)
EMAIL_USE_SSL = config("EMAIL_USE_SSL", default=False, cast=bool)
EMAIL_HOST_USER = config("EMAIL_HOST_USER", default="sandeep@technoexponent.co.in")
EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD", default="pptlohrscjpzjofw")

# Database Configuration
MYSQL_USER = config("MYSQL_USER", default="eichodb")
MYSQL_PASSWORD = config("MYSQL_PASSWORD", default="8sJAn.)x94?L")
MYSQL_HOST = config("MYSQL_HOST", default="eicho-db.mysql.database.azure.com")
MYSQL_DB = config("MYSQL_DB", default="eicho")
MYSQL_PORT = config("MYSQL_PORT", default="3306")

# SSL Configuration for Azure MySQL
MYSQL_SSL_DISABLED = config("MYSQL_SSL_DISABLED", default=True, cast=bool)
MYSQL_SSL_CA = config("MYSQL_SSL_CA", default=None)

# JWT Configuration
JWT_SECRET_KEY = config("JWT_SECRET_KEY", default="O9fTITThxK2UY9EUdQQMXT0UMMKHu5wTw7scY9LWeFU")
ALGORITHM = config("ALGORITHM", default="HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = config("ACCESS_TOKEN_EXPIRE_MINUTES", default=30, cast=int)


