import {getInput, setFailed, setOutput} from "@actions/core";
import { existsSync, readFileSync } from "fs";

/**
 * Main entry point.
 */
async function main(): Promise<void> {
    try {
        const url = getInput("url");
        const file = getInput("file");

        const method = getInput("method");
        const authorization = getInput("authorization");

        // Attempt to resolve the file from the file system.
        if (!existsSync(file)) {
            setFailed(`File not found: ${file}`);
            return;
        }

        // Read the file contents.
        const content = readFileSync(file);
        // Upload the file.
        const response = await fetch(url, {
            method: method.length == 0 ? "POST" : method,
            headers: {
                Authorization: authorization.length == 0 ? undefined : authorization,
                "Content-Type": "application/octet-stream"
            },
            body: content
        });

        setOutput("status", response.status.toString());
        setOutput("body", await response.text());
    } catch (error) {
        console.error(error);
        setFailed(error.message);
    }
}

main()
    .then(() => console.log("Done."))
    .catch((error) => console.error(error));