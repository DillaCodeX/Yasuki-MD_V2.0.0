import "dotenv/config";

import { Config } from "./config.js";

import db from "./Libs/Database.js";
import connectToWhatsApp from "./Sockets/Connect.js";
import Feature from "./Libs/Feature.js";

await db.initialize();
db.saveDataPeriodically();

const sock = await connectToWhatsApp();
await Feature.init(sock);

// TODO : move this to a separate file
// Run cron jobs every 24 hours, resetting the user limit to 15
db.users.cron.schedule(
	"0 0 0 * * *",
	(users) => {
		for (const key in users) {
			const user = users[key];
			user.limit = 15;
		}
	},
	{ timezone: Config.timezone ?? "Asia/Colombo" }
);
