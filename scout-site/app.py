from flask import Flask, render_template
import io
import pandas as pd
import requests



app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/services")
def services():
    return render_template("services.html")

CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSh9UZ4U2SU9R0LQcTt7znYEWxl-VWQAO_4ECKIQr2zfM6auJM9ADm8gSl2J9dCjBr3u_X6czF-sq_I/pub?gid=0&single=true&output=csv"

@app.route("/booking")
def booking():
    r = requests.get(CSV_URL)
    df = pd.read_csv(io.StringIO(r.text))

    # extract available slots only
    available = df[df["Status"] == "Available"][["Day", "Time"]].values.tolist()

    return render_template("booking.html", slots=available)


@app.route("/gallery")
def gallery():
    return render_template("gallery.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

if __name__ == "__main__":
    app.run(debug=True)
