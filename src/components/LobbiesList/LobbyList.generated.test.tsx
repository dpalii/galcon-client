import React from 'react';

import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { LobbyList } from '../../../src/components/LobbiesList/LobbyList';

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

describe('<LobbyList>', () => {
  it('should render component', () => {
    act(() => {
      render(<LobbyList
        joinLobby={(gameId: string) => {}}
        close={() => {}}
      />, container);
    });
    container.querySelector('.backdrop').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    container.querySelector('.btn').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(container).toMatchSnapshot();
  });
});
