import React from 'react';
import classNames from 'classnames';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { string, number } from 'prop-types';
import { times, reduce } from 'lodash';

import formatCurrency from 'account/util/formatCurrency';
import chartDataShape from 'account/shapes/chartDataShape';

import SectionLabel from '../SectionLabel';

import styles from './BreakdownChart.scss';

const NEO_COLORS = ['#5ebb46', '#b5d433', '#0b99e3'];
const ARK_COLORS = ['#d20303', '#e9564b', '#e9564b'];

function reduceSum(data) {
  return reduce(data, (sum, datum) => sum + datum.value, 0);
}

export default class BreakdownChart extends React.PureComponent {
  static propTypes = {
    className: string,
    data: chartDataShape.isRequired,
    currency: string.isRequired,
    threshold: number.isRequired,
    coinType: number.isRequired
  };

  static defaultProps = {
    className: null
  };

  render() {
    const data = this.getData();
    const { coinType } = this.props;
    let colors;
    if (coinType === 888) colors = NEO_COLORS;
    else if (coinType === 111) colors = ARK_COLORS;

    return (
      <ResponsiveContainer
        width="100%"
        className={classNames(styles.breakdownChart, this.props.className)}
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="symbol"
            innerRadius="50%"
            outerRadius="65%"
            startAngle={90}
            endAngle={-270}
            label={SectionLabel}
            labelLine={false}
            isAnimationActive={false}
          >
            {times(data.length, (index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
                stroke={colors[index]}
              />
            ))}
          </Pie>
          <Tooltip formatter={this.formatValue} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  getData = () => {
    const { threshold } = this.props;
    const data = [...this.props.data];

    const totalSum = reduceSum(data);
    if (totalSum === 0) {
      return [];
    }

    const filteredData = data.filter((item) => item.value / totalSum >= threshold);
    const restData = data.filter((item) => item.value / totalSum < threshold);

    const others = { symbol: 'OTHERS', value: reduceSum(restData) };
    if (others.value / totalSum < threshold) {
      return [...filteredData];
    } else {
      return [...filteredData, restData];
    }
  };

  formatValue = (value) => {
    return formatCurrency(value, this.props.currency);
  };
}
