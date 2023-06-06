/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-unnecessary-act */
import { render } from "react-dom";
import { fireEvent} from '@testing-library/react'

import { SummaryModal } from '../../../src/components/SummaryModal/SummaryModal';

import { unmountComponentAtNode } from "react-dom";
import { act } from 'react-dom/test-utils';

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

describe('<SummaryModal>', () => {
  it('should render component', () => {
    act(() => {
      render(<SummaryModal  
        winner={{name:'winner', color: '#000000', id: '2', isHost: true}}  
        close={ () => {} } />, container);
    });
    container.querySelector('.backdrop').dispatchEvent(new MouseEvent("click", { bubbles: true }));
    container.querySelector('.btn').dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(container).toMatchSnapshot();
  })
});