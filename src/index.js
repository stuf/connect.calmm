import * as React from 'karet';
import ReactDOM from 'react-dom';

import registerServiceWorker from './registerServiceWorker';

import App from './app';
import { createStore } from './store';
import { Provider } from './shared/connect';
import 'bootstrap/dist/css/bootstrap.css';

//

const initial = {
  items: []
};

const store = createStore(initial);

//

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'));

registerServiceWorker();
