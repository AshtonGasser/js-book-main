import * as esbuild from 'esbuild-wasm';
import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  const ref = useRef<any>();
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');
  const onClick = async () => {
    if (!ref.current) {
      return;
    }
    const result = await ref.current.transform(input, {
      loader: 'jsx',
      target: 'es2015',
    });
    setCode(result.code);
    // try {
    //   const res = await esbuild.transform(input, {
    //     loader: 'jsx',
    //     target: 'es2015',
    //   });

    //   console.log(res.code);
    // } catch (err) {
    //   console.error(err);
    // }
  };

  const startService = async () => {
    try {
      ref.current = await esbuild.startService({
        worker: true,
        wasmURL: '/esbuild.wasm',
      });
    } catch (err) {}
  };
  useEffect(() => {
    startService();
  }, []);

  return (
    <>
      <div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>

        <div>
          <button onClick={onClick}>SUBMIT</button>
        </div>
        <pre>{code}</pre>
      </div>
    </>
  );
};
ReactDOM.render(<App />, document.querySelector('#root'));
