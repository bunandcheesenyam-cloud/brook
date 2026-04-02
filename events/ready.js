const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const LoadCommands = require("../util/loadCommands");

/**
 *
 * @param {import("../lib/DiscordMusicBot")} client
 */
module.exports = async (client) => {
	client.manager.init(client.user.id);
	client.user.setPresence(client.config.presence);
	client.log("Successfully Logged in as " + client.user.tag);

	client.log("Auto-deploying slash commands to Discord...");
	try {
		const rest = new REST({ version: "9" }).setToken(client.config.token);
		const commands = await LoadCommands().then((cmds) => {
			return [].concat(cmds.slash).concat(cmds.context);
		});
		await rest.put(Routes.applicationCommands(client.config.clientId), {
			body: commands,
		});
		client.log("Successfully auto-deployed commands globally!");
	} catch (err) {
		client.error("Failed to auto-deploy commands: " + err);
	}
};
