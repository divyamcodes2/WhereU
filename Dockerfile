# Step 1: Use Python 3.10 as base image
FROM python:3.10-slim

# Step 2: Set working directory inside the container
WORKDIR /app

# Step 3: Copy the dependencies file (requirements.txt)
COPY requirements.txt .

# Step 4: Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Step 5: Copy the rest of your app's code into the container
COPY . .

# Step 6: Expose the port your Flask app will run on (5000 by default)
EXPOSE 5000

# Step 7: Set the environment variable for Flask
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Step 8: Run the app
CMD ["flask", "run"]
