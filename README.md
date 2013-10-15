utils to parse auditd logs (specific to execve logging)

example usage for the cat.js demo:

	tail -f /var/log/syslog | node cat.js --in=- --type=EXECVE --argv --syslog
