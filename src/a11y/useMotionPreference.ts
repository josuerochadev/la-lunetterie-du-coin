import { useContext } from 'react';

import { MotionContext } from './MotionContext';

export const useMotionPreference = () => useContext(MotionContext);
