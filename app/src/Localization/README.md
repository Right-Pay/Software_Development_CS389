# How to use the Localization Folder

## Adding a new language
* Create a new folder in the Localization folder with the two letter abbreveation of the language you want to add. 
* Create a file called common.json in the new folder. This file will contain all the common translations for the language.
* Copy and paste from the en/common.json file into the new file.
* For all of the key/value pairs, change the values so they are in the new language. DO NOT CHANGE THE KEYS
* Import this file into i18n.ts and add it to the resources const.
* In the types folder open up the LanguageContextType.ts file and add the new language to the SupportedLanguages and SupportedLanguagesEnum.
* If you would like to be able to switch to this language, create a new checkbox in the GeneralSettings file.


## Using the translations
* Anywhere that you would be typing normal text, instead use the following.
* import { LanguageContextType } from '../types/LanguageContextType';
* import LanguageContext from '../Context/languageContext';
* Const { translate } = React.useContext(LanguageContext) as LanguageContextType;
* translate(namespace, key);
  * namespace is a value like "common" or "wallet"
  * If the key does not exist you will have to add that translation in all the common.json files