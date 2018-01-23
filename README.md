
# connect.calmm

Proof-of-Concept example of creating Redux-style `connect` functionality with embedded reactive state.

---

## Why

While most common handling of state in Calmm.js applications relies on creating slices of state that are passed around, this approach may not always be a working approach in some situations.

One of these cases has been when using `react-router`, and wanting to specify some part of the state that should be automatically bound to the `Route`'s target component's props.

Normally, one would have implemented a component that `react-router` mounts like this:

```jsx
import * as React from 'karet';
import * as U from 'karet.util';

const SomePage =
  U.withContext(({ match, params, history }, { state }) =>
    <div>
      {U.view('something', state)}

      <SomeComponent items={U.view('items', state)} />
    </div>);

export default SomePage;
```

While this is perfectly fine, having to manually do `U.withContext` calls for routes can get tiresome and error-prone—on top of components having a `(props, context) ~> ReactComponent` signature instead of the usual `props ~> ReactComponent`.

Some pages may share parts of the state—take forms with steps for example—by introducing `redux`-style `connect` functionality, which allows us to reuse commonly used bindings.

## How

First, wrap your application root in the supplied `Provider` component.

```js
import { render } from 'react-dom';
import * as U from 'karet.util';
import { Provider } from './shared/connect';

import App from './app';

const store = U.atom();

render(<Provider store={store}>
         <App />
       </Provider>,
       document.getElementById('root'));
```

The `Provider` is a simple higher-order component that wraps its children into the React context. Using `Provider` is essentially the same as this:

```jsx
render(<U.Context context={{ store: U.atom() }}>
         <App />
       </U.Context>,
       document.getElementById('root'));
```

After this, you need to `connect` whatever component you want to map state to.

```jsx
import * as React from 'karet';
import * as R from 'ramda';
import * as L from 'partial.lenses';
import { connect } from './shared/connect';

const SomePage = ({ items, addItem }) =>
  <div>
    {/* ... */}
  </div>;

const mapStateToProps = {
  items: 'items',
  addItem: ['items', L.append],
  selected: ['items', L.filter(R.whereEq({ selected: true }))]
};

export default connect(mapStateToProps, SomePage);
```

Now, you may notice something similar in the definition of `mapStateToProps`. It is simply a template object of key-value pairs, where the **key** is the name of the prop to be bound to, and **value** specifies the focus with a lens.

Adding the same bindings above through `withContext` would require something like this:

```jsx
import * as React from 'karet';
import * as U from 'karet.util';
import * as R from 'ramda';
import * as L from 'partial.lenses';

const SomePage = U.withContext((props, { store }) => {
  const items = U.view('items', store);
  const addItem = U.view(['items', L.append], store);
  const selected = U.view(['items', L.filter(R.whereEq({ selected: true }))])

  return (
    <div>
      {/* ... */}
    </div>
  );
});

export default SomePage;
```

The difference in the above examples is one concerning code reuse. The first one is essentially independent on whether the component is within the React context or not, while the second one has a hard dependency on it. In fact, we can take the `connect`-related definitions and move them somewhere else—now the remaining component is like any other context-less component, which you pass the data required simply as props.

## Additional benefits

What emerges from this pattern is that the `mapStateToProps` templates can be modified like any other object. Extract commonly used views and then combine them when needed.

```js
// shared-file.js
export const items = { items: 'items' };

export const products = { products: 'products' };

export const selected = L.filter(R.whereEq({ selected: true }));

// some-page.js
import { items, products, selected } from './shared-file';

const mapStateToProps = {
  ...items,
  ...products,
  selected: ['items', select]
};
```
