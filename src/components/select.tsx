import { useState, useEffect } from "react";
import { IOption } from "./block";

export interface IInitialSelectProps {
  data: IOption;
  handleSelect: (value: string) => void;
}

export interface IConstantSelectProps {
  item: IOption;
  handleChange: (option: IOption) => void;
}

export const InitialSelect = (props: IInitialSelectProps) => {
  const [type, setType] = useState<string>(props.data!.type);
  const { handleSelect } = props;
  return (
    <select
      defaultValue={type}
      onChange={(e) => {
        setType(e.target.value);
        handleSelect(e.target.value);
      }}
    >
      <option value="undefined">select</option>
      <option value="constant">constant</option>
      <option value="argument">argument</option>
      <option value="and">and</option>
      <option value="or">or</option>
    </select>
  );
};

export const ConstantSelect = (props: IConstantSelectProps) => {
  const { item, handleChange } = props;
  return (
    <select
      defaultValue={"false"}
      onChange={(e) =>
        handleChange({ ...item, type: "constant", value: e.target.value })
      }
    >
      <option value="true">true</option>
      <option value="false">false</option>
    </select>
  );
};
