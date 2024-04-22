from flask import Flask, render_template, redirect, url_for, request
from flask_pymongo import PyMongo 
from bson import ObjectId 

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb+srv://juliareisrodrigues5:123@cluster0.9vj78v4.mongodb.net/teste?retryWrites=true&w=majority&appName=Cluster0'
mongo = PyMongo(app)

@app.route('/')
def alpha():
    return render_template('cadastrar.html')

@app.route('/create', methods=['POST'])
def create():
    if mongo.db is None:
        return "Não foi possível conectar ao banco de dados", 500
    user = {
        'nome': request.form['nome'],
        'senha': request.form['senha'],
        'email': request.form['email']
    }
    mongo.db.usuarios.insert_one(user)
    return redirect(url_for('alpha'))

@app.route('/update', methods = ['POST'])
def update():
    user_id = request.form['id']
    update = {}
    if 'nome' in request.form and request.form['nome']:
        update['nome'] = request.form['nome']
        
    if 'senha' in request.form and request.form['senha']:
        update['senha'] = request.form['senha']
    
    if 'email' in request.form and request.form['email']:
        update['email'] = request.form['email']   
    
    if update:
        mongo.db.usuarios.update_one(
            {'_id':ObjectId(user_id)},
            {'$set': update}
            )
        return redirect(url_for('alpha'))
        
     
@app.route('/delete', methods = ['POST'])
def delete():
    del_id = request.form['delId']
    if del_id:
        mongo.db.usuarios.delete_one({'_id': ObjectId(del_id)})
    return redirect(url_for('alpha'))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')