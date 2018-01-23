import test from 'ava';
import * as React from 'karet';
import * as U from 'karet.util';
import { mount } from 'enzyme';

import { StateInfo } from './debug';

test('StateInfo', t => {
  const state = U.atom({ a: 1, b: 2, foo: true });

  const wrapper = mount(
    <U.Context context={{ store: state }}>
      <StateInfo />
    </U.Context>
  );

  t.is(wrapper.find('code').text(), JSON.stringify(state.get(), null, 2));
});
