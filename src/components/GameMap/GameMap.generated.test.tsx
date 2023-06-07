import React from 'react';

import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import { GameMap } from '../../../src/components/GameMap/GameMap';

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

describe('<GameMap>', () => {
  it('should render component', () => {
    act(() => {
      render(<GameMap
        mapData={{
          w: 45,
          h: 90,
          planetArray: [{
            coords: { x: 30, y: 50 },
            fleet: 1,
            fleetGenSpeed: 1,
            id: 2,
            owner: null,
            radius: 5,
          }, {
            coords: { x: 60, y: 80 },
            fleet: 2,
            fleetGenSpeed: 3,
            id: 2,
            owner: null,
            radius: 5,
          }],
        }}
        gameId="game1"
      />, container);
    });

    container.querySelector('.canvas').dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 30, clientY: 50 }));
    expect(container).toMatchSnapshot();
  });
});
