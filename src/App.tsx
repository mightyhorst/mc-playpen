import {ReactNode} from 'react';
import "./styles.css";

export default function App({children}: {children?: ReactNode}) {
  return (
    <div className="App">
      <h1>mc playpen</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
