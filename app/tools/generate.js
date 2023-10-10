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
        question: 'What screen is this component for?',
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
    stringReplacers: ['__name__'],
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
      path: './src/Components/Screens/__name__(pascalCase)',
      pathAndFileNameDefaultCase: '(pascalCase)',
    },
    onComplete: results => {
      console.log('results', results);
    },
  },
]);
