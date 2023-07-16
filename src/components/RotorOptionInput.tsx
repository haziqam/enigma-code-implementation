import {
  SelectChangeEvent,
  MenuItem,
  DialogContentText,
  Select,
} from "@mui/material";
import styles from "./components.module.css";

export function RotorOptionInput(props: {
  name: string;
  rotorType: string;
  initialLetter: string;
  onTypeChange: (event: SelectChangeEvent) => void;
  onInitLetterChange: (event: SelectChangeEvent) => void;
}) {
  const rotorTypeOptions = ["I", "II", "III"].map((option, i) => {
    return (
      <MenuItem value={option} key={i}>
        {option}
      </MenuItem>
    );
  });

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const initialLetterOptions = alphabet.map((letter, i) => {
    return (
      <MenuItem value={letter} key={i}>
        {letter}
      </MenuItem>
    );
  });

  return (
    <div className={styles.rotorOptions}>
      <div>
        <DialogContentText>{props.name} rotor type</DialogContentText>
        <Select value={props.rotorType} onChange={props.onTypeChange}>
          {rotorTypeOptions}
        </Select>
      </div>
      <div style={{ width: "190px" }}>
        <DialogContentText>
          {props.name} rotor initial position
        </DialogContentText>
        <Select value={props.initialLetter} onChange={props.onInitLetterChange}>
          {initialLetterOptions}
        </Select>
      </div>
    </div>
  );
}
