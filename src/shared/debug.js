import * as React from 'karet';
import * as U from 'karet.util';

export const StateInfo = U.withContext((props, context) =>
  <pre><code>{context.store.map(x => JSON.stringify(x, null, 2))}</code></pre>);

