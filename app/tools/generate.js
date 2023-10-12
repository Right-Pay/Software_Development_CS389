const {generateTemplateFiles} = require('generate-template-files');

generateTemplateFiles([
  {
    option: 'Create a new component',
    defaultCase: '(pascalCase)',
    entry: {
      folderPath: './tools/templates/component',
    },
    stringReplacers: [
      {
        question: 'What screen / folder name is this component for?',
        slot: '__screen__',
      },
      {
        question: 'What is the name of this component?',
        slot: '__name__',
      },
    ],
    dynamicReplacers: [
      {
        slot: '__src__',
        slotValue: '',
      },
      {
        slot: '/* eslint-disable @typescript-eslint/no-unused-vars */',
        slotValue: '',
      },
      {
        slot: '/* eslint-disable prettier/prettier */',
        slotValue: '',
      },
      {slot: '/*', slotValue: ''},
      {slot: '*/', slotValue: ''},
    ],
    output: {
      path: './src/Components/Screens/__screen__(pascalCase)',
      pathAndFileNameDefaultCase: '(pascalCase)',
    },
    onComplete: results => {
      console.log('results', results);
    },
  },
  {
    option: 'Create a new screen',
    entry: {
      folderPath: './tools/templates/screen',
    },
    stringReplacers: [
      {
        question: 'What is the name of this screen?',
        slot: '__screen__',
      },
      {
        question: 'What is the name of the stack for this screen?',
        slot: '__stack__',
      },
      {
        question:
          'What is the name of the component for this screen? \n (If there is no component, leave blank and delete later)',
        slot: '__component__',
      },
    ],
    defaultCase: '(pascalCase)',
    dynamicReplacers: [
      {
        slot: '__src__',
        slotValue: '',
      },
      {
        slot: '/* eslint-disable @typescript-eslint/no-unused-vars */',
        slotValue: '',
      },
      {
        slot: '/* eslint-disable prettier/prettier */',
        slotValue: '',
      },
      {slot: '/*', slotValue: ''},
      {slot: '*/', slotValue: ''},
    ],
    output: {
      path: './src/Components/Screens/__stack__(pascalCase)',
      pathAndFileNameDefaultCase: '(pascalCase)',
    },
    onComplete: results => {
      console.log('results', results);
    },
  },
]);
