import { describe, it, expect } from 'vitest';

import { SPRING_CONFIG, SPRING_CONFIG_SLOW, SPRING_TRANSITION } from '@/lib/motion';

describe('motion constants', () => {
  describe('SPRING_CONFIG', () => {
    it('has stiffness of 80', () => {
      expect(SPRING_CONFIG.stiffness).toBe(80);
    });

    it('has damping of 30', () => {
      expect(SPRING_CONFIG.damping).toBe(30);
    });

    it('has mass of 0.5', () => {
      expect(SPRING_CONFIG.mass).toBe(0.5);
    });
  });

  describe('SPRING_CONFIG_SLOW', () => {
    it('has stiffness of 60', () => {
      expect(SPRING_CONFIG_SLOW.stiffness).toBe(60);
    });

    it('has damping of 30', () => {
      expect(SPRING_CONFIG_SLOW.damping).toBe(30);
    });

    it('has mass of 0.5', () => {
      expect(SPRING_CONFIG_SLOW.mass).toBe(0.5);
    });
  });

  describe('SPRING_TRANSITION', () => {
    it('has type set to "spring"', () => {
      expect(SPRING_TRANSITION.type).toBe('spring');
    });

    it('includes all SPRING_CONFIG values', () => {
      expect(SPRING_TRANSITION.stiffness).toBe(SPRING_CONFIG.stiffness);
      expect(SPRING_TRANSITION.damping).toBe(SPRING_CONFIG.damping);
      expect(SPRING_TRANSITION.mass).toBe(SPRING_CONFIG.mass);
    });

    it('spreads SPRING_CONFIG properties', () => {
      expect(SPRING_TRANSITION).toEqual({
        type: 'spring',
        ...SPRING_CONFIG,
      });
    });
  });
});
