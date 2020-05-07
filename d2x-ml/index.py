import os
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix
from sklearn.metrics import accuracy_score
from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from sklearn.svm import SVC
from sklearn.metrics import plot_roc_curve
import sys
import json
import ast
import random


def cal(data):
    model.predictions = model.fitted.predict([data])
    print(model.predictions)
    result = model.predictions
    return result


app = Flask(__name__)
api = Api(app)


if __name__ == '__main__':
    file_path = "./"
    print("ML RUNNING")
    in_data = json.load(sys.stdin)
    label = in_data[0]
    disease_id = in_data[1]
    name_file = 'file'
    name_file += str(disease_id)
    name_file += '.csv'
    data = pd.read_csv(os.path.join(file_path, name_file))
    num = random.randint(0, 100)

    data.features = data[label]
    data.targets = data.answer
    # print(data.targets )
    class FindResult(Resource):
        def get(self):
            return {'message': (disease_id*1000)+148, 'num': num }, 200
        def post(self):
            body = request.get_json()
            # return {'result':body}, 200
            a = cal(body['code'])
            c = pd.Series(a).to_json(orient='values')
            d = c.split("[")[1].split("]")[0]
            return {'result': int(d)}, 200

    api.add_resource(FindResult, '/')

  
    feature_train, feature_test, target_train, target_test = train_test_split(data.features, data.targets)

    model = DecisionTreeClassifier(criterion='entropy', presort=True)

    model.fitted = model.fit(feature_train, target_train)

    model.predictions = model.fitted.predict(feature_test)
    
    
    app.run(port=(disease_id*1000)+148, debug=False)
