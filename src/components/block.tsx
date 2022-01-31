import React from "react";
import { useState, useEffect } from "react";
import { IArgument, ArgumentSelect } from "./argument";
import { InitialSelect, ConstantSelect } from "./select";

export interface IOption {
  type: string;
  value: string;
  children?: IOption[] | null;
  argument?: IArgument | null;
  id?: number | null;
  setArgument?: (arg: IArgument) => void;
}

interface BlockProps {
  args: IArgument[];
  parent?: IOption;
  data2?: IOption;
  updateParent2?: (child: IOption) => void;
}

const initialData: IOption = {
  type: "null",
  value: "undefined",
  children: null,
  argument: null,
  id: 0,
};

const valueFromChildren = (parent: IOption) => {
  let arr = parent.children;
  let type = parent.type;
  if (!arr || arr.length === 0) {
    return "undefined";
  }
  if (type === "or") {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].value === "true") return "true";
      if (arr[i].value === "undefined") return "undefined";
    }
    return "false";
  } else if (type === "and") {
    let undefined_ = false;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].value === "false") return "false";
      if (arr[i].value === "undefined") undefined_ = true;
    }
    if (undefined_) return "undefined";
    return "true";
  }
  return "undefined";
};

export const Block = (props: BlockProps) => {
  const [result, setResult] = useState("undefined");
  const { args, data2, parent, updateParent2 } = props;
  const [data, setData] = useState<IOption>(data2 ? data2 : initialData);
  useEffect(() => {
    if (parent) {
      updateParent2!(data);
    } else {
      setResult(data.value);
    }
  }, [data]);
  const handleSelect = (value: string) => {
    let updatedData: IOption;
    if (value === "undefined") {
      updatedData = {
        type: "null",
        value: "undefined",
        id: data.id,
        children: null,
        argument: null,
      };
    } else if (value === "constant") {
      updatedData = {
        type: value,
        value: "false",
        id: data.id,
      };
    } else if (value === "argument") {
      updatedData = {
        type: value,
        value: args[0].value,
        argument: args[0],
        id: data.id,
      };
    } else {
      if (data.children) data.type = value;
      updatedData = {
        type: value,
        value: data.children ? valueFromChildren(data) : "undefined",
        id: data.id,
        children: data.children
          ? data.children
          : [initialData, { ...initialData, id: 1 }],
      };
    }
    setData(updatedData);
  };
  const handleChangeArgument = (arg: string) => {
    let parsedArg = JSON.parse(arg);
    setData({ ...data, value: parsedArg.value, argument: parsedArg });
  };
  const handleChangeConstant = (item: IOption) => {
    setData(item);
  };
  const addChild = () => {
    if (data.children) {
      setData({
        ...data,
        children: [
          ...data.children,
          {
            type: "null",
            value: "undefined",
            id: data.children[data.children.length - 1]
              ? data.children[data.children.length - 1].id! + 1
              : 0,
          },
        ],
      });
    }
  };
  const updateParent = (child: IOption) => {
    let newData: IOption = {
      type: data.type,
      value: data.value,
      children: [],
    };
    if (data.children)
      for (let i = 0; i < data.children.length; i++) {
        if (data.children[i].id === child.id) {
          if (child.type !== "deleted") {
            newData.children!.push(child);
            newData.id = data.id;
          }
        } else {
          newData.children!.push(data.children[i]);
          newData.id = data.id;
        }
      }
    newData.value = valueFromChildren(newData);
    setData(newData);
  };

  return (
    <div className="block">
      {!parent ? <div id="result">result: {result}</div> : null}
      {data.type === "null" ? (
        <InitialSelect data={data} handleSelect={handleSelect} />
      ) : data.type === "constant" ? (
        <ConstantSelect item={data} handleChange={handleChangeConstant} />
      ) : data.type === "argument" ? (
        <ArgumentSelect args={args} handleChange={handleChangeArgument} />
      ) : data.type === "and" || data.type === "or" ? (
        <>
          <InitialSelect data={data} handleSelect={handleSelect} />
          <div className="children">
            {data.children!.map((child: IOption) => {
              return (
                <Block
                  key={child.id}
                  args={args}
                  parent={data}
                  data2={child}
                  updateParent2={updateParent}
                />
              );
            })}
          </div>
          <button onClick={addChild}>+ add op</button>
        </>
      ) : null}
      <button
        className="del-btn"
        onClick={() =>
          setData({
            type: parent ? "deleted" : "null",
            value: "undefined",
            id: data.id,
            children: null,
            argument: null,
          })
        }
      >
        x
      </button>
    </div>
  );
};
