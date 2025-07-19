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

import React from 'react';
import { render, screen } from '@testing-library/react';

// Provide required environment variables for the app during tests.
process.env.REACT_APP_GEMINI_API_KEY = 'test-key';

// Mock modules that use ESM syntax incompatible with Jest's default config.
jest.mock('react-syntax-highlighter', () => () => null);
jest.mock('react-syntax-highlighter/dist/esm/styles/hljs', () => ({}));
jest.mock('./components/altair/Altair', () => ({ Altair: () => <div /> }));

const App = require('./App').default;

test('renders console heading', () => {
  render(<App />);
  const heading = screen.getByText(/Console/i);
  expect(heading).toBeInTheDocument();
});
