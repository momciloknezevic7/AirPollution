class Socket {

    constructor(server) {
        this.io = require('socket.io')(server)

        this.io.on('connection', socket => {
            console.log('Heey connection');
            
            console.log('startModel')

            let particles = ["SO2", "CO", "O3", "PM25", "PM10", "NO2"]

            for (let p of particles) {
                const program = "python3 /home/boris/matf-hackathon/pollution/backend/load_model.py " + p;

                var child = require('child_process').exec(program)
                const exec = require("child_process").execSync;
                var curResult = exec(program);

                socket.emit(p, parseFloat(curResult.toString("utf-8")))
            }
            socket.emit('finish');

        })
    }
}

module.exports = Socket;
