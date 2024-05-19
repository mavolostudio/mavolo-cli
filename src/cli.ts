#!/usr/bin/env node
import { program } from "commander";
import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const projectTemplates: any = {
  web: [
    {
      nextjs: {
        library: ["axios", "react-query", "shadcn", "zustand", "prisma"],
      },
      remix: {
        library: ["axios", "react-query"],
      },
      payload: {
        library: ["tailwind"],
      },
    },
  ],
  mobile: [
    {
      "react-native": {
        library: ["axios", "react-query"],
      },
      expo: {
        library: ["expo-camera", "expo-permission"],
      },
    },
  ],
};

async function promptForOptions() {
  const questions = [
    {
      type: "list",
      name: "projectType",
      message: "What type of project would you like to create?",
      choices: [
        { name: "Web Application", value: "web" },
        { name: "Mobile Application", value: "mobile" },
      ],
    },
    {
      type: "input",
      name: "projectName",
      message: "Enter the name of the project:",
      validate: (input: any) =>
        /^[a-zA-Z0-9_-]+$/.test(input) ||
        "Project name may only include letters, numbers, underscores, and hyphens",
    },
  ];

  const answers = await inquirer.prompt(questions);
  return answers;
}

async function promptForTemplate(options: any) {
  const templateChoices =
    options.projectType === "web"
      ? Object.keys(projectTemplates.web[0]).map((key) => ({
          name: key,
          value: key,
        }))
      : Object.keys(projectTemplates.mobile[0]).map((key) => ({
          name: key,
          value: key,
        }));

  const templateQuestion = [
    {
      type: "list",
      name: "template",
      message: "Which template would you like to use?",
      choices: templateChoices,
    },
  ];

  const templateAnswer = await inquirer.prompt(templateQuestion);
  return templateAnswer.template;
}

async function promptForLibraries(options: any, selectedTemplate: any) {
  const libraries =
    projectTemplates[options.projectType][0][selectedTemplate].library;
  const libraryQuestion = [
    {
      type: "checkbox",
      name: "selectedLibraries",
      message: "Which libraries would you like to install?",
      choices: libraries.map((lib: any) => ({ name: lib, value: lib })),
    },
  ];

  const libraryAnswers = await inquirer.prompt(libraryQuestion);
  return libraryAnswers.selectedLibraries;
}

program
  .command("create")
  .description("Create a new project")
  .action(async () => {
    const options = await promptForOptions();
    const selectedTemplate = await promptForTemplate(options);
    const selectedLibraries = await promptForLibraries(
      options,
      selectedTemplate
    );

    console.log(`Project type selected: ${options.projectType}`);
    console.log(`Project name: ${options.projectName}`);
    console.log(`Template selected: ${selectedTemplate}`);
    console.log(`Libraries selected: ${selectedLibraries.join(", ")}`);

    // Additional logic to create the project folder and copy files can be added here
    // Uncomment the lines below to implement copying from a template directory
    /*
    const templatePath = path.join(__dirname, "templates", options.projectType, selectedTemplate);
    const targetPath = path.join(process.cwd(), options.projectName);

    fs.copy(templatePath, targetPath, (err) => {
      if (err) {
        console.error("Error creating project:", err);
        process.exit(1);
      }
      console.log(`Project initialized successfully in: ${targetPath}`);
    });
    */
  });

program.parse(process.argv);
