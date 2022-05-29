import { useEffect, useState, useRef, useMemo } from 'react';
import styles from '../styles/App.module.css';
import * as d3 from "d3";
import { scaleBand, ticks } from 'd3';
import { useOutletContext } from "react-router-dom";
import useResizer from '../hooks/Resizer.js'

function HistoricalChart() {
  const { lobbyistsData } = useOutletContext();
  const lineRef = useRef();
  const width = useResizer(lineRef)
  const [height, setHeight] = useState(500);
  const [tooltip, setTooltip] = useState({
    visible: false,
    group: '',
    year: '',
    number: '',
    xPos: '',
    yPos: '',
  })

  const spacing = {
    leftMargin: 36,
    padding: 36,
  }

  const xScale = d3.scaleLinear()
    .domain([1997, 2022])
    .range([spacing.leftMargin, (width - spacing.padding)])

  const yScale = d3.scaleLinear()
    .domain(findExtent())
    .range([(height), (spacing.padding)])

  const xTicks = useMemo(() => {
    return xScale.ticks()
      .map(value => ({
        value,
        xOffset: xScale(value)
      }))
  })

  const yTicks = useMemo(() => {
    return yScale.ticks()
      .map(value => ({
        value,
        yOffset: yScale(value)
      }))
  })

  function totalSum(group) {
    let sum = 0;
    switch (group) {
      case 'rights':
        lobbyistsData.map((value) => (
          sum += value.num_gun_rights
        ))
        return sum.toLocaleString();
      case 'control':
        lobbyistsData.map((value) => (
          sum += value.num_gun_control
        ))
        return sum.toLocaleString();
      case 'manufacturing':
        lobbyistsData.map((value) => (
          sum += value.num_gun_manufacturing
        ))
        return sum.toLocaleString();
      default:
        console.log('Error')
    }
  }

  function findExtent() {
    let convertedArray = [];
    lobbyistsData.map((d) => {
      convertedArray.push(d.num_gun_control, d.num_gun_rights)
    })
    const extent = d3.extent(convertedArray)
    return [extent[0] - 1000000, extent[1] + 1000000];
  }

  function lineFactory(d, i, coord, group) {
    if (group === 'control') {
      switch (coord) {
        case 'x1':
          return `${(i === (lobbyistsData.length - 1)) ? 0 : xScale(d.year)}`;
        case 'y1':
          return `${(i === (lobbyistsData.length - 1)) ? 0 : yScale(d.num_gun_control)}`;
        case 'x2':
          return `${(i + 1) !== lobbyistsData.length && xScale(lobbyistsData[i + 1].year)}`;
        case 'y2':
          return `${(i + 1) !== lobbyistsData.length && yScale(lobbyistsData[i + 1].num_gun_control)}`;
        default:
          console.log('Error')
      }
    }
    if (group === 'rights') {
      switch (coord) {
        case 'x1':
          return `${(i === (lobbyistsData.length - 1)) ? 0 : xScale(d.year)}`;
        case 'y1':
          return `${(i === (lobbyistsData.length - 1)) ? 0 : yScale(d.num_gun_rights)}`;
        case 'x2':
          return `${(i + 1) !== lobbyistsData.length && xScale(lobbyistsData[i + 1].year)}`;
        case 'y2':
          return `${(i + 1) !== lobbyistsData.length && yScale(lobbyistsData[i + 1].num_gun_rights)}`;
        default:
          console.log('Error')
      }
    }
    if (group === 'manufacturing') {
      switch (coord) {
        case 'x1':
          return `${(i === (lobbyistsData.length - 1)) ? 0 : xScale(d.year)}`;
        case 'y1':
          return `${(i === (lobbyistsData.length - 1)) ? 0 : yScale(d.num_gun_manufacturing)}`;
        case 'x2':
          return `${(i + 1) !== lobbyistsData.length && xScale(lobbyistsData[i + 1].year)}`;
        case 'y2':
          return `${(i + 1) !== lobbyistsData.length && yScale(lobbyistsData[i + 1].num_gun_manufacturing)}`;
        default:
          console.log('Error')
      }
    }
  }

  function showTooltip(e, group) {
    const year = +e.target.id;
    const obj = lobbyistsData.filter((d) => d.year === year);
    switch (group) {
      case 'gunControl':
        return setTooltip({
          visible: true,
          group: 'Gun Control Lobbyists',
          year: obj[0].year,
          number: obj[0].num_gun_control,
          xPos: xScale(obj[0].year),
          yPos: yScale(obj[0].num_gun_control),
        })
      case 'gunRights':
        return setTooltip({
          visible: true,
          group: 'Gun Rights Lobbyists',
          year: obj[0].year,
          number: obj[0].num_gun_rights,
          xPos: xScale(obj[0].year),
          yPos: yScale(obj[0].num_gun_rights),
        })
      case 'gunManufacturing':
        return setTooltip({
          visible: true,
          group: 'Gun Manufacturing Lobbyists',
          year: obj[0].year,
          number: obj[0].num_gun_manufacturing,
          xPos: xScale(obj[0].year),
          yPos: yScale(obj[0].num_gun_manufacturing),
        })
      default:
        console.log('Error')
    }

  }

  return (
    <div ref={lineRef}>
      <header>
        <h3>Chart that shows total money spent by lobbyist groups who are for gun rights, gun control, or gun manufacturing from 1998 - 2022.
        </h3>
      </header>
      <section className={styles.Totals}>
        <div className={styles.Total__container}>
          <div className={styles.Control__totals}>
            <h4>Gun Control Total Spend</h4>
            <p className={styles.BigTotal}>${totalSum('control')}</p>
          </div>
          <div className={styles.Rights__totals}>
            <h4>Gun Rights Total Spend</h4><p className={styles.BigTotal}>${totalSum('rights')}</p>
          </div>
          <div className={styles.Manufacturing__totals}>
            <h4>Gun Manufacturing Total Spend</h4><p className={styles.BigTotal}>${totalSum('manufacturing')}</p>
          </div>
        </div>
      </section>
      {width !== undefined &&
        <div className={styles.Tooltip__wrapper} styles={"width:" + width + 'px' + ";" + "height:" + height + 'px'}>
          {tooltip.visible && <div
            className={styles.Tooltip__lobbyist}
            style={{
              position: 'absolute',
              left: tooltip.xPos - 20,
              top: tooltip.yPos - 110
            }}
          >
            <p className={styles.Tooltip__small}>
              {tooltip.group}</p>
            <p className={styles.Tooltip__title}>
              {tooltip.year}</p>
            <p>Total Spend: <b>{'$' + (tooltip.number).toLocaleString()}</b></p>
          </div>}
          <svg width={width} height={height} y="24" x="400">
            <g id="gun-control">
              {lobbyistsData.map((d, i) => (
                <g id="gun-control">
                  <line
                    key={d.year + "_gun_control"}
                    x1={lineFactory(d, i, 'x1', 'control')}
                    y1={lineFactory(d, i, 'y1', 'control')}
                    x2={lineFactory(d, i, 'x2', 'control')}
                    y2={lineFactory(d, i, 'y2', 'control')}
                    stroke="#76ABDD" />
                </g>))}
              {lobbyistsData.map((d) => (
                <g id={d.year}
                  key={d.year + 'gunControl'}
                  onMouseEnter={(e, group) => showTooltip(e, 'gunControl')}
                  onMouseLeave={() => setTooltip({
                    ...tooltip,
                    visible: false,
                    year: '',
                  })}>
                  <circle
                    id={d.year}
                    key={d.year}
                    r="4"
                    fill="#347EC3"
                    cy={yScale(d.num_gun_control)}
                    cx={xScale(d.year)}
                  />
                </g>
              ))}</g>
            <g id="gun-rights">
              {lobbyistsData.map((d, i) => (
                <line
                  key={d.year + "_gun_rights"}
                  x1={lineFactory(d, i, 'x1', 'rights')}
                  y1={lineFactory(d, i, 'y1', 'rights')}
                  x2={lineFactory(d, i, 'x2', 'rights')}
                  y2={lineFactory(d, i, 'y2', 'rights')}
                  stroke="#F591C1" />))}
              {lobbyistsData.map((d) => (
                <g id={d.year}
                  key={d.year + 'gunRights'}
                  onMouseEnter={(e, group) => showTooltip(e, 'gunRights')}
                  onMouseLeave={() => setTooltip({
                    ...tooltip,
                    visible: false,
                    year: '',
                  })}>
                  <circle
                    id={d.year}
                    key={d.year}
                    r="4"
                    fill="#EC4997"
                    cy={yScale(d.num_gun_rights)}
                    cx={xScale(d.year)}
                  /></g>
              ))}</g>
            <g id="gun-manufacturing">
              {lobbyistsData.map((d, i) => (<line
                key={d.year + "_gun_manufacturing"}
                x1={lineFactory(d, i, 'x1', 'manufacturing')}
                y1={lineFactory(d, i, 'y1', 'manufacturing')}
                x2={lineFactory(d, i, 'x2', 'manufacturing')}
                y2={lineFactory(d, i, 'y2', 'manufacturing')}
                stroke="#FFCF86" />))}
              {lobbyistsData.map((d) => (
                <g id={d.year}
                  key={d.year + 'gunManufacturing'}
                  onMouseEnter={(e, group) => showTooltip(e, 'gunManufacturing')}
                  onMouseLeave={() => setTooltip({
                    ...tooltip,
                    visible: false,
                    year: '',
                  })}>
                  <circle
                    id={d.year}
                    key={d.year}
                    r="4"
                    fill="#EEAD4B"
                    cy={yScale(d.num_gun_manufacturing)}
                    cx={xScale(d.year)}
                  /></g>
              ))}</g>
            <g id="xAxis"><path
              d={"M " + (spacing.leftMargin) + " " + (height - 24) + " H " + width}
              stroke="#BDC0D3"
            />
              {xTicks.map(({ value, xOffset }) => (
                <g
                  key={value}
                  transform={`translate(${xOffset},0)`}
                >
                  <line
                    y1={height - 24}
                    y2={height - 16}
                    stroke="#BDC0D3" />
                  <text
                    key={value}
                    fill="#000"
                    y={height}
                    textAnchor="middle" >{value}</text>
                </g>
              ))}</g>
            <g id="yAxis"><path
              d={"M " + (spacing.leftMargin) + " 16 h 0 v " + (height - 40)}
              stroke="#BDC0D3"
            />
              {yTicks.map(({ value, yOffset }) => (
                <g
                  key={value}
                  transform={`translate(0,${yOffset})`}
                >
                  <line
                    x1="24"
                    x2="36"
                    stroke="#BDC0D3" />
                  <text
                    key={value}
                    x="0"
                    y="3"
                    fill="#000"
                    textAnchor="left" >
                    {value === 0 ? value + 'm' : (value.toString()).slice(0, -6) + 'm'}
                  </text>
                </g>
              ))}</g>
          </svg>
        </div>
      }
    </div >
  );
}

export default HistoricalChart;