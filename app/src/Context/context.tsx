import React from 'react';
import {AppContext} from '../types/AppContextType';

export default React.createContext<AppContext | null>(null);
