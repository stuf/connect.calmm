import * as React from 'karet';
import * as U from 'karet.util';

//

export const Input = ({ name, value, className }) =>
  <input type="text"
         className={U.cns('form-control', className)}
         name={name}
         {...U.bind({ value })} />

//

export const Item = ({
  item,
  name = U.view('name', item),
  checked = U.view('selected', item),
  onChange = U.getProps({ checked })
}) =>
  U.fromKefir(
  U.ift(item,
        <div className={U.cns('item',
                              U.ift(checked, 'checked'))}>
          <input type="checkbox"
                className={U.cns('form-check-input',
                                  'checkbox',
                                  U.ift(checked, 'checked'))}
                onChange={U.getProps({ checked })} />

          <label className="form-check-label">
            {name}
          </label>

          <button onClick={() => item.remove()}
                  className="btn btn-sm btn-outline-danger">
            Delete
          </button>
        </div>));

// Item list

export const ItemList = ({ items, isEmpty = U.isEmpty(items) }) =>
  <div className="item-list">
    <div className="container-fluid">
    {U.ifte(U.not(isEmpty),
            U.seq(items,
              U.mapElems((it, i) =>
                <Item key={i}
                      item={it} />)),

            <div>
              No items here yet.
            </div>)}
    </div>
  </div>

//

export const Card = ({ title, children, inverse }) =>
  <div className={U.cns('card',
                        U.ift(inverse, 'card-inverse'))}>
    <h5 className="card-header">{title}</h5>
    <div className="card-body">
      {children}
    </div>
  </div>;

//

export const CardGroup = ({ children }) =>
  <div className="card-group">
    {children}
  </div>;

