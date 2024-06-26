#!/usr/bin/env node
import chalk from 'chalk';
import { program } from 'commander';
import inquirer from 'inquirer';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface TemplateLibrary {
  library: string[];
}

interface ProjectTemplates {
  [key: string]: {
    [templateName: string]: TemplateLibrary;
  };
}

const projectTemplates: ProjectTemplates = {
  web: {
    nextjs: {
      library: ['axios', 'react-query', 'shadcn', 'zustand', 'prisma'],
    },
    remix: {
      library: ['axios', 'react-query'],
    },
    payload: {
      library: ['tailwind'],
    },
  },
  mobile: {
    'react-native': {
      library: ['axios', 'react-query'],
    },
    expo: {
      library: ['expo-camera', 'expo-permission'],
    },
  },
};

interface ProjectOptions {
  projectType: 'web' | 'mobile';
  projectName: string;
}

async function promptForOptions(): Promise<ProjectOptions> {
  const questions = [
    {
      type: 'list',
      name: 'projectType',
      message: 'What type of project would you like to create?',
      choices: [
        { name: 'Web Application', value: 'web' },
        { name: 'Mobile Application', value: 'mobile' },
      ],
    },
    {
      type: 'input',
      name: 'projectName',
      message: 'Enter the name of the project:',
      validate: (input: string) =>
        /^[a-zA-Z0-9_-]+$/.test(input) ||
        'Project name may only include letters, numbers, underscores, and hyphens',
    },
  ];

  const answers = await inquirer.prompt(questions);
  return answers as ProjectOptions;
}

async function promptForTemplate(options: ProjectOptions): Promise<string> {
  const templateChoices = Object.keys(
    projectTemplates[options.projectType],
  ).map((key) => ({
    name: key,
    value: key,
  }));

  const templateQuestion = [
    {
      type: 'list',
      name: 'template',
      message: 'Which template would you like to use?',
      choices: templateChoices,
    },
  ];

  const templateAnswer = await inquirer.prompt(templateQuestion);
  return templateAnswer.template;
}

async function promptForLibraries(
  options: ProjectOptions,
  selectedTemplate: string,
): Promise<string[]> {
  const libraries =
    projectTemplates[options.projectType][selectedTemplate].library;
  const libraryQuestion = [
    {
      type: 'checkbox',
      name: 'selectedLibraries',
      message: 'Which libraries would you like to install?',
      choices: libraries.map((lib) => ({ name: lib, value: lib })),
    },
  ];

  const libraryAnswers = await inquirer.prompt(libraryQuestion);
  return libraryAnswers.selectedLibraries;
}

program
  .command('info')
  .description('description')
  .action(async () => {
    console.log(
      `
___________________________________________
         
         Wellcome to ${chalk.bold.blue('Mavolo Studio')}
           ${chalk.italic('www.mavolostudio.com')}
___________________________________________

    `,
    );
  });

program
  .command('create')
  .description('Create a new project')
  .action(async () => {
    console.log(
      `
___________________________________________
         
         Wellcome to ${chalk.bold.blue('Mavolo Studio')}
           ${chalk.italic('www.mavolostudio.com')}
___________________________________________

    `,
    );
    const options = await promptForOptions();
    const selectedTemplate = await promptForTemplate(options);
    const selectedLibraries = await promptForLibraries(
      options,
      selectedTemplate,
    );

    console.log(
      `${chalk.blue(`
    Project type selected: ${options.projectType}
    Project name: ${options.projectName}
    Template selected: ${selectedTemplate}
    Libraries selected: ${selectedLibraries.join(', ')}
    `)}`,
    );

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
