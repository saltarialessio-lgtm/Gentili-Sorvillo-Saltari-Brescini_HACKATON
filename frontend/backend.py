from flask import Flask,request ,jsonify, render_template
from flask_cors import CORS 
import subprocess
import os
import json

app = Flask(__name__)
CORS(app)
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def save_json_relative(filename: str, data: dict, *subdirs: str):
    dir_path = os.path.join(PROJECT_ROOT, *subdirs)
    os.makedirs(dir_path, exist_ok=True)

    full_path = os.path.join(dir_path, filename)

    with open(full_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    return full_path

@app.route("/")
def index():
    return render_template("index.html")   # la pagina con i bottoni

@app.route("/will")
def will_page():
    return render_template("willPage.html")  # la pagina del testamento

@app.route("/addFund", methods=["POST"])
def add_fund():
    completed = subprocess.run(
        "npx hardhat run scripts/fundme.js --network bcPadre",
        shell=True,
        cwd=PROJECT_ROOT,
        capture_output=True,
        text=True,
        encoding='utf-8',
    )

    result = {
        "returncode": completed.returncode,
        "stdout": completed.stdout,
        "stderr": completed.stderr,
    }

    print(result)

    return jsonify(result)

@app.route("/kill", methods=["POST"])
def kill():
    completed = subprocess.run(
        "npx hardhat run scripts/killSignal.js --network bcPadre",
        shell=True,
        cwd=PROJECT_ROOT,
        capture_output=True,
        text=True,
        encoding='utf-8',
    )

    result = {
        "returncode": completed.returncode,
        "stdout": completed.stdout,
        "stderr": completed.stderr,
    }

    print(result)

    return jsonify(result)

@app.route("/checkWallet", methods=["POST"])
def check_wallet():
    completed = subprocess.run(
        "npx hardhat run scripts/checkWallet.js --network bcPadre",
        shell=True,
        cwd=PROJECT_ROOT,
        capture_output=True,
        text=True,
        encoding='utf-8',
    )

    result = {
        "returncode": completed.returncode,
        "stdout": completed.stdout,
        "stderr": completed.stderr,
    }

    print(result)

    return jsonify(result)

@app.route("/deployWill", methods=["POST"])
def deployWill():
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 400

    data = request.get_json()
    path = save_json_relative("testamento.json", data, "testamenti")

    if (path == None):
        return jsonify({"error": "Content-Type must be application/json"}), 400
    
    completedDeploy = subprocess.run(
        "npx hardhat run scripts/deploy.js --network bcPadre",
        shell=True,
        cwd=PROJECT_ROOT,
        capture_output=True,
        text=True,
        encoding='utf-8',
    )

    completedSaveHash = subprocess.run(
        "npx hardhat run scripts/saveHash.js --network bcPadre",
        shell=True,
        cwd=PROJECT_ROOT,
        capture_output=True,
        text=True,
        encoding='utf-8',
    )

    result = {
        "stdout": completedDeploy.stdout + completedSaveHash.stdout,
        "stderr": completedDeploy.stderr + completedSaveHash.stderr,
    }

    return jsonify(result) 
    



if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
