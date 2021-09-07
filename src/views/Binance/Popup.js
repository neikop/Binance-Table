import React from "react";
import { Button, Form, Modal } from "semantic-ui-react";
import { binanceService } from "services/binance";

const BinancePopup = ({ item, onSuccess, onVisibleChange }) => {
  const [coin, setCoin] = React.useState("");
  const [market, setMarket] = React.useState("");
  const [target, setTarget] = React.useState("");
  const [note, setNote] = React.useState("");

  const [error, setError] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (item) {
      setCoin(item.coin);
      setMarket(item.market);
      setTarget(item.target);
      setNote(item.note);
    } else {
      setCoin("");
      setMarket("");
      setTarget("");
      setNote("");
    }
  }, [item]);

  const handleClickSave = () => {
    const error = {
      coin: !Boolean(coin.trim()),
      market: !Boolean(coin.trim()),
      target: !/\d+/.test(target),
    };
    setError(error);
    if (!Object.values(error).some((isError) => isError)) {
      setIsLoading(true);
      binanceService
        .fetchPrice({ coin, market })
        .then(({ data: { symbol, price } }) => {
          onSuccess({
            coin,
            market,
            target,
            note,
            symbol,
            price,
            average: Number((Number(target) / price).toFixed(6)),
          });
          setIsLoading(false);
          onVisibleChange(false);
        })
        .catch(console.warn);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleClickSave();
    }
  };

  return (
    <>
      <Modal.Header>{item ? "Edit" : "Add"}</Modal.Header>
      <Modal.Content>
        <Form widths="equal">
          <Form.Field required error={error.coin}>
            <label>Coin</label>
            <Form.Input
              placeholder="ETH"
              value={coin}
              onChange={(event) => {
                const { value } = event.target;
                setCoin(value.trim().toUpperCase());
                setError((error) => ({
                  ...error,
                  coin: !Boolean(value.trim()),
                }));
              }}
              onKeyPress={handleKeyPress}
            />
          </Form.Field>
          <Form.Field required error={error.market}>
            <label>Market</label>
            <Form.Input
              placeholder="BTC"
              value={market}
              onChange={(event) => {
                const { value } = event.target;
                setMarket(value.trim().toUpperCase());
                setError((error) => ({
                  ...error,
                  market: !Boolean(value.trim()),
                }));
              }}
              onKeyPress={handleKeyPress}
            />
          </Form.Field>
          <Form.Field required error={error.target}>
            <label>Target</label>
            <Form.Input
              placeholder="0.0001"
              value={target}
              onChange={(event) => {
                const { value } = event.target;
                if (/^\d*\.?\d*$/.test(value)) {
                  setTarget(value);
                  setError((error) => ({
                    ...error,
                    target: !/\d+/.test(value),
                  }));
                }
              }}
              onKeyPress={handleKeyPress}
            />
          </Form.Field>
          <Form.Field>
            <label>Note</label>
            <Form.TextArea
              value={note}
              onChange={(event) => {
                const { value } = event.target;
                setNote(value);
              }}
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => onVisibleChange(false)}>X</Button>
        <Button positive content="Save" loading={isLoading} onClick={handleClickSave} />
      </Modal.Actions>
    </>
  );
};

export default BinancePopup;
