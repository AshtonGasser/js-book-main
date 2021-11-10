import { useTypedSelector } from './use-typed-selector';


export const useCumulativeCode = (cellId: string) => {
    return useTypedSelector((state) => {
        const { data, order } = state.cells;
        const orderCells = order.map((id) => data[id]);
    
        // show function displays objects and JSX elements in 
        // each cell cumulatively 
        const showFunction = `
        import React from 'react';
        import ReactDOM from 'react-dom';
        var show = (value) => {
          const root = document.querySelector('#root');
    
          if (typeof value === 'object') {
            if (value.$$typeof && value.props) {
              ReactDOM.render(value, root);
            } else {
              root.innerHTML = JSON.stringify(value);
            }
          } else {
            root.innerHTML = value;
          }
        };
      `;
        //var has no limit vs let  
        const ShowFunctionNoop = 'var show = () => {}';
        const cumulativeCode = [];
    
        for (let c of orderCells) {
          if (c.type === 'code') {
            if (c.id === cellId) {
              cumulativeCode.push(showFunction)
            } else {
              cumulativeCode.push(ShowFunctionNoop)
            }
            cumulativeCode.push(c.content);
          }
          if (c.id === cellId) {
            break;
          }
        }
        return cumulativeCode;
      }).join('\n');
};