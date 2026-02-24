import flask
from flask import Flask, render_template, request, redirect, flash
import os
from flask import jsonify
from flask_mail import Mail, Message



app = Flask(__name__)
app.secret_key = "secretkey"

# ---------------- EMAIL CONFIGURATION ---------------- #
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('EMAIL_USER')       # Name of environment variable
app.config['MAIL_PASSWORD'] = os.environ.get('EMAIL_PASS')       # Name of environment variable
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('EMAIL_USER') # Required default sender


mail = Mail(app)

# ---------------- ROUTES ---------------- #

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/services")
def services():
    return render_template("services.html")

@app.route("/about")
def about():
    return render_template("about.html")


CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSh9UZ4U2SU9R0LQcTt7znYEWxl-VWQAO_4ECKIQr2zfM6auJM9ADm8gSl2J9dCjBr3u_X6czF-sq_I/pub?gid=0&single=true&output=csv"


@app.route("/booking")
def booking():
    return render_template("booking.html")


@app.route("/gallery")
def gallery():
    return render_template("gallery.html")


@app.route("/contact")
def contact():
    return render_template("contact.html")




# ---------------- EMAIL FORM ROUTE ---------------- #
@app.route("/submit", methods=["POST"])
def submit_form():
    # Common fields
    name = request.form.get("name", "No Name Provided")
    email = request.form.get("email", "No Email Provided")
    message = request.form.get("message", "")
    form_type = request.form.get("form_type", "general")

    # Determine subject and body
    if form_type == "question":
        subject = "New Website Question Submission"
        msg_body = f"Form Type: Question\n\nName: {name}\nEmail: {email}\nMessage:\n{message}"
    elif form_type == "newsletter":
        subject = "New Newsletter Subscription"
        msg_body = f"Form Type: Newsletter Subscription\n\nEmail: {email}"
    else:
        subject = "New Website Form Submission"
        msg_body = f"Form Type: {form_type}\n\nName: {name}\nEmail: {email}\nMessage:\n{message}"

    msg = Message(
        subject=subject,
        sender=app.config['MAIL_DEFAULT_SENDER'],
        recipients=[app.config['MAIL_USERNAME']]
    )
    msg.body = msg_body

    try:
        mail.send(msg)
        flash("Form submitted successfully!", "success")
    except Exception as e:
        print("Error sending email:", e)
        flash("Failed to submit form. Please try again later.", "error")

    return redirect(request.referrer or "/")
# ---------------- SEARCH ROUTE ---------------- #

MEDIA_FOLDER = os.path.join(app.root_path, "static", "media")

@app.route("/search")
def search():
    query = request.args.get("query", "").lower()
    results = []

    if not query:
        return jsonify([])

    pages = {
        "Home": "/",
        "Services": "/services",
        "Booking": "/booking",
        "Gallery": "/gallery",
        "About": "/about",
        "Contact": "/contact",
    }

    for name, url in pages.items():
        if query in name.lower():
            results.append({"title": name, "url": url, "type": "Page", "thumbnail": None})

    if os.path.exists(MEDIA_FOLDER):
        for file in os.listdir(MEDIA_FOLDER):
            if query in file.lower():
                name = os.path.splitext(file)[0].replace("-", " ").title()
                results.append({
                    "title": name,
                    "url": f"/static/media/{file}",
                    "type": "Media",
                    "thumbnail": f"/static/media/{file}"
                })

    return jsonify(results)

# ---------------- RUN ---------------- #

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
