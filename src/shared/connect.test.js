import test from 'ava';
import sinon from 'sinon';
import * as React from 'karet';
import K, * as U from 'karet.util';
import * as R from 'ramda';
import * as L from 'partial.lenses';
import { mount } from 'enzyme';

import { Provider, connect as connect_ } from './connect';

const curry2 = R.curryN(2);

const connect = curry2(connect_);

//

test.beforeEach(t => {
  t.context.Component = ({ x, xs }) =>
    <div>
      <div className="x">
        {x}
      </div>
    </div>;

  t.context.ReactiveComponent = ({ items, selected }) =>
    <div>
      <div className="items">
        {U.seq(items, U.length)}
      </div>
      <div className="selected">
        {U.seq(selected, U.view('name'))}
      </div>
    </div>;
});

//

test('creates views to state and assigns them as props', t => {
  const template = { xs: 'items', x: 'selected' };
  const { Component } = t.context;

  const initial = {
    items: [],
    selected: -1
  }

  const store = U.atom(initial)

  const test1 = connect(template);
  const Test2 = test1(Component);

  const wrapper = mount(
    <Provider store={store}>
      <Test2 d="top kek" />
    </Provider>);

  const component = wrapper.find(Component);

  const x = component.prop('x');
  const xs = component.prop('xs');

  t.deepEqual(x.get(), initial.selected);
  t.deepEqual(xs.get(), initial.items);
});

// Advanced test case
test('creates views to state that update', t => {
  const { ReactiveComponent } = t.context;
  const template = {
    items: ['items', L.define([])],
    selected: ['items', L.find(R.whereEq({ selected: true }))]
  };

  const store = U.atom();

  const connectWith = connect(template)
  const Reactive = connectWith(ReactiveComponent);

  const wrapper = mount(
    <Provider store={store}>
      <Reactive shouldBeVisible={true} />
    </Provider>
  );

  const component = wrapper.find(ReactiveComponent);
  const items = component.prop('items');
  const selected = component.prop('selected');
  const append = store.view(['items', L.append]);

  const storeSpy = sinon.spy();
  const itemsSpy = sinon.spy();
  const selectedSpy = sinon.spy();

  store.onValue(storeSpy);
  items.onValue(itemsSpy);
  selected.onValue(selectedSpy);

  const itemsToAdd = [
    { id: 1, selected: false, name: 'Snowball' },
    { id: 2, selected: true, name: 'Mr. Kale' },
    { id: 3, selected: false, name: 'Mr. Nike' }
  ];

  itemsToAdd.forEach(it => append.set(it));

  // Assert that the store is falsy (empty) at first
  t.falsy(storeSpy.firstCall.args[0]);

  // Observer on `items` and `selected` should be called `n + 1` times;
  // the extra `+ 1` is because the observers will observe the immediate,
  // first value, which is `undefined`.
  t.is(itemsSpy.callCount, itemsToAdd.length + 1);
  t.is(selectedSpy.callCount, 2);

  // Assert that the items match
  t.is(selectedSpy.getCall(1).args[0], itemsToAdd[1]);

  // Assert that the store's items equal to those added
  t.deepEqual(itemsSpy.lastCall.args[0], itemsToAdd);

  // Assert that the component has rendered with updated values
  t.is(component.find('FromClass > .items').text(), '3');
  t.is(component.find('FromClass > .selected').text(), 'Mr. Kale');

  // Finally, assert the store contains what we've added.
  t.deepEqual(storeSpy.lastCall.args[0].items, itemsToAdd);
});
