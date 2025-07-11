document.addEventListener('DOMContentLoaded', () => {
    const buttonContainer = document.getElementById('button-container');
    const generateJsonButton = document.getElementById('generate-json');
    const selectedConfigsContainer = document.getElementById('selected-configs');
    const clearAllButton = document.getElementById('clear-all');

    class Instruction {
        constructor(commands) {
            this.commands = commands;
            this.buttonConfigs = [];
        }

        init() {
            this.commands.forEach((command) => {
                const button = this.createButton(command);
                button.classList.add(command.colorClass);
                buttonContainer.appendChild(button);
            });

            generateJsonButton.addEventListener('click', () => this.generateJson());
            clearAllButton.addEventListener('click', () => this.clearAllConfigs());
        }


        createButton(command) {
            const button = document.createElement('button');
            button.textContent = command.name;
            button.addEventListener('click', () => this.handleButtonClick(command));
            return button;
        }

        handleButtonClick(command) {
            const config = { command: command.name, params: {} };
            command.params.forEach(param => {
                const value = prompt(`Veuillez indiquer la valeur de ${param}:`);
                config.params[param] = value;
            });
            this.addConfig(config);
        }

        addConfig(config) {
            this.buttonConfigs.push(config);
            this.updateSelectedConfigs();
        }

        updateSelectedConfigs() {
            selectedConfigsContainer.innerHTML = ''; // Clear previous content
            this.buttonConfigs.forEach((config, index) => {
                const configElement = document.createElement('div');
                configElement.className = 'config-block';

                const commandName = document.createElement('h4');
                commandName.textContent = `Command: ${config.command}`;
                configElement.appendChild(commandName);

                const paramsList = document.createElement('ul');
                for (const [param, value] of Object.entries(config.params)) {
                    const paramItem = document.createElement('li');
                    paramItem.textContent = `${param}: ${value}`;
                    paramsList.appendChild(paramItem);
                }
                configElement.appendChild(paramsList);

                // Add Edit and Delete buttons
                const editButton = document.createElement('button');
                editButton.textContent = 'Modifier';
                editButton.classList.add('button-yellow');
                editButton.addEventListener('click', () => this.editConfig(index));
                configElement.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Supprimer';
                deleteButton.classList.add('button-red');
                deleteButton.addEventListener('click', () => this.deleteConfig(index));
                configElement.appendChild(deleteButton);

                selectedConfigsContainer.appendChild(configElement);
            });
        }

        editConfig(index) {
            const config = this.buttonConfigs[index];
            config.params = {}; // Reset params
            this.commands.forEach(command => {
                if (command.name === config.command) {
                    command.params.forEach(param => {
                        const value = prompt(` ${param}:`);
                        config.params[param] = value;
                    });
                }
            });
            this.updateSelectedConfigs();
        }

        deleteConfig(index) {
            this.buttonConfigs.splice(index, 1);
            this.updateSelectedConfigs();
        }

        clearAllConfigs() {
            this.buttonConfigs = [];
            this.updateSelectedConfigs();
        }

        generateJson() {
            const jsonOutput = JSON.stringify(this.buttonConfigs, null, 2);
            const backendUrl = '/sample-flask/receive-json';

            fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jsonOutput
            })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        console.error("Error:", data.error);
                        alert("Error: " + data.error);
                    } else {
                        console.log("Success:", data.message);
                        console.log("G-code:", data.gcode);
                        // Display the G-code in the front-end
                        const gcodeElement = document.getElementById('gcode-output');
                        gcodeElement.textContent = data.gcode;
                    }
                })
                .catch(error => {
                    console.error("Fetch error:", error);
                    alert("An error occurred while sending the request.");
                });
        }
    }

    // const commands = [
    //     { name: 'SetVel', params: ['Velocity'], colorClass: 'button-green' },
    //     { name: 'SetAccel', params: ['Accel'], colorClass: 'button-green' },
    //     { name: 'SetDecel', params: ['Decel'], colorClass: 'button-green' },
    //     { name: 'IncrVar', params: ['VarName'], colorClass: 'button-green' },
    //     { name: 'DecrVar', params: ['VarName'], colorClass: 'button-green' },
    //     { name: 'SetVar', params: ['VarName', 'Value'], colorClass: 'button-green' },
    //     { name: 'MoveAbsPoint', params: ['PointName'], colorClass: 'button-blue' },
    //     { name: 'MoveAxePoint', params: ['PointName', 'AxeName'], colorClass: 'button-blue' },
    //     { name: 'MoveRelPoint', params: ['PointName'], colorClass: 'button-blue' },
    //     { name: 'MoveVia', params: ['PointName'], colorClass: 'button-blue' },
    //     { name: 'MoveUntil', params: ['PointName', 'InputName', 'True/False'], colorClass: 'button-blue' },
    //     { name: 'MoveAxeUntil', params: ['PointName', 'InputName', 'True/False'], colorClass: 'button-blue' },
    //     { name: 'MoveCircular', params: ['PointName', 'PointName'], colorClass: 'button-blue' },
    //     { name: 'MoveCircularVia', params: ['angle', 'PointName'], colorClass: 'button-blue' },
    //     { name: 'Label', params: ['text'], colorClass: 'button-purple' },
    //     { name: 'Jump', params: ['text'], colorClass: 'button-purple' },
    //     { name: 'JumpVarEQ', params: ['VarName', 'Value', 'Label'], colorClass: 'button-purple' },
    //     { name: 'JumpVarLT', params: ['VarName', 'Value', 'Label'], colorClass: 'button-purple' },
    //     { name: 'JumpVarGT', params: ['VarName', 'Value', 'Label'], colorClass: 'button-purple' },
    //     { name: 'JumpInput', params: ['InputName', 'True/False', 'Label'], colorClass: 'button-purple' },
    //     { name: 'WaitTime', params: ['Temps (ms)'], colorClass: 'button-purple' },
    //     { name: 'WaitInput', params: ['InputName'], colorClass: 'button-purple' },
    //     { name: 'SetOutput', params: ['OutputName'], colorClass: 'button-purple' },
    //     { name: 'ResetOutput', params: ['OutputName'], colorClass: 'button-purple' },
    //     { name: 'End', params: [], colorClass: 'button-purple' }
    // ];

    const commands = [
        { name: 'MoveAbsPoint', params: ['PosX', 'PosY', 'PosZ', 'Speed'], colorClass: 'button-blue' },
        { name: 'SetVel', params: ['Velocity'], colorClass: 'button-green' },
        { name: 'SetAccel', params: ['Accel'], colorClass: 'button-green' },
        { name: 'SetDecel', params: ['Decel'], colorClass: 'button-green' },
        { name: 'IncrVar', params: ['VarName'], colorClass: 'button-green' },
        { name: 'DecrVar', params: ['VarName'], colorClass: 'button-green' },
        { name: 'SetVar', params: ['VarName', 'Value'], colorClass: 'button-green' },
        { name: 'MoveAxePoint', params: ['PointName', 'AxeName'], colorClass: 'button-blue' },
        { name: 'MoveRelPoint', params: ['PointName'], colorClass: 'button-blue' },
        { name: 'MoveVia', params: ['PointName'], colorClass: 'button-blue' },
        { name: 'MoveUntil', params: ['PointName', 'InputName', 'True/False'], colorClass: 'button-blue' },
        { name: 'MoveAxeUntil', params: ['PointName', 'InputName', 'True/False'], colorClass: 'button-blue' },
        { name: 'MoveCircular', params: ['PointName', 'PointName'], colorClass: 'button-blue' },
        { name: 'MoveCircularVia', params: ['angle', 'PointName'], colorClass: 'button-blue' },
        { name: 'Label', params: ['text'], colorClass: 'button-purple' },
        { name: 'Jump', params: ['text'], colorClass: 'button-purple' },
        { name: 'JumpVarEQ', params: ['VarName', 'Value', 'Label'], colorClass: 'button-purple' },
        { name: 'JumpVarLT', params: ['VarName', 'Value', 'Label'], colorClass: 'button-purple' },
        { name: 'JumpVarGT', params: ['VarName', 'Value', 'Label'], colorClass: 'button-purple' },
        { name: 'JumpInput', params: ['InputName', 'True/False', 'Label'], colorClass: 'button-purple' },
        { name: 'WaitTime', params: ['Temps (ms)'], colorClass: 'button-purple' },
        { name: 'WaitInput', params: ['InputName'], colorClass: 'button-purple' },
        { name: 'SetOutput', params: ['OutputName'], colorClass: 'button-purple' },
        { name: 'ResetOutput', params: ['OutputName'], colorClass: 'button-purple' },
        { name: 'End', params: [], colorClass: 'button-purple' }
    ];
    const commandManager = new Instruction(commands);
    commandManager.init();
});

