import { getInput, setFailed, setOutput } from "@actions/core";
import { existsSync, readFileSync } from "fs";
import fetch from "node-fetch";

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

        const body = await response.text();

        setOutput("status", response.status);
        setOutput("body", body);
        console.log(`Action finished with response ${response.status} and body ${body}.`);
    } catch (error) {
        console.error(error);
        setFailed(error.message);
    }
}

main()
    .then(() => console.log("Done."))
    .catch((error) => console.error(error));