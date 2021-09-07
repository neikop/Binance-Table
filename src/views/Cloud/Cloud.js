import React from "react";
import { Link } from "react-router-dom";
import { Button, Grid, Input } from "semantic-ui-react";
import { cloudService } from "services/cloud";
import { COIN } from "views/Binance/Binance";
import moment from "moment";

const Cloud = () => {
  const [upload, setUpload] = React.useState("");
  const [isUpload, setIsUpload] = React.useState(false);

  const fileInput = React.useRef();

  const [value, setValue] = React.useState("");
  const [isSync, setIsSync] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

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

  const handleClickSync = (value) => {
    try {
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
            <Button color="green" loading={isUpload} onClick={handleClickExport}>
              EXPORT
            </Button>
            <Button color="blue" loading={isUpload} onClick={() => fileInput.current.click()}>
              IMPORT
            </Button>
            <input ref={fileInput} type="file" accept="application/json" hidden onChange={handleImportFile} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Input
              value={value}
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
