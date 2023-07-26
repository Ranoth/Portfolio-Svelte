import { exec, ExecException } from "child_process";
import gulp from "gulp";

const runCmdAndSubscribeToOutStream = (command: string) => {
	return new Promise((resolve: any, reject) => {
		const child = exec(
			command,
			(error: ExecException | null, stdout: string, stderr: string) => {
				if (error) {
					reject(error);
				} else {
					resolve();
				}
			}
		);
		child.stdout?.pipe(process.stdout);
		child.stderr?.pipe(process.stderr);
	});
};

gulp.task("run_restart_error", function () {
	return runCmdAndSubscribeToOutStream("npm run dev").catch(() => {
		console.log("Restarting gulp task 'run_restart_error'...");
		return runCmdAndSubscribeToOutStream("gulp run_restart_error");
	});
});
