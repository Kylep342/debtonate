
export interface Graph {
  lines: Array<Object>;
}

export interface GraphConfig {
  id: string;
  color: Function;
  graphs: Object;
  header: Function;
  lineName: Function;
  subheader: Function;
  x: Function;
  xLabel?: Function;
  xFormat?: Function;
  xScale: Function;
  y: Function;
  yFormat?: Function;
  yLabel?: Function;
  yScale: Function;
}

