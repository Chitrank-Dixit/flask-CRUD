# Flask CRUD API Backend

This directory contains the Python Flask backend for the CRUD application. It provides a RESTful API for user authentication (email/password and Google OAuth) and managing items, using PostgreSQL as the database.

## Features

-   **User Authentication**: Sign-up, Login, and secure password hashing.
-   **Google OAuth 2.0**: Allow users to sign in with their Google account.
-   **JWT-based Authorization**: API endpoints are protected using JSON Web Tokens.
-   **CRUD Operations for Items**: Full Create, Read, Update, Delete functionality for user-specific items.
-   **Database**: PostgreSQL with SQLAlchemy ORM and Alembic for migrations.
-   **CORS Enabled**: Allows cross-origin requests from the React frontend.

## Project Structure

```
backend/
├── app.py              # Main Flask application, defines API routes
├── models.py           # SQLAlchemy database models (User, Item)
├── config.py           # Application configuration from environment variables
├── extensions.py       # Initialization of Flask extensions (SQLAlchemy, Migrate, CORS)
├── requirements.txt    # List of Python dependencies
├── .env.example        # Example environment file
└── README.md           # This file
```

## Setup and Installation

### 1. Prerequisites

-   Python 3.8+
-   PostgreSQL database server

### 2. Create a Virtual Environment

It's highly recommended to use a virtual environment to manage dependencies.

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
# venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate
```

### 3. Install Dependencies

Install all the required Python packages using pip.

```bash
pip install -r requirements.txt
```

### 4. Configure the Database

-   Make sure your PostgreSQL server is running.
-   Create a new database for this application. For example, using `psql`:
    ```sql
    CREATE DATABASE crud_app;
    CREATE USER myuser WITH PASSWORD 'mypassword';
    GRANT ALL PRIVILEGES ON DATABASE crud_app TO myuser;
    ```

### 5. Set Environment Variables

-   Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
-   Open the `.env` file and edit the variables:
    -   `SECRET_KEY`: Change this to a long, random string. This is crucial for security.
    -   `DATABASE_URL`: Update this with your PostgreSQL connection string. Format: `postgresql://user:password@host:port/database_name`.
    -   `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: To enable Google OAuth, create a project in the [Google Cloud Console](https://console.cloud.google.com/), enable the "Google People API", create OAuth 2.0 credentials for a "Web application", and add `http://127.0.0.1:5000/api/auth/google/callback` as an "Authorized redirect URI". Paste the client ID and secret here.

### 6. Set Up the Database Schema

Run the database migrations to create the `user` and `item` tables.

```bash
# Set the FLASK_APP environment variable
# On Windows (cmd):
# set FLASK_APP=app.py
# On Windows (PowerShell):
# $env:FLASK_APP = "app.py"
# On macOS/Linux:
# export FLASK_APP=app.py

# Initialize the migration environment (only needs to be done once)
flask db init

# Create the initial migration script
flask db migrate -m "Initial migration."

# Apply the migration to the database
flask db upgrade
```

## Running the Application

Once the setup is complete, you can run the Flask development server.

```bash
flask run
```

The backend API will now be running at `http://127.0.0.1:5000`. The React frontend can now make requests to this server.
