// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const child_process = require("child_process");

/**
 * As we can not generate a dynamic cypress.js we do this through a plugin.
 *
 * @see https://docs.cypress.io/guides/tooling/plugins-guide.html#Configuration
 * @see https://docs.cypress.io/api/plugins/configuration-api.html#Usage
 */
function applyConfig(config) {
    const isCI = process.env.CI;
    const wpContainer = JSON.parse(
        child_process
            .execSync("docker container inspect $(yarn --silent root:run docker-compose:name-wordpress)")
            .toString()
    )[0];

    config.screenshotsFolder = "test/cypress/screenshots";
    config.videosFolder = "test/cypress/videos";
    config.supportFile = "test/cypress/support/index.js";
    config.fixturesFolder = "test/cypress/fixtures";

    // The both configs can not be altered through this plugin because they are needed at CLI startup
    // config.integrationFolder;
    // config.pluginsFile;

    if (isCI) {
        // CI relevant options
        config.baseUrl = "http://wordpress";
    } else {
        // Local development
        const definedPort = wpContainer.HostConfig.PortBindings["80/tcp"][0].HostPort;
        config.baseUrl = "http://localhost:" + definedPort;
    }
}

module.exports = (on, config) => {
    applyConfig(config);

    // `on` is used to hook into various events Cypress emits
    // `config` is the resolved Cypress config

    return config;
};
