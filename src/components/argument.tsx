import { useState, useEffect } from "react";

export interface IArgument {
  id: number;
  name: string;
  value: string;
}

export interface IArgumentProps {
  id: number;
  name: string;
  value: string;
  setArgument: (argument: IArgument) => void;
}

export interface IArgumentSelectProps {
  args: IArgument[];
  handleChange: (arg: string) => void;
}

export const Argument = (props: IArgumentProps): JSX.Element => {
  const [local, setLocal] = useState<IArgumentProps>(props);
  const { value, setArgument } = props;
  return (
    <div className="argument">
      <input
        value={local.name}
        onBlur={(e) => setArgument(local)}
        onChange={(e) => setLocal({ ...local, name: e.target.value })}
      />
      <select
        defaultValue={value}
        onChange={(e) => {
          setLocal({ ...local, value: e.target.value });
          setArgument({ ...local, value: e.target.value });
        }}
      >
        <option value={"true"}>true</option>
        <option value={"false"}>false</option>
      </select>
    </div>
  );
};

export const ArgumentSelect = (props: IArgumentSelectProps) => {
  const { args, handleChange } = props;
  const [argument, setArgument] = useState<IArgument>({
    value: args[0].value,
    name: args[0].name,
    id: args[0].id,
  });
  useEffect(() => {
    let updatedArg: IArgument = args.find((arg) => arg.id === argument.id)!;
    handleChange(JSON.stringify(updatedArg));
    setArgument(updatedArg);
  }, [args]);
  return (
    <select
      onChange={(e) => {
        setArgument(JSON.parse(e.target.value));
        handleChange(e.target.value);
      }}
    >
      {args.map((item: IArgument, i: number) => {
        return (
          <option key={item.id} value={JSON.stringify(item)}>
            {item.name}
          </option>
        );
      })}
    </select>
  );
};
