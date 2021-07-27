import {ReactNode, useEffect, useState} from 'react';
import "./styles.css";

/**
 * 
 */
import {
  RecoilRoot,
} from 'recoil';

/**
 * @requires Components
 */
import {
  TodoList,
} from './components';


export default function App({children}: {children?: ReactNode}) {

  return (
    <RecoilRoot>
      <div className="App">
        <TodoList />
      </div>
    </RecoilRoot>
  );
}
