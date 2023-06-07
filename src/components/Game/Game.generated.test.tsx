import React from 'react';

import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Game } from '../../../src/components/Game/Game';

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

describe('<Game>', () => {
  it('should render component', () => {
    act(() => {
      render(<Game
        gameId={'/* string */'}
        players={[{
          name: 'name1', isHost: false, id: '1', color: '#ffffff',
        },
        {
          name: 'name2', isHost: true, id: '2', color: '#000000',
        },
        {
          name: 'name3', isHost: false, id: '3', color: '#fff000',
        }]}
        gameFinished={() => {}}
      />, container);
    });
    container.querySelector('#lobby').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    container.querySelector('#start-game').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(container).toMatchSnapshot();
  });
});
