import React from "react";
import { Button, Grid, Modal, Popup, Table } from "semantic-ui-react";
import { binanceService } from "services/binance";
import { initial } from "./storage";
import BinancePopup from "./Popup";
import BinanceSetting from "./Setting";
import { Link } from "react-router-dom";

export const COIN = "binance/coins";
const SORT = "binance/sorts";
const DATE = "binance/dates";
const COLOR = "binance/color";
const LOWER = "binance/lower";
const NOTER = "binance/noter";

const Binance = () => {
  const [refreshTime, setRefreshTime] = React.useState(localStorage.getItem(DATE));

  const [isOpen, setIsOpen] = React.useState(false);
  const [chosenItem, setChosenItem] = React.useState();

  const [coinList, setCoinList] = React.useState(initial.coinList(COIN));

  const [coinSort, setCoinSort] = React.useState(initial.coinSort(SORT));
  const [sortBy, sortType] = coinSort.split("_");

  const [color, setColor] = React.useState(initial.color(COLOR));
  const [lower, setLower] = React.useState(initial.lower(LOWER));
  const [noter, setNoter] = React.useState(initial.noter(NOTER));
  const [isOpenSetting, setIsOpenSetting] = React.useState(false);

  React.useEffect(() => {
    const [sortBy, sortType] = coinSort.split("_");
    setCoinList((current) =>
      current.slice().sort((a, b) => (Boolean(Number(sortType)) ^ (a[sortBy] > b[sortBy]) ? -1 : 1)),
    );
  }, [coinSort]);

  const handleSuccessSave = (item) => {
    setCoinList((current) => {
      const newList = current.slice();
      const index = current.findIndex((next) => next.symbol === item.symbol);
      if (index > -1) newList[index] = item;
      else newList.push(item);
      return newList;
    });
  };

  const handleRemoveItem = (item) => {
    setCoinList((current) => current.slice().filter((next) => next.symbol !== item.symbol));
  };

  const handleChangeSort = (key) => {
    if (sortBy === key) {
      setCoinSort(`${sortBy}_${(Number(sortType) + 1) % 2}`);
    } else {
      setCoinSort(`${key}_${1}`);
    }
  };

  const handleRefreshAll = () => {
    const refresh = new Date().toString();
    setRefreshTime(refresh);
    localStorage.setItem(DATE, refresh);

    coinList.forEach((item) => {
      binanceService
        .fetchPrice(item)
        .then(({ data: { symbol, price } }) => {
          handleSuccessSave({
            ...item,
            symbol,
            price,
            average: Number((Number(item.target) / price).toFixed(6)),
          });
        })
        .catch(console.warn);
    });
  };

  React.useEffect(() => {
    localStorage.setItem(COIN, JSON.stringify(coinList));
    localStorage.setItem(SORT, coinSort);
    localStorage.setItem(COLOR, JSON.stringify(color));
    localStorage.setItem(LOWER, JSON.stringify(lower));
    localStorage.setItem(NOTER, JSON.stringify(noter));
  }, [coinList, coinSort, color, lower, noter]);

  const Sort = ({ item }) => (
    <span
      style={{
        display: "inline-flex",
        width: 12,
        marginLeft: 8,
      }}>
      {sortBy === item && sortType === "1" && "⋎"}
      {sortBy === item && sortType === "0" && "⋏"}
    </span>
  );

  const averageMax = Math.max(...coinList.map((item) => item.average));

  return (
    <div className="app">
      <Grid>
        <Grid.Row>
          <Grid.Column style={{ flex: 1 }}>
            <Button
              positive
              onClick={() => {
                setIsOpen(true);
                setChosenItem();
              }}>
              ADD
            </Button>
            <Button onClick={handleRefreshAll}>REFRESH</Button>
            {refreshTime}

            <Button
              style={{ marginLeft: 20 }}
              color="brown"
              onClick={() => {
                setIsOpenSetting(true);
              }}>
              SETTING
            </Button>

            <Link to="/sync">
              <Button color="blue">SYNC</Button>
            </Link>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell style={{ cursor: "pointer" }} onClick={() => handleChangeSort("coin")}>
                    Coin
                    <Sort item="coin" />
                  </Table.HeaderCell>
                  <Table.HeaderCell>Market</Table.HeaderCell>
                  <Table.HeaderCell>Price</Table.HeaderCell>
                  <Table.HeaderCell>Target</Table.HeaderCell>
                  <Table.HeaderCell style={{ cursor: "pointer" }} onClick={() => handleChangeSort("average")}>
                    Target / Price
                    <Sort item="average" />
                  </Table.HeaderCell>
                  {noter.use && <Table.HeaderCell>Note</Table.HeaderCell>}
                  <Table.HeaderCell></Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {coinList
                  .filter((item) => (lower.use ? item.average >= Number(lower.value) : true))
                  .map((item) => (
                    <Table.Row key={item.symbol}>
                      <Table.Cell>
                        <a
                          href={`https://www.binance.com/en/trade/${item.coin}_${item.market}`}
                          target="_blank"
                          rel="noreferrer">
                          {item.coin}
                        </a>
                      </Table.Cell>
                      <Table.Cell>{item.market}</Table.Cell>
                      <Table.Cell>{item.price}</Table.Cell>
                      <Table.Cell>{item.target}</Table.Cell>
                      <Table.Cell style={{ display: "flex", justifyContent: "space-between" }}>
                        {item.average}
                        {color.use && (
                          <Button
                            size="mini"
                            color={color.value}
                            style={{ width: 80, opacity: item.average / averageMax }}>
                            ​{"​"}
                          </Button>
                        )}
                      </Table.Cell>
                      {noter.use && <Table.Cell>{item.note}</Table.Cell>}
                      <Table.Cell>
                        <Button
                          basic
                          size="mini"
                          color="purple"
                          onClick={() => {
                            setIsOpen(true);
                            setChosenItem(item);
                          }}>
                          Edit
                        </Button>

                        <Popup
                          pinned
                          on="click"
                          position="top center"
                          content={
                            <Button size="mini" negative onClick={() => handleRemoveItem(item)}>
                              OK
                            </Button>
                          }
                          trigger={
                            <Button basic size="mini" negative>
                              Remove
                            </Button>
                          }
                        />

                        {item.note && !noter.use && (
                          <Popup position="top right" content={item.note} trigger={<Button size="mini">?</Button>} />
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                {coinList.length === 0 && (
                  <Table.Row>
                    <Table.Cell colSpan="5" textAlign="center">
                      EMPTY
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Modal size="tiny" centered={false} open={isOpen} onClose={() => setIsOpen(false)}>
        <BinancePopup item={chosenItem} onSuccess={handleSuccessSave} onVisibleChange={setIsOpen} />
      </Modal>

      <Modal size="tiny" centered={false} open={isOpenSetting} onClose={() => setIsOpenSetting(false)}>
        <BinanceSetting
          color={color}
          lower={lower}
          noter={noter}
          onSuccess={({ currentColor, currentLower, currentNoter }) => {
            setColor(currentColor);
            setLower(currentLower);
            setNoter(currentNoter);
          }}
          onVisibleChange={setIsOpenSetting}
        />
      </Modal>
    </div>
  );
};

export default Binance;
