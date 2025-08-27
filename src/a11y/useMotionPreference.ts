import { useContext } from 'react';

import { MotionCtx } from './MotionContext';

export const useMotionPreference = () => useContext(MotionCtx);
