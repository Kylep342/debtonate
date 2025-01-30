export interface Point {
  x: number;
  y: number;
};

export interface Graph {
  config: {
    maxX: number;
    maxY: number
  },
  lines: Record<string, Point[]>
};

export type Graphs = Record<string, Graph>;

export interface GraphConfig {
  id: string;
  color: Function;
  graphs: Graphs;
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
};
