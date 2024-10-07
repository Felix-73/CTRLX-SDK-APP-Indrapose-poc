from flask import Flask, request, jsonify

import os
from werkzeug.serving import run_simple
from werkzeug.middleware.proxy_fix import ProxyFix


##settings 

dir_path = os.path.dirname(os.path.realpath(__file__))
print(dir_path)
app = Flask(__name__, static_url_path='')

app.wsgi_app = ProxyFix(
    app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
)

os.chdir(dir_path)



########## serving functions

@app.route('/sample-flask/')
def index():
    return app.send_static_file('sample-flask/index.html')

@app.route('/sample-flask/receive-json', methods=['POST'])
def receive_json():
    data = request.get_json()
    if data is None:
        return jsonify({"error": "Invalid JSON"}), 400
    
    print("Received JSON:", data)
    gcode_lines = jsontogcode(data)
    # print("Received gcode:", gcode_lines)

    file_path = "/var/snap/rexroth-solutions/common/solutions/activeConfiguration/scripts/gcode/g-code-from-ui.txt"
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, 'w') as file:
        file.write("\n".join(gcode_lines))

    return jsonify({"message": "G-code generated successfully", "gcode": "\n".join(gcode_lines)})



def jsontogcode(json):
    gcode = []

    # HEADER 
    gcode.append(f"WAIT\nSLEEP(1)\n")
    gcode.append(f"Switch=DL.plc.app.Application.sym.GVL_UI_PLC.stOutputData.iSwitch\n")
    case = 0
    for command in json :
        case = case + 1
        gcode.append(f"IF Switch == {case} THEN\nGOTO Step{case}\nENDIF\n")

    # COMMANDS
    step = 0
    for command in json :
        cmd_name = command['command']
        params = command['params']
        step = step + 1
        gcode.append(f"DL.plc.app.Application.sym.GVL_UI_PLC.stInputData.iActMvt = {step}")

        if cmd_name == 'MoveAbsPoint':
            gcode.append(f"Step{step}:")
            gcode.append(f"G01 X{params['PosX']} Y{params['PosY']} Z{params['PosZ']} F{params['Speed']}")
            gcode.append(f"WAIT\n")

    gcode.append(f"DL.plc.app.Application.sym.GVL_UI_PLC.stInputData.iActMvt = 0")

    return gcode



if __name__ == '__main__':
  

    if "SNAP_DATA" in os.environ:
        run_simple('unix://'+os.environ['SNAP_DATA']+'/package-run/sample-flask-webapp/example.sock', 0, app)
        #app.run(host='0.0.0.0',debug = False, port=3125)
    else:

        app.run(host='0.0.0.0',debug = False, port=12121)

