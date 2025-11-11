import * as d3 from 'd3';

// Core drawable types, one for each type of graph
// Arc for DonutGraphContent
export type Arc = {label: string; value: number; color?: string;};
// Point for LineGraphContent
export type Point = {x: number, y: number};

// Drawable is the multitype for the drawable types
export type Drawable = Point | Arc;

export type ChartSeries<TDrawable extends Drawable> = Record<string, TDrawable[]>;

export type LineGraphContent = {
  config: {
    maxX: number
    maxY: number
  },
  lines: ChartSeries<Point>,
};

export type DonutGraphContent = {
  config: {},
  lines: ChartSeries<Arc>,
};

export type GraphType = 'line' | 'donut' | 'bar' | 'scatter';

export type GraphContent = DonutGraphContent | LineGraphContent;

export type Graphs<TGraphContent extends GraphContent> = Record<string, TGraphContent>;

export type D3Container = d3.Selection<SVGGElement, unknown, HTMLElement, any>;

/**
 * Type definition for a generic drawer function.
 * It takes the D3 container and the specific graph data, and returns void.
 * TGraph ensures the correct structure (e.g., LineGraph) is passed.
 */
export type DrawerFunction<TGraphContent extends GraphContent> = (
  container: D3Container,
  graph: TGraphContent,
) => void;


export type GraphConfig<TGraphContent extends GraphContent = GraphContent> = {
  id: string;
  type: GraphType;
  drawer: DrawerFunction<TGraphContent>;
  color: (id: string) => string;
  graphs?: Graphs<TGraphContent>;
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

export type TooltipConfig = {
  xLabel: string;
  xFormat: (index: number) => string;
  lines: Record<string, Point[]>;
  color: (id: string) => string;
  lineName: (id: string) => string;
  yFormat: (value: number) => string;
};

export type TooltipPosition = { left: number, top: number };
export type TooltipSize = { width: number, height: number };
