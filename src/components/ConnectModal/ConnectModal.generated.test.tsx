import React from 'react';
import { fireEvent } from '@testing-library/react';
import { render, unmountComponentAtNode } from 'react-dom';

import { act } from 'react-dom/test-utils';
import { ConnectModal } from '../../../src/components/ConnectModal/ConnectModal';

let container: any = null;

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
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
      render(<ConnectModal
        onConnect={(gameId: string) => {}}
        onClose={() => {}}
      />, container);
    });
    container.querySelector('.btn').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    container.querySelector('#submit').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fireEvent.change(container.querySelector('input'), { target: { value: '738gf87f...' } });
    expect(container).toMatchSnapshot();
  });
});
