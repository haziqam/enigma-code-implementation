function affh() {
  const x = 10;
  const inner = () => {
    console.log(x);
  };
  function otherInner() {
    console.log(x);
  }
  inner();
  otherInner();
}

affh();
