const { Select } = require("enquirer");
const fs = require("fs");
const colors = require("ansi-colors");
const { readConfig, getConfig } = require("./config");
const { isFile, rootDir, srcPath, reactPath } = require("./utils");


const submitReset = () => {
  try {
    const checkConfig = getConfig();
    if (!checkConfig.length) {
      return console.log(
        colors.red(
          "There is no config file in react root directory! Use " +
            colors.blue("react-reset config")
        )
      );
    }

    const config = JSON.parse(readConfig());

    const srcDir = fs.readdirSync(".").filter((dir) => dir === srcPath);
    if (srcDir.length === 0) {
      console.error("Source directory not found!");
      return;
    }

    const readSrc = fs.readdirSync(srcDir[0]);
    const targets = readSrc.filter((file) => !config.ignore.includes(file));

    console.log(colors.blue("========================="));

    // Remove files and directories
    targets.forEach((file) => {
      const fullPath = `${srcPath}\\${file}`;
      if (fs.existsSync(fullPath)) {
        try {
          if (isFile(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log(`${colors.blue(file)} ${colors.green("removed.")}`);
          } else {
            fs.rmSync(fullPath, { recursive: true });
            console.log(`${colors.blue(file)} ${colors.green("removed.")}`);
          }
        } catch (error) {
          console.error(`Failed to remove ${file}\n${error}`);
        }
      }
    });

    console.log(colors.blue("========================="));

    // Copy files from react directory
    const reactFiles = fs.readdirSync(`${rootDir()}\\${reactPath}`, {});
    reactFiles.forEach((file) => {
      if (config.ignore.includes(file)) {
        console.log(`${colors.yellow(file)} ${colors.red("skipped (ignored).")}`);
        return;
      }

      try {
        const fileData = fs.readFileSync(`./react/${file}`);
        fs.writeFileSync(`${srcPath}\\${file}`, fileData);
        console.log(`${colors.blue(file)} ${colors.green("written!")}`);
      } catch (error) {
        console.error(`Error processing file ${file}\n${error}`);
      }
    });
    console.log(colors.blue("========================="));
  } catch (error) {
    console.error("Error processing files in directory!\n", error);
  }
};

const resetApp = () => {
  const confirm = new Select({
    prefix: "react reset:",
    message: "Are you sure about resetting your react app?",
    choices: [
      { name: "yes", message: "Yes", value: true },
      { name: "no", message: "No", value: false },
    ],
    onCancel: () =>
      console.error("You cancelled the resetting operation!")
  });
  confirm.run()
  .then((result) => result === "yes" && submitReset());
};

module.exports = resetApp;
