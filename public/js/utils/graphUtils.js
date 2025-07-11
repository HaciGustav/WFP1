export const margin = { top: 20, right: 30, bottom: 30, left: 30 };
export const dx = 100;

export const getContainerSize = () => {
  const container = document.getElementById("graph");
  return container.getBoundingClientRect();
};

export const getGraphSize = (contWidth, contHeight) => {
  const width = contWidth;
  -margin.left - margin.right;
  const height = contHeight;
  -margin.top - margin.bottom;
  return { width, height };
};

// Create line grid
export const createLineGrid = (zoomContainer) => {
  const gridSize = 50;
  const gridGroup = zoomContainer
    .append("g")
    .attr("class", "grid-group")
    .attr("opacity", 0.3);

  // Clear existing grid
  gridGroup.selectAll("*").remove();

  // Calculate grid bounds (larger than viewport to handle panning)
  const gridBounds = 2000;
  const numLines = Math.ceil(gridBounds / gridSize);

  // Vertical lines
  for (let i = -numLines; i <= numLines; i++) {
    gridGroup
      .append("line")
      .attr("x1", i * gridSize)
      .attr("y1", -gridBounds)
      .attr("x2", i * gridSize)
      .attr("y2", gridBounds)
      .attr("stroke", "#ddd")
      .attr("stroke-width", 1);
  }

  // Horizontal lines
  for (let i = -numLines; i <= numLines; i++) {
    gridGroup
      .append("line")
      .attr("x1", -gridBounds)
      .attr("y1", i * gridSize)
      .attr("x2", gridBounds)
      .attr("y2", i * gridSize)
      .attr("stroke", "#ddd")
      .attr("stroke-width", 1);
  }
};

// Create dot grid
const createDotGrid = (zoomContainer) => {
  const gridSize = 30;
  const gridGroup = zoomContainer
    .append("g")
    .attr("class", "grid-group")
    .attr("opacity", 0.5);
  // Clear existing grid
  gridGroup.selectAll("*").remove();

  // Calculate grid bounds (larger than viewport to handle panning)
  const gridBounds = 2000;
  const numDots = Math.ceil(gridBounds / gridSize);

  // Create dots at grid intersections
  for (let i = -numDots; i <= numDots; i++) {
    for (let j = -numDots; j <= numDots; j++) {
      gridGroup
        .append("circle")
        .attr("cx", i * gridSize)
        .attr("cy", j * gridSize)
        .attr("r", 2)
        .attr("fill", "#ddd")
        .attr("opacity", 1);
    }
  }
};

export const createGrid = (zoomContainer) => {
  // createLineGrid(zoomContainer);
  createDotGrid(zoomContainer);
};

export const initializeZoomBehavior = (svg) => {
  const zoomContainer = svg.select(".zoom-container");

  const zoom = d3
    .zoom()
    .scaleExtent([0.1, 10]) // Set min and max zoom levels
    .on("zoom", () => {
      const event = d3.event;
      zoomContainer.attr("transform", event.transform);
    });

  svg.call(zoom);
};

export const handleClickNodeExpand = (d) => {
  const nodeID = d.data.id;
  const selectedNode = d3.select(`#${nodeID}`);

  const isExpanded = selectedNode.attr("data-expanded") === "true";
  if (isExpanded) {
    // Collapse
    hideCodeBlock(selectedNode);
  } else {
    // Expand
    showCodeBlock(selectedNode);
  }
};

const showCodeBlock = (selectedNode) => {
  const nodeDiv = selectedNode.select(".node-shape");
  nodeDiv
    .append("pre")
    .append("code")
    .text((d) => d.data.text);

  const codeHolder = nodeDiv.select("pre");

  const codeWidth = codeHolder.style("width");
  const codeHeight = codeHolder.style("height");

  const tempWidth = parseInt(codeWidth) + 20;
  const tempHeight = parseInt(codeHeight) + 50;
  const newWidth = tempWidth > 100 ? tempWidth : 100;
  const newHeight = tempHeight > 50 ? tempHeight : 50;

  const divMovingWidth = newWidth / 2;

  selectedNode
    .transition()
    .duration(300)
    .attr("data-expanded", true)
    .attr("width", newWidth)
    .attr("height", newHeight)
    .attr("x", -divMovingWidth)
    .attr("y", 0);

  bringNodeToFront(selectedNode);
};

export const hideCodeBlock = (selectedNode) => {
  const nodeDiv = selectedNode.select(".node-shape");
  const codeHolder = nodeDiv.select("pre");
  selectedNode
    .attr("data-expanded", false)
    .transition()
    .duration(300)
    .attr("width", 100)
    .attr("height", 60)
    .attr("x", -50)
    .attr("y", 0);

  codeHolder.remove("pre");
};

export const hideAllCodeBlocks = () => {
  const allNodes = d3.selectAll('[data-expanded="true"]');
  allNodes.each(function (d) {
    hideCodeBlock(d3.select(this));
  });
};

const bringNodeToFront = (selectedNode) => {
  const nodeWrapper = selectedNode.select(function () {
    return this.parentNode;
  });

  nodeWrapper.raise();
};
