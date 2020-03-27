module.exports = {
	user: "your-linux-user",
	tunnels: [
		{
			"service": "service-name-here",
			"posfix": "-L 8080:remotehost:8080 username@target"
		},
		{
			"service": "xxx",
			"posfix": "xxx"
		}
	]
}
