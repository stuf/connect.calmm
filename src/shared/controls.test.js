import test from 'ava';
import sinon from 'sinon';
import * as Kefir from 'kefir';
import * as React from 'karet';
import * as U from 'karet.util';
import * as R from 'ramda';
import { mount } from 'enzyme';

import { Card, CardGroup, Item, ItemList, Input } from './controls';

const curry2 = R.curryN(2);

const findWith = curry2((w, s) => w.find(s));
const prop = curry2((n, e) => e.prop(n));
const activate = obs => obs.onValue(R.identity).offValue(R.identity);


test('Card', t => {
  const wrapper = mount(
    <Card title="Card title">
      <p>This is the body text</p>
    </Card>
  );

  t.is(wrapper.find('h5').text(), 'Card title');
  t.is(wrapper.find('p').text(), 'This is the body text');
});

test('CardGroup', t => {
  const wrapper = mount(
    <CardGroup>
      <Card title="First">
        <p>Text</p>
      </Card>
      <Card title="Second">
        <p>Text</p>
      </Card>
    </CardGroup>
  );

  t.truthy(wrapper.children('.card-group'));
  t.is(wrapper.find(Card).length, 2);
});

test('Item', t => {
  const state = U.atom({
    name: 'Blib Blub'
  });

  const nameIn = U.view('name');
  const wrapper_ = mount(<Item item={state} />)
  const w$ = Kefir.constant(wrapper_);

  const getContext = w => {
    const w_ = w.update();
    const find = findWith(w_);
    return Kefir.constant({
      wrapper: w_,
      find,
      checkbox: find('input[type="checkbox"]'),
      label: find('label'),
      removeButton: find('button')
    });
  };

  const steps =
    U.seq(w$,
          // Begin.
          // First, ensure the wrapper context is okay
          U.flatMapLatest(getContext),

          // Step: check that UI matches initial state
          U.flatMapLatest(ctx => {
            t.falsy(state.view('selected').get());
            t.is(nameIn(state).get(), 'Blib Blub');

            return getContext(ctx.wrapper);
          }),

          // Step: simulate a change event and check if the UI is updated accordingly
          U.flatMapLatest(ctx => {
            ctx.checkbox.simulate('change', { target: { checked: true, value: 'on' } });

            const item = ctx.wrapper.find('.item')
            const cb = ctx.wrapper.find('.checkbox');

            t.true(item.hasClass('checked'));
            t.true(cb.hasClass('checked'));

            return getContext(ctx.wrapper);
          }),

          // Step: simulate a click event on the remove button and check that the state is empty
          U.flatMapLatest(ctx => {
            ctx.removeButton.simulate('click');

            t.false(ctx.wrapper.find('.item').exists());

            return getContext(ctx.wrapper);
          }));

  activate(steps);
});

test('ItemList', t => {
  const state = U.atom({
    items: [
      { id: 1, name: 'Blib Blub' },
      { id: 2, name: 'Plip Plop' },
      { id: 3, name: 'OPAF' }
    ]
  })

  const wrapper = mount(<ItemList items={U.view('items', state)} />);

  t.is(wrapper.find('.item').length, 3);
})

test('Input', t => {
  const value = U.atom('');
  let wrapper = mount(<Input value={value} name="test-input" />);

  const find = sel => wrapper.find(sel);
  const prop = curry2((n, e) => e.prop(n));
  const valueFor = prop('value');

  let input = find('input');

  t.is(valueFor(input), '');

  const valueSpy = sinon.spy();
  value.onValue(valueSpy);

  value.set('123');

  wrapper = wrapper.update();
  input = find('input');

  t.is(valueFor(input), '123');
});
