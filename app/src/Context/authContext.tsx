import React from 'react';
import {AuthContextType} from '../types/AuthContextType';

export default React.createContext<AuthContextType | null>(null);
