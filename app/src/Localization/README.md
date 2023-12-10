# How to use the Localization Folder

## Adding a new language
* Create a new folder in the Localization folder with the two letter abbreveation of the language you want to add. 
* Create a file called common.json in the new folder. This file will contain all the common translations for the language.
* Copy and paste from the en/common.json file into the new file.
* For all of the key/value pairs, change the values so they are in the new language. DO NOT CHANGE THE KEYS
* Import this file into i18n.ts and add it to the resources const.
* In the types folder open up the LanguageContextType.ts file and add the new language to the SupportedLanguages and SupportedLanguagesEnum.
* If you would like to be able to switch to this language, create a new checkbox in the GeneralSettings file.