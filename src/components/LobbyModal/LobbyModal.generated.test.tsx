/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-unnecessary-act */
import { render } from "react-dom";
import { fireEvent} from '@testing-library/react'

import { unmountComponentAtNode } from "react-dom";
import { act } from 'react-dom/test-utils';
import { LobbyModal } from "../../../src/components/LobbyModal/LobbyModal";

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

describe('<LobbyModal>', () => {
  it('should render component', () => {
    act(() => {
      render(<LobbyModal  
        players={[{
          id: 'string',
          name: 'string',
          color: '#000000',
          isHost: true
      }, {
        id: 'string2',
        name: 'string2',
        color: '#ffffff',
        isHost: false
    }]}  
        close={() => {}} 
      />, container);
    });
    container.querySelector('.backdrop').dispatchEvent(new MouseEvent("click", { bubbles: true }));
    container.querySelector('.btn').dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(container).toMatchSnapshot();
  })
});

