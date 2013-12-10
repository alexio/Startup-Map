/*
 *Runs instances of crunch_worker.js because it was being killed by "Out of Memory Killer" due toone instance  high ram usage.
 */

var spawn = require('child_process').spawn;

var executor = function executor(cmd){
	console.log("Executing..." + cmd.currentIndex);	

	spawn_exec = spawn(cmd.cmd, [cmd.script, cmd.currentIndex, cmd.interval]);

	spawn_exec.stdout.on('data', function(data){
		console.log('stdout: ' + data);
	});

	spawn_exec.stderr.on('data', function(data){
		console.log('stderr: ' + data);
	});

	spawn_exec.on('close', function(data){
		console.log('close: ' + data);
	});
}

var exec_interval = 0;

for(var i = 0; i < 200000; i+= 10000){
	
	setTimeout(executor, exec_interval, { 
		cmd:'node', 
		script:'crunch_worker.js', 
		currentIndex: i,
		interval: 10000
	});
	exec_interval+=80000;
}
