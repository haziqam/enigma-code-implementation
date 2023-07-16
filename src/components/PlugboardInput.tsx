import { useState } from "react";
import {
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

export function PlugboardInput(props: {
  plugboardValue: string[];
  setPlugboardValue: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [plugboardInputValue, setPlugboardInputValue] = useState("");
  const [wireToRemove, setWireToRemove] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [invalidMsg, setInvalidMsg] = useState("");

  const handleAddWire = () => {
    setIsInvalid(false);
    if (plugboardInputValue === "") return;

    const tokens = plugboardInputValue.split(" ");
    const validationResult = validateTokens(tokens, props.plugboardValue);
    if (validationResult.isInvalid) {
      setIsInvalid(true);
      setInvalidMsg(validationResult.invalidMsg!);
      return;
    }

    props.setPlugboardValue(props.plugboardValue.concat(tokens));
    setIsInvalid(false);
    setPlugboardInputValue("");
  };

  return (
    <div>
      <div>
        <Typography>Plugboard wires</Typography>
        <div
          style={{
            backgroundColor: "rgb(233, 230, 230)",
            borderRadius: "4px",
            padding: "16.5px 14px",
            minHeight: "53px",
            boxSizing: "border-box",
          }}
        >
          {props.plugboardValue.join(", ")}
        </div>
      </div>
      <TextField
        label="New wires"
        placeholder="format: AB YF RQ"
        value={plugboardInputValue}
        onChange={(e) => {
          setPlugboardInputValue(e.target.value as string);
        }}
        multiline
        sx={{ width: "100%", margin: "10px 0" }}
        error={isInvalid}
        helperText={isInvalid ? invalidMsg : ""}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleAddWire}
                edge="end"
              >
                <AddIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <FormControl fullWidth>
        <InputLabel id="remove-wire-label">Wire to remove</InputLabel>
        <div>
          <Select
            sx={{ width: "60%", marginRight: "16px" }}
            labelId="remove-wire-label"
            label="Wire to remove"
            value={wireToRemove}
            onChange={(e) => {
              setWireToRemove(e.target.value as string);
            }}
          >
            {props.plugboardValue.map((token, i) => {
              return (
                <MenuItem value={token} key={i}>
                  {token}
                </MenuItem>
              );
            })}
          </Select>
          <IconButton
            onClick={(e) => {
              props.setPlugboardValue(
                props.plugboardValue.filter((el) => el !== wireToRemove)
              );
            }}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </FormControl>
    </div>
  );
}

function validateTokens(
  tokens: string[],
  plugboardValue: string[]
): { isInvalid: boolean; invalidMsg?: string } {
  if (!hasNoDuplicates(tokens.join(""))) {
    return { isInvalid: true, invalidMsg: "No duplicates allowed" };
  }
  const tokenRegex = /^[A-Z]{2}$/;
  for (const token of tokens) {
    if (!tokenRegex.test(token) || token[0] === token[1]) {
      return { isInvalid: true, invalidMsg: "Invalid token" };
    }

    const lettersInPlugboard = new Set(plugboardValue.join("").split(""));
    if (lettersInPlugboard.has(token[0]) || lettersInPlugboard.has(token[1])) {
      return {
        isInvalid: true,
        invalidMsg: "Cannot add already existing letter",
      };
    }
  }
  return { isInvalid: false };
}

function hasNoDuplicates(str: string): boolean {
  return new Set(str).size === str.length;
}
