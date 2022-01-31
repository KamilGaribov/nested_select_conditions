import React from "react";
import { useState, useEffect } from "react";
import {
  Argument,
  IArgument,
  IArgumentProps,
  ArgumentSelect,
} from "./components/argument";
import { Block } from "./components/block";

export default function App(): JSX.Element {
  const [args, setArgs] = useState<IArgument[]>([
    { id: 0, name: "MyArg", value: "false" },
    { id: 1, name: "x", value: "true" },
  ]);
  const setArgument = (arg: IArgument) => {
    args.map((item, i) => {
      if (item.id == arg.id) return (args[i] = arg);
    });
    setArgs([...args]);
  };
  const addArgument = () => {
    let newArg = {
      id: args[args.length - 1].id + 1,
      name: "new arg",
      value: "false",
    };
    setArgs([...args, newArg]);
  };
  return (
    <div>
      <div className="argument">
        {args.map((item, i) => {
          return (
            <Argument
              key={i}
              id={item.id}
              name={item.name}
              value={item.value}
              setArgument={setArgument}
            />
          );
        })}
        <button onClick={() => addArgument()}>+ add arg</button>
      </div>
      <hr />
      <div className="option">
        <Block args={args} />
      </div>
    </div>
  );
}
