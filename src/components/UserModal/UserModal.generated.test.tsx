/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-unnecessary-act */
import { render } from "react-dom";
import { fireEvent} from '@testing-library/react'

import { InputUser } from '../../../src/types'

import { UserModal } from '../../../src/components/UserModal/UserModal';

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

describe('UserModal', () => {
  it('should render component', () => {
    act(() => {
      render(<UserModal  
        inputUser={{name: '', color: ''}} 
        createGame={(user: InputUser) => {}} 
        joinByCode={ (user: InputUser) => {}} 
        openLobbyList={(user: InputUser) => {}} />, container);
    });
    
    expect(container).toMatchSnapshot();
  })

  it('empty user', () => {
    act(() => {
      render(<UserModal  
        inputUser={{name: '', color: ''}} 
        createGame={(user: InputUser) => {}} 
        joinByCode={ (user: InputUser) => {}} 
        openLobbyList={(user: InputUser) => {}} />, container);
    });

    container.querySelector('#create-button').dispatchEvent(new MouseEvent("click", { bubbles: true }));
    container.querySelector('#join-button').dispatchEvent(new MouseEvent("click", { bubbles: true }));
    container.querySelector('#open-button').dispatchEvent(new MouseEvent("click", { bubbles: true }));
    
    expect(container).toMatchSnapshot();
  })

  it('events', () => {
    act(() => {
      render(<UserModal  
        inputUser={{name: '', color: ''}} 
        createGame={(user: InputUser) => {}} 
        joinByCode={ (user: InputUser) => {}} 
        openLobbyList={(user: InputUser) => {}} />, container);
    });

    container.querySelector(["[id='create-button']"]).dispatchEvent(new MouseEvent("click", { bubbles: true }));
    fireEvent.change(container.querySelector('#name'), { target: { value: 'name' } });
    fireEvent.change(container.querySelector('#color'), { target: { value: '#000000' } });
    container.querySelector('#create-button').dispatchEvent(new MouseEvent("click", { bubbles: true }));
    container.querySelector('#join-button').dispatchEvent(new MouseEvent("click", { bubbles: true }));
    container.querySelector('#open-button').dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(container).toMatchSnapshot();
  })
});