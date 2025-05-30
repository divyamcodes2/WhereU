# === Imports ===

# Core Flask functionality for routing, templating, sessions, etc.
from flask import Flask, render_template, request, session, redirect, flash

# SocketIO for real-time communication (WebSocket-based)
from flask_socketio import SocketIO, emit

# CORS: Cross-Origin Resource Sharing (allows frontend from different origins to access backend)
from flask_cors import CORS

# Werkzeug provides utilities for secure password hashing
from werkzeug.security import generate_password_hash, check_password_hash

# PyMongo is a MongoDB client for Flask
from flask_pymongo import PyMongo

# OS module to access environment variables, secrets for secure key generation
import os
import secrets


# === App Configuration ===

# Initialize Flask app
app = Flask(__name__)

# Generate a secure secret key (used for session encryption)
app.secret_key = os.environ.get('SECRET_KEY') or secrets.token_hex(32)

# MongoDB configuration (connecting to local database named 'locationtracker')
app.config["MONGO_URI"] = "mongodb://localhost:27017/locationtracker"

# Initialize PyMongo with the app to enable MongoDB access
mongo = PyMongo(app)

# Enable CORS (Cross-Origin Resource Sharing) to allow cross-domain requests
CORS(app)

# Initialize SocketIO with support for cross-origin connections (needed for WebSocket support)
socketio = SocketIO(app, cors_allowed_origins="*")


# === Routes ===

@app.route('/')
def index():
    """
    Landing route.
    - If user is logged in (session contains 'username'), render the map dashboard.
    - If not logged in, redirect them to the signup page with a flash message.
    """
    if 'username' in session:
        return render_template('index.html')
    else:
        flash('🚫 Please sign up to access the app.', 'warning')
        return redirect('/signup')

@app.route('/help')
def help():
    return render_template('help.html')


@app.route('/tracker')
def tracker():
    """
    Main map tracking dashboard.
    - Only accessible to authenticated users.
    - Redirects unauthenticated users to signup.
    """
    if 'username' not in session:
        return redirect('/signup')
    return render_template('index.html')


@socketio.on('location')
def handle_location(data):
    """
    SocketIO event handler.
    - Listens for 'location' events from clients.
    - Broadcasts received location data to all connected clients.

    Parameters:
    - data (dict): Should contain 'latitude' and 'longitude'.
    """
    emit('location', data, broadcast=True)


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    """
    User signup page.
    - GET: Renders signup form.
    - POST: Validates user input, checks for duplicates, hashes password, inserts user into MongoDB.
    """
    if request.method == 'POST':
        username = request.form['username']
        password_input = request.form['password']

        # Securely hash the password using Werkzeug
        password = generate_password_hash(password_input)

        # Check if username already exists
        existing_user = mongo.db.users.find_one({'username': username})
        if existing_user:
            flash('⚠️ Username already exists. Please choose another.', 'warning')
            return redirect('/signup')

        # Insert new user document into 'users' collection
        mongo.db.users.insert_one({'username': username, 'password': password})

        # Redirect user to login after successful registration
        flash('✅ Signup successful! Please log in.', 'success')
        return redirect('/login')

    return render_template('signup.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    """
    User login route.
    - GET: Renders login form.
    - POST: Authenticates user using hashed password comparison.
    - On success: sets session variable and redirects to /tracker.
    - On failure: shows error message and reloads login page.
    """
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Fetch user document by username
        user = mongo.db.users.find_one({'username': username})

        # Verify hashed password
        if user and check_password_hash(user['password'], password):
            session['username'] = username  # Store username in session
            return redirect('/tracker')
        else:
            flash('⚠️ Invalid username or password. Please try again.', 'warning')

    return render_template('login.html')


@app.route('/logout')
def logout():
    """
    Logout route.
    - Clears the current session.
    - Redirects to signup page with logout message.
    """
    session.clear()
    flash('👋 You have been logged out successfully.', 'info')
    return redirect('/signup')


@app.route('/delete_account', methods=['POST'])
def delete_account():
    """
    Deletes a user's account.
    - Only accessible to logged-in users via POST (form).
    - Deletes user's document from MongoDB.
    - Clears session and redirects to signup page with appropriate message.

    Explanation of:
    ----------------------
    result.deleted_count:
    - This attribute comes from the DeleteResult object returned by:
          result = mongo.db.collection.delete_one(query)
    - It tells you how many documents were actually deleted from the database.

    Common values:
    - 1 → One document matched the query and was successfully deleted.
    - 0 → No document matched the query, so nothing was deleted.

    Why it's important:
    - It helps confirm whether the deletion succeeded or failed.
    - Useful for debugging, validation, and user feedback.

    Example:
        result = mongo.db.users.delete_one({'username': 'john'})
        if result.deleted_count == 1:
            print("✅ User deleted successfully.")
        else:
            print("❌ No user found to delete.")
    """
    if 'username' not in session:
        flash('❌ You must be logged in to delete your account.', 'danger')
        return redirect('/login')

    username = session['username']

    # Delete user document from database
    result = mongo.db.users.delete_one({'username': username})

    # Check how many documents were deleted
    if result.deleted_count == 1:
        # If deletion was successful, clear session and notify user
        session.clear()
        flash('🗑️ Your account has been deleted.', 'info')
    else:
        # If deletion failed, notify user
        flash('⚠️ Something went wrong. Please try again.', 'warning')

    return redirect('/signup')


# === Run App ===

if __name__ == '__main__':
    # Launch the Flask app using SocketIO server with debugging enabled
    socketio.run(app, debug=True)
