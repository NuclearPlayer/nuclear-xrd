import { render } from '@testing-library/react';

import App from './App';

describe('App', () => {
  it('should render snapshot', () => {
    const component = render(<App />);
    expect(component.asFragment()).toMatchSnapshot();
  });
});
