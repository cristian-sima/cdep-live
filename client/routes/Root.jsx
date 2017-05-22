import React from "react";

import {
  Route,
  Router,
  // Link,
  // Redirect,
  // withRouter,
} from "react-router-dom";
import { Provider } from "react-redux";

import Login from "../components/Login";
import UserList from "../components/UserList/WrapContainer";

// //////////////////////////////////////////////////////////
// 1. Click the public page
// 2. Click the protected page
// 3. Log in
// 4. Click the back button, note the URL each time


/* <ul>
<li><Link to="/public">Public Page</Link></li>
<li><Link to="/protected">Protected Page</Link></li>
</ul> */


/* <PrivateRoute path="/protected" component={Protected} /> */


const Root = ({ history, store } : { history : any, store : any }) => (
  <Provider store={store}>
    <Router history={history}>
      <div>
        <Route component={Login} path="/login" />
        <Route component={UserList} path="/user-list" />
      </div>
    </Router>
  </Provider>
);

// const fakeAuth = {
//   isAuthenticated: false,
//   authenticate (cb) {
//     this.isAuthenticated = true;
//     setTimeout(cb, 100); // fake async
//   },
//   signout (cb) {
//     this.isAuthenticated = false;
//     setTimeout(cb, 100);
//   },
// };

// const AuthButton = withRouter(({ history }) => (
//   fakeAuth.isAuthenticated ? (
//     <p>
//       Welcome! <button onClick={() => {
//         fakeAuth.signout(() => history.push("/"));
//       }}>Sign out</button>
//     </p>
//   ) : (
//     <p>You are not logged in.</p>
//   )
// ));
//
// const PrivateRoute = ({ component: Component, ...rest }) => (
//   <Route
//     {...rest}
//     render={(props) => (
//     fakeAuth.isAuthenticated ? (
//       <Component {...props} />
//     ) : (
//       <Redirect to={{
//         pathname : "/login",
//         state    : { from: props.location },
//       }} />
//     )
//   )}
// />
// );
//
// const Public = () => <h3>Public</h3>;
// const Protected = () => <h3>Protected</h3>;
//
// class Login extends React.Component {
//   state = {
//     redirectToReferrer: false,
//   }
//
//   login = () => {
//     fakeAuth.authenticate(() => {
//       this.setState({ redirectToReferrer: true });
//     });
//   }
//
//   render () {
//     const { from } = this.props.location.state || { from: { pathname: "/" } };
//     const { redirectToReferrer } = this.state;
//
//     if (redirectToReferrer) {
//       return (
//         <Redirect to={from} />
//       );
//     }
//
//     return (
//       <div>
//         <p>You must log in to view the page at {from.pathname}</p>
//         <button onClick={this.login}>Log in</button>
//       </div>
//     );
//   }
// }

export default Root;
