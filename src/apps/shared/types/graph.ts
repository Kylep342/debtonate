export type Arc = {
  label: string;
  value: number;
  color?: string;
};

export type Point = {
  x: number
  y: number
};

export type LineGraph = {
  config: {
    maxX: number
    maxY: number
  },
  lines: Record<string, Point[]>
};

export type DonutGraph = {
  config: {},
  lines: Record<string, Arc[]>
};

export type Graph = DonutGraph | LineGraph

export type Graphs = Record<string, Graph>;

export type GraphConfig = {
  id: string;
  color: (id: string) => string;
  graphs?: Graphs;
  header: (id: string) => string;
  lineName: (id: string) => string;
  subheader: (id: string) => string;
  xLabel: () => string;
  yLabel: () => string;
  x: (value: any) => any;
  y: (value: any) => any;
  xFormat: (value: number | Date) => string;
  yFormat: (value: number) => string;
  xScale: () => d3.ScaleTime<number, number> | d3.ScaleLinear<number, number>;
  yScale: () => d3.ScaleLinear<number, number>;
};

export type DonutGraphCobfig = {}

export type TooltipConfig = {
  xLabel: string;
  xFormat: (index: number) => string;
  lines: Record<string, Point[]>;
  color: (id: string) => string;
  lineName: (id: string) => string;
  yFormat: (value: number) => string;
};
