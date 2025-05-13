import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import nextRouterMock from 'next-router-mock';

// Mock Next.js Router globally
jest.mock('next/router', () => require('next-router-mock'));

// Set up a global router before each test
beforeEach(() => {
  nextRouterMock.useRouter = jest.fn(() => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  }));
});

global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({}),
    })
  );
  