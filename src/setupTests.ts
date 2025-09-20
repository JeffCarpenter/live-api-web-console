/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

const originalGeminiKey = process.env.REACT_APP_GEMINI_API_KEY;
process.env.REACT_APP_GEMINI_API_KEY = 'test-key';
const mediaElementPlayDescriptor = Object.getOwnPropertyDescriptor(
  HTMLMediaElement.prototype,
  'play',
);
const suppressedConsoleErrors = [/ReactDOMTestUtils\.act/];
const originalConsoleError = console.error;
const consoleErrorMock = jest
  .spyOn(console, 'error')
  .mockImplementation((...args: Parameters<typeof console.error>) => {
    const [message] = args;
    if (
      typeof message === 'string' &&
      suppressedConsoleErrors.some((pattern) => pattern.test(message))
    ) {
      return;
    }
    originalConsoleError(...args);
  });

beforeAll(() => {
  Object.defineProperty(HTMLMediaElement.prototype, 'play', {
    configurable: true,
    writable: true,
    value: jest.fn().mockResolvedValue(undefined),
  });
});

// Mock modules that use ESM syntax incompatible with Jest's default config.
jest.mock('react-syntax-highlighter', () => () => null);
jest.mock('react-syntax-highlighter/dist/esm/styles/hljs', () => ({}));
jest.mock('./components/altair/Altair', () => ({ Altair: () => null }));

afterEach(() => {
  jest.clearAllMocks();
  process.env.REACT_APP_GEMINI_API_KEY = 'test-key';
});

afterAll(() => {
  if (originalGeminiKey === undefined) {
    delete process.env.REACT_APP_GEMINI_API_KEY;
  } else {
    process.env.REACT_APP_GEMINI_API_KEY = originalGeminiKey;
  }

  if (mediaElementPlayDescriptor) {
    Object.defineProperty(
      HTMLMediaElement.prototype,
      'play',
      mediaElementPlayDescriptor,
    );
  } else {
    delete (HTMLMediaElement.prototype as { play?: unknown }).play;
  }

  consoleErrorMock.mockRestore();
});
