export type Point = {
  x: number
  y: number
};

export type Graph = {
  config: {
    maxX: number
    maxY: number
  },
  lines: Record<string, Point[]>
};

export type Graphs = Record<string, Graph>;

export type GraphConfig = {
  id: string
  color: Function
  graphs: Graphs
  header: Function
  lineName: Function
  subheader: Function
  x: Function
  xLabel: Function
  xFormat: Function
  xScale: Function
  y: Function
  yFormat: Function
  yLabel: Function
  yScale: Function
};

export type TooltipConfig = {
  xLabel: string
  xFormat: Function
  lines: Function
  color: Function
  lineName: Function
  yFormat: Function
};
