import * as React from 'karet';
import * as U from 'karet.util';
import * as R from 'ramda';
import * as L from 'partial.lenses';

//# transformTemplate :: (StrMap Any, Atom) ~> StrMap Any
const transformTemplate = (template, store) => {
  const createStoreView = ([k, v]) => [k, U.view(v, store)];


  return L.transform([L.entries,
                      L.modifyOp(createStoreView)], template);
};

//# connect :: (StrMap Any, ReactComponent) ~> ReactComponent
export function connect (template, Component) {
  const WrappedComponent = U.withContext((props, ctx) => {
    const tmpl = transformTemplate(template, ctx.store);

    return <Component {...{...props, ...tmpl}} />;
  });

  return WrappedComponent;
}

//# Provider :: { store :: Atom, children :: Any } ~> ReactElement
export function Provider({ store, children }) {
  return (
    <U.Context context={{ store }}>
      {children}
    </U.Context>
  );
};
