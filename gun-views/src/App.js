import { useEffect, useState, useRef } from 'react';
import styles from './styles/App.module.css';
import * as d3 from "d3";
import DivergentChart from './components/DivergentChart.js';
import { Outlet, Link } from "react-router-dom"

function App() {
  const [politiciansData, setPoliticiansData] = useState([])
  const [lobbyistsData, setLobbyistsData] = useState([])
  const divRef = useRef(null)
  const [politiciansLoaded, setPoliticiansLoaded] = useState(false);
  const [lobbyistsLoaded, setLobbyistsLoaded] = useState(false);
  const [active, setActive] = useState('lobbyist');

  useEffect(() => {
    let dataArray = [];
    const settingState = async () => {
      const response = await d3.tsv("/opensecrets.tsv", function (d) {
        if ((dollarsToNum(d['Total from Gun Control']) !== 0) || (dollarsToNum(d['Total From Gun Rights']) !== 0)) {
          dataArray.push({
            'name': d.Name,
            'party': d.Party,
            'state': convState(d.Distid),
            'distid': d.Distid,
            'num_gun_control': (dollarsToNum(d['Total from Gun Control'])) * -1,
            'num_gun_rights': dollarsToNum(d['Total From Gun Rights']),
            'dollars_gun_control': d['Total from Gun Control'],
            'dollars_gun_rights': d['Total From Gun Rights'],
          })
        }
        setPoliticiansData(dataArray)
        setPoliticiansLoaded(true);
      })
    }
    settingState();
  }, [])

  useEffect(() => {
    const dataArray = [];
    const settingState = async () => {
      const response = await d3.csv("/lobbying.csv", function (d) {
        dataArray.push({
          year: +d.Year,
          num_gun_control: (dollarsToNum(d["Gun Control"])),
          dollars_gun_control: d["Gun Control"],
          num_gun_rights: (dollarsToNum(d["Gun Rights"])),
          dollars_gun_rights: d["Gun Rights"],
          num_gun_manufacturing: (dollarsToNum(d["Gun Manufacturing"])),
          dollars_gun_manufacturing: d["Gun Manufacturing"],
        })
        setLobbyistsData(dataArray)
        setLobbyistsLoaded(true);
      })
    }
    settingState();
  }, [])

  function dollarsToNum(amount) {
    const num = amount.substring(1);
    const nocommas = num.replaceAll(',', '')
    return +nocommas;
  }

  function convState(id) {
    return id.slice(0, 2)
  }

  return (
    <div className={styles.app} ref={divRef}>
      <h1>Gun Rights vs. Gun Control Spending</h1>
      <p className={styles.Source}>All data sourced from OpenSecrets.org | Made by Rena using D3 + React</p>
      <nav>
        <ul>
          <li>
            <Link to="/"
              onClick={() => setActive('lobbyist')}
              className={active === 'lobbyist' ? styles.Active__link : null}>
              Lobbyist Group Spending
            </Link>
          </li>
          <li>
            <Link to="politicians"
              onClick={() => setActive('politicians')}
              className={active === 'politicians' ? styles.Active__link : null}>
              Funding Sources by Congressmen
            </Link>
          </li>
        </ul>
      </nav>
      {(politiciansLoaded && lobbyistsLoaded) ?
        <Outlet context={{ politiciansData, lobbyistsData }} /> : 'Loading data...'
      }
    </div>
  );
}

export default App;
