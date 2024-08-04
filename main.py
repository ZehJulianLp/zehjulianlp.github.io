from flask import Flask
from flask import render_template
import random
app = Flask(__name__)


@app.route("/")
def home():

    r = random.randint(1, 100)
    return render_template("index.html", r=r)



if __name__ == "__main__":
    app.run(debug=True)