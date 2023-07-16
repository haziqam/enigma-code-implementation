import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { SelectChangeEvent } from "@mui/material";
import { PlugboardInput } from "./PlugboardInput";
import { RotorOptionInput } from "./RotorOptionInput";
import styles from "./components.module.css";

export function EnigmaForm(props: {
  onSubmit: (
    rotorTypes: string[],
    rotorInitLetter: string[],
    plugboardTokens: string[]
  ) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [leftRotorType, setLeftRotorType] = React.useState("I");
  const [middleRotorType, setMiddleRotorType] = React.useState("II");
  const [rightRotorType, setRightRotorType] = React.useState("III");
  const [leftRotorInitialLetter, setLeftRotorInitialLetter] =
    React.useState("A");
  const [middleRotorInitialLetter, setMiddleRotorInitialLetter] =
    React.useState("A");
  const [rightRotorInitialLetter, setRightRotorInitialLetter] =
    React.useState("A");
  const [plugboardValue, setPlugboardValue] = useState<string[]>([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTypeChange = (
    event: SelectChangeEvent,
    rotor: "Left" | "Middle" | "Right"
  ) => {
    if (rotor === "Left") setLeftRotorType(event.target.value as string);
    else if (rotor === "Middle")
      setMiddleRotorType(event.target.value as string);
    else setRightRotorType(event.target.value as string);
  };

  const handleInitLetterChange = (
    event: SelectChangeEvent,
    rotor: "Left" | "Middle" | "Right"
  ) => {
    if (rotor === "Left")
      setLeftRotorInitialLetter(event.target.value as string);
    else if (rotor === "Middle")
      setMiddleRotorInitialLetter(event.target.value as string);
    else setRightRotorInitialLetter(event.target.value as string);
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        sx={{ marginBottom: "16px" }}
      >
        Settings
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ paddingBottom: "5px" }}>
          Enigma configuration
        </DialogTitle>
        <DialogContent>
          <section className={styles.formSection}>
            <RotorOptionInput
              name="Left"
              rotorType={leftRotorType}
              initialLetter={leftRotorInitialLetter}
              onTypeChange={(e) => {
                handleTypeChange(e, "Left");
              }}
              onInitLetterChange={(e) => {
                handleInitLetterChange(e, "Left");
              }}
            />
            <RotorOptionInput
              name="Middle"
              rotorType={middleRotorType}
              initialLetter={middleRotorInitialLetter}
              onTypeChange={(e) => {
                handleTypeChange(e, "Middle");
              }}
              onInitLetterChange={(e) => {
                handleInitLetterChange(e, "Middle");
              }}
            />
            <RotorOptionInput
              name="Right"
              rotorType={rightRotorType}
              initialLetter={rightRotorInitialLetter}
              onTypeChange={(e) => {
                handleTypeChange(e, "Right");
              }}
              onInitLetterChange={(e) => {
                handleInitLetterChange(e, "Right");
              }}
            />
          </section>
          <section className={styles.formSection}>
            <PlugboardInput
              plugboardValue={plugboardValue}
              setPlugboardValue={setPlugboardValue}
            />
          </section>
          <div style={{ display: "flex", justifyContent: "end" }}>
            <Button
              variant="contained"
              onClick={() => {
                props.onSubmit(
                  [leftRotorType, middleRotorType, rightRotorType],
                  [
                    leftRotorInitialLetter,
                    middleRotorInitialLetter,
                    rightRotorInitialLetter,
                  ],
                  plugboardValue
                );
                handleClose();
              }}
              sx={{ width: "114px", height: "36px" }}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
