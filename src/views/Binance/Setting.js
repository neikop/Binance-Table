import React from "react";
import { Button, Checkbox, Form, Modal } from "semantic-ui-react";

const COLORS = [
  { id: 1, name: "Green", code: "green" },
  { id: 2, name: "Orange", code: "orange" },
  { id: 3, name: "Yellow", code: "yellow" },
];

const Setting = ({ color, lower, noter, onSuccess, onVisibleChange }) => {
  const [currentColor, setColor] = React.useState(color);
  const [currentLower, setLower] = React.useState(lower);
  const [currentNoter, setNoter] = React.useState(noter);

  const handleClickSave = () => {
    onSuccess({ currentColor, currentLower, currentNoter });
    onVisibleChange(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleClickSave();
    }
  };

  return (
    <>
      <Modal.Header>Setting</Modal.Header>
      <Modal.Content>
        <Form widths="equal">
          <Form.Field>
            <label style={{ display: "flex" }}>
              <Checkbox checked={currentColor.use} onChange={() => setColor((cur) => ({ ...cur, use: !cur.use }))} />
              <span style={{ marginLeft: 12 }}>Color of Target / Price</span>
            </label>
            <Button.Group>
              {COLORS.map((item) => (
                <Button
                  key={item.id}
                  color={currentColor.value === item.code ? item.code : undefined}
                  onClick={() => setColor((cur) => ({ ...cur, value: item.code }))}>
                  {item.name}
                </Button>
              ))}
            </Button.Group>
          </Form.Field>

          <Form.Field>
            <label style={{ display: "flex" }}>
              <Checkbox checked={currentLower.use} onChange={() => setLower((cur) => ({ ...cur, use: !cur.use }))} />
              <span style={{ marginLeft: 12 }}>Hide Target / Price if lower than</span>
            </label>
            <Form.Input
              placeholder="0"
              value={currentLower.value}
              onChange={(event) => {
                const { value } = event.target;
                if (/^\d*\.?\d*$/.test(value)) {
                  setLower((cur) => ({ ...cur, value }));
                }
              }}
              onKeyPress={handleKeyPress}
            />
          </Form.Field>

          <Form.Field>
            <label style={{ display: "flex" }}>
              <Checkbox checked={currentNoter.use} onChange={() => setNoter((cur) => ({ ...cur, use: !cur.use }))} />
              <span style={{ marginLeft: 12 }}>Show Note</span>
            </label>
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => onVisibleChange(false)}>X</Button>
        <Button positive content="Save" onClick={handleClickSave} />
      </Modal.Actions>
    </>
  );
};

export default Setting;
