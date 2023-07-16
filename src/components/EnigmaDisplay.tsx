"use client";

import React, { useState } from "react";
import { EnigmaForm } from "./EnigmaForm";
import { Enigma } from "@/lib/Enigma";
import {
  Alert,
  Button,
  FormControlLabel,
  Snackbar,
  Switch,
  TextField,
} from "@mui/material";
import { getCharNum } from "@/lib/Util";
import styles from "./components.module.css";

export function EnigmaDisplay() {
  const defaultEnigma = Enigma.create(["I", "II", "III"], [0, 0, 0], "UKW-B");
  const [enigmaObj, setEnigmaObj] = useState<Enigma>(defaultEnigma);
  const [rotorLetters, setRotorLetters] = useState("AAA");
  const [openNotification, setOpenNotification] = useState(false);
  const [plaintext, setPlaintext] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [showSteps, setShowSteps] = useState(false);
  const [stepsText, setStepsText] = useState("");

  const handleNotificationClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpenNotification(false);
  };

  const handleSubmit = (
    rotorTypes: string[],
    rotorInitLetter: string[],
    plugboardTokens: string[]
  ) => {
    const currentEnigma = Enigma.create(
      rotorTypes,
      rotorInitLetter.map((el) => getCharNum(el)),
      "UKW-B"
    );
    setRotorLetters(rotorInitLetter.join(""));
    currentEnigma.plugboard.addWires(plugboardTokens);
    setEnigmaObj(currentEnigma);
    setOpenNotification(true);
  };

  const handleEncrypt = () => {
    setCiphertext("");
    setStepsText("");
    if (plaintext === "") return;
    const removedSpaceText = tokenize(plaintext).join("").toUpperCase();
    const { result, steps, rotorPositionSequence } =
      enigmaObj.encryptString(removedSpaceText);

    if (showSteps) setStepsText(steps);
    const length = rotorPositionSequence.length;
    setRotorLetters(rotorPositionSequence[length - 1]);
    setCiphertext(result);
  };

  return (
    <div>
      <Snackbar
        open={openNotification}
        autoHideDuration={3000}
        onClose={handleNotificationClose}
      >
        <Alert
          onClose={handleNotificationClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Enigma configuration saved!
        </Alert>
      </Snackbar>
      <div className={styles.cardContainer}>
        <div
          className={styles.card}
          style={{ width: "320px", minHeight: "250px" }}
        >
          <h2>Enigma Machine</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <div className={styles.rotorLetter}>{rotorLetters[0]}</div>
              <div className={styles.rotorLetter}>{rotorLetters[1]}</div>
              <div className={styles.rotorLetter}>{rotorLetters[2]}</div>
            </div>
            <EnigmaForm onSubmit={handleSubmit} />
            <FormControlLabel
              control={
                <Switch
                  value={showSteps}
                  onChange={(e) => {
                    setShowSteps(!showSteps);
                  }}
                />
              }
              label="Show steps"
            />
          </div>
        </div>
        <div className={styles.card}>
          <h2>Text input</h2>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <TextField
              label="Plaintext"
              placeholder="Insert plaintext consisting of A-Z"
              value={plaintext}
              onChange={(e) => {
                setPlaintext(e.target.value as string);
              }}
              multiline
              sx={{ margin: "8px auto", width: "85%" }}
              minRows={9}
            />
          </div>
          <div
            style={{
              display: "flex",
              width: "92%",
              justifyContent: "end",
              marginTop: "16px",
            }}
          >
            <Button onClick={handleEncrypt} variant="contained">
              Encrypt
            </Button>
          </div>
        </div>
        <div className={styles.card}>
          <h2>Result</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <p>Ciphertext</p>
            <p className={styles.resultText}>{ciphertext}</p>
            <p>Steps</p>
            <div className={styles.resultText}>
              {stepsText.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function tokenize(input: string): string[] {
  return input.match(/\S+/g) as string[];
}
