import React, {useEffect, useState, useRef} from 'react';
import * as d3 from "d3"
import '../../../static/css/index.css';
import { RADIUS, drawTrustGraph } from './DrawTrustGraph';

const TrustGraph = ({nodes, links, width, height}) => {
 
    const canvasRef = useRef(null);
  
    useEffect(() => {
      // set dimension of the canvas element
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
  
      if (!context) {
        return;
      }
  
      // run d3-force to find the position of nodes on the canvas
      d3.forceSimulation(nodes)
  
        // list of forces we apply to get node positions
        .force(
          'link',
          d3.forceLink(links).id((d) => d.id)
        )
        //prevents nodes from overlapping, radius attribute defines how long the edges are
        .force('collide', d3.forceCollide().radius(5 * RADIUS))
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(width / 2, height / 2))
  
        // at each iteration of the simulation, draw the network diagram with the new node positions
        .on('tick', () => {
          drawTrustGraph(context, width, height, nodes, links);
        });
    }, [width, height, nodes, links]);
  
    return (
      <div>
        <canvas
          ref={canvasRef}
          style={{
            width,
            height,
          }}
          width={width}
          height={height}
        />
      </div>
    );
  };
  
export default TrustGraph;

