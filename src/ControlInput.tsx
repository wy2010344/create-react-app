import { FC, useState } from 'react';
import styled from 'styled-components';

interface ControlInputProps { }

const ControlInput: FC<ControlInputProps> = () => {
  const [value, setValue] = useState('');
  return (<Wrapper>
    <input value={value} onChange={e => {
      const tv = e.target.value
      if (canInputInt(tv)) {
        setValue(tv)
      }
    }} />
    <input />
  </Wrapper>);
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  >input{
    background-color: gray;
  }
`
export default ControlInput;




export function canInputNumber(
  fix: number = 0,
  config?: {
    allowNegative?: boolean;
    canChange?(v: number): boolean;
  }
) {
  if (fix != Infinity) {
    if (fix < 0) {
      throw new Error("fix should be oppositive");
    }
    if (fix != Math.round(fix)) {
      throw new Error("fix should be int");
    }
  }
  return function (v: string) {
    if (v == "") {
      return true;
    } else if (v == "-") {
      //负数
      if (config?.allowNegative) {
        return true;
      } else {
        return false;
      }
    } else {
      const n = Number(v);
      if (isNaN(n)) {
        return false;
      }
      if (!config?.allowNegative && n < 0) {
        return false;
      }
      const idx = v.indexOf(".");
      if (idx > -1) {
        if (fix == 0) {
          return false;
        }
        if (v.length - idx - 1 > fix) {
          return false;
        }
      }
      if (config?.canChange) {
        return config.canChange(n);
      }
      return true;
    }
  };
}
export const canInputInt = canInputNumber();
export const canInputIntMax = canInputNumber(0, {
  canChange(v) {
    return v < 2147483647;
  },
});
export const canInputAnyPositiveNumber = canInputNumber(Infinity);