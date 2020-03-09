import chalk from "chalk";
import { prompt } from "inquirer";
import { logProgress, logSuccess, logError } from "../utils";
import terminalLink from "terminal-link";
import axios from "axios";

async function newsletterPrompt(condition: boolean) {
    const { email }: { email: string } =
        condition &&
        (await prompt([
            {
                name: "email",
                message: `You will ♥ create-wp-react-app and wp-react-starter! Would you like to be informed about updates via e-mail (you agree ${terminalLink(
                    "devowl.io privacy policy",
                    "https://devowl.io/privacy-policy/"
                )})? Enter your e-mail:`,
                type: "input",
                validate: (value: string) =>
                    // eslint-disable-next-line no-useless-escape
                    !value ||
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                        value
                    )
                        ? true
                        : "This is not an valid email."
            }
        ]));

    if (email) {
        logProgress("Registering on newsletter...");
        try {
            await axios.post("https://devowl.io/wp-json/devowl-site/v1/plugin-activation-newsletter", {
                email,
                referer: "localhost",
                slug: "create-wp-react-app"
            });
            logSuccess(`Successfully registered ${chalk.underline(email)}!`);
        } catch (e) {
            logError(`Error while newsletter registration, skipping (${e})...`);
        }
    }
}

export { newsletterPrompt };
