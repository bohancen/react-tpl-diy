import React,{lazy,Suspense} from 'react';
import {Switch,Route,Link} from 'react-router-dom'

const Post = lazy(() => import('./page/Post'));
const Forum = lazy(() => import('./page/Forum'));

function App() {
  return (
    <>
      <h1>tpl</h1>
      <div className="avatar">1</div>
      <ul>
        <li><Link to="/post">post</Link></li>
        <li><Link to="/forum">forum</Link></li>
      </ul>
      <Suspense fallback={<div>loading...</div>}>
        <Switch>
          <Route path="/post" component={Post}></Route>
          <Route path="/forum" component={Forum}></Route>
        </Switch>
      </Suspense>
    </>
  );
}

export default App;
