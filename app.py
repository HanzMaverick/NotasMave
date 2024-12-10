from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///notes.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Modelo de la base de datos
class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    content = db.Column(db.Text, nullable=False)
    editable = db.Column(db.Boolean, default=True)

# Inicializar la base de datos dentro del contexto de la aplicación
with app.app_context():
    db.create_all()

# Endpoint para guardar notas
@app.route('/save-note', methods=['POST'])
def save_note():
    data = request.json
    name = data['name']
    content = data['content']

    if Note.query.filter_by(name=name).first():
        return jsonify({"error": "La nota ya existe y no se puede editar."}), 403

    new_note = Note(name=name, content=content, editable=False)
    db.session.add(new_note)
    db.session.commit()
    return jsonify({"message": "Nota guardada exitosamente."}), 201

# Endpoint para recuperar notas
@app.route('/get-note/<note_name>', methods=['GET'])
def get_note(note_name):
    note = Note.query.filter_by(name=note_name).first()
    if not note:
        return jsonify({"error": "Nota no encontrada."}), 404

    return jsonify({"name": note.name, "content": note.content})

# Página para guardar notas (solo para el administrador)
@app.route('/admin/save', methods=['GET'])
def admin_save():
    return render_template('admin.html')

# Página para buscar notas (para los lectores)
@app.route('/search', methods=['GET'])
def search_note():
    return render_template('search.html')


# Página principal
@app.route('/')
def index():
    return render_template('search.html')

if __name__ == '__main__':
    app.run(debug=True)
