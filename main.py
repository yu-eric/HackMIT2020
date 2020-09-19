from flask import Flask, request
app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def home_page():
    if request.method=='GET':
        return "<h1>homepage</h1>"
    else:
        return None
        # handle image upload here

@app.route('/about')
def about_page():
    return"<h1>about page</h1>"