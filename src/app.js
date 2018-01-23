import * as React from 'karet';
import * as L from 'partial.lenses';

import { connect } from './shared/connect';
import { StateInfo } from './shared/debug';
import { ItemList, Card, CardGroup, Input } from './shared/controls';
import './app.css';

//

/**
 * Define an object template that will be used to create a slice from the state,
 * and bind them as props to the component you wish to `connect` to.
 *
 * Keys specify the prop name, and the value is a lens that will be used to
 * create the views to state.
 */
const mapStateToProps = {
  items: 'items',
  value: ['firstNameInput', L.define('')],
  append: ['items', L.append]
};

const App = ({ items, append, value }) =>
  <div className="container">
    <Card title="Items">
      <ItemList items={items} />
    </Card>

    <CardGroup>
      <Card title="Add new item">
        <div className="input-group mb-3">
          <Input name="firstName"
                value={value} />

          <div className="input-group-append">
            <button className="btn btn-primary"
                    onClick={e => {
                      // We'll `.get()` the input field's value here,
                      // just for the sake of convenience to avoid repetition.
                      const name = value.get();

                      // Create a new item if the field is not empty.
                      if (name) append.set({ name });

                      // Clear the text input's value after we've added the item
                      value.remove();
                    }}>
              Add
            </button>
          </div>
        </div>
      </Card>

      {/* Show the state's content as JSON to demonstrate that
          our `connect`ed state bindings work. */}
      <Card title="State JSON">
        <StateInfo />
      </Card>
    </CardGroup>
  </div>;

//

export default connect(mapStateToProps, App);
