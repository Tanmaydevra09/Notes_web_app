from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import os  # To access environment variables

app = Flask(__name__)

# Set the SQLite database URI (replace 'notes.db' with your desired database name)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///notes.db'

# Initialize the database
db = SQLAlchemy(app)

# Create a Note model for the database
class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    note = db.Column(db.String(200), nullable=False)

# Create and initialize the database tables
with app.app_context():
    db.create_all()

# Define routes
@app.route('/')
def index():
    db.session.reset()
    return render_template('index.html')

@app.route('/add_note', methods=['POST'])
def add_note():
    note = request.form.get('note')
    new_note = Note(note=note)
    db.session.add(new_note)
    db.session.commit()
    return jsonify({'id': new_note.id, 'note': new_note.note})

@app.route('/get_notes')
def get_notes():
    notes = Note.query.all()
    note_list = [{'id': note.id, 'note': note.note} for note in notes]
    return jsonify({'notes': note_list})

@app.route('/delete_note', methods=['POST'])
def delete_note():
    note_id = request.form.get('id')
    note = Note.query.get(note_id)
    if note:
        db.session.delete(note)
        db.session.commit()
        return jsonify({'message': 'Note deleted'})
    return jsonify({'message': 'Note not found'}), 404

@app.route('/edit_note', methods=['POST'])
def edit_note():
    note_id = request.form.get('id')
    new_note_text = request.form.get('note')
    note = Note.query.get(note_id)
    if note:
        note.note = new_note_text
        db.session.commit()
        return jsonify({'note': note.note})
    return jsonify({'message': 'Note not found'}), 404

if __name__ == '__main__':
    # Get the port from the environment variable (Render requires this)
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
