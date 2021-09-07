import React from "react";
import { Link } from "react-router-dom";
import { Button, Grid, Input } from "semantic-ui-react";
import { COIN } from "views/Binance/Binance";
import moment from "moment";
import axios from "axios";

const Cloud = () => {
  const fileInput = React.useRef();
  const [value, setValue] = React.useState("");

  const handleClickExport = async () => {
    const element = document.createElement("a");
    const file = new Blob([localStorage.getItem(COIN)], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = `BinanceTable${moment().format("YYYYMMDDss")}.json`;
    document.body.appendChild(element);
    element.click();
  };

  const handleImportFile = (event) => {
    const fileReader = new FileReader();
    fileReader.addEventListener("load", () => {
      handleClickSync(fileReader.result);
    });
    fileReader.readAsText(event.target.files[0]);
  };

  const handleClickSync = async (value) => {
    try {
      if (/^https?:\/\/.*/.test(value)) {
        const { data } = await axios.get(value);
        if (typeof data === "object") value = JSON.stringify(data);
        if (typeof data === "string") value = data;
      }
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        localStorage.setItem(COIN, value);
        setValue("DONE");
      } else {
        setValue("FAIL");
      }
    } catch {
      setValue("FAIL");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleClickSync(value);
    }
  };

  return (
    <div className="app">
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Link to="/">
              <Button onClick={() => handleClickSync(value)}>BACK</Button>
            </Link>
            <Button color="green" onClick={handleClickExport}>
              EXPORT
            </Button>
            <Button color="blue" onClick={() => fileInput.current.click()}>
              IMPORT
            </Button>
            <input ref={fileInput} type="file" accept="application/json" hidden onChange={handleImportFile} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Input
              style={{ width: 360 }}
              value={value}
              placeholder="URL or value"
              onChange={(event) => {
                const { value } = event.target;
                setValue(value);
              }}
              onFocus={() => setValue("")}
              onKeyPress={handleKeyPress}
              action={
                <Button color="blue" onClick={() => handleClickSync(value)}>
                  SAVE
                </Button>
              }
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default Cloud;
