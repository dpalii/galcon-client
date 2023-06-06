/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-unnecessary-act */
import { render } from "react-dom";

import { unmountComponentAtNode } from "react-dom";
import { act } from 'react-dom/test-utils';
import App from './App';

let container: any = null;

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe('<ConnectModal>', () => {
  it('should render component', () => {
    act(() => {
      render(<App />, container);
    });
    
    expect(container).toMatchSnapshot();
  })
});

