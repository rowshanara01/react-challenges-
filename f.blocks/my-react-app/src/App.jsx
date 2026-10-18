import React, { useState } from "react";
import "./App.css";

const App = () => {
  // State to manage all blocks on the page.
  // Starts with a single root block positioned in the center of the screen.
  const [blocks, setBlocks] = useState([
    {
      id: Date.now(), // Unique identifier for the block
      position: {
        x: window.innerWidth / 2 - 50, // Center horizontally
        y: window.innerHeight / 2 - 50, // Center vertically
      },
      parentId: null, // The first block has no parent
    },
  ]);

  // Generates a random position within the screen boundaries for new blocks.
  const getRandomPosition = () => ({
    x: Math.random() * (window.innerWidth - 150), // Ensure blocks don't go offscreen
    y: Math.random() * (window.innerHeight - 150),
  });

  // Adds a new block as a child of the block identified by `parentId`.
  const addBlock = (parentId) => {
    setBlocks((prevBlocks) => [
      ...prevBlocks,
      {
        id: Date.now(), // Unique ID for the new block
        position: getRandomPosition(), // Random position
        parentId, // Links the block to its parent
      },
    ]);
  };

  // Called when a drag operation begins.
  // Saves the `blockId` of the dragged block in the `dataTransfer` object.
  const onDragStart = (e, blockId) => {
    e.dataTransfer.setData("blockId", blockId); // Store the ID of the block being dragged
  };

  // Called when the dragged block is over a valid drop target (the page).
  // Prevents the default behavior to allow dropping.
  const onDragOver = (e) => {
    e.preventDefault(); // Necessary to allow drop events
  };

  // Handles the drop event.
  // Updates the position of the dragged block based on the mouse's drop location.
  const onDrop = (e) => {
    const blockId = e.dataTransfer.getData("blockId"); // Retrieve the block's ID from the drag event
    const newPosition = { x: e.clientX - 50, y: e.clientY - 50 }; // Adjust to center the block
    setBlocks((prevBlocks) =>
      prevBlocks.map(
        (block) =>
          block.id === parseInt(blockId) // Match the dragged block
            ? { ...block, position: newPosition } // Update its position
            : block // Leave other blocks unchanged
      )
    );
  };

  return (
    <div className="page" onDrop={onDrop} onDragOver={onDragOver}>
      {/* SVG for drawing dashed lines between blocks */}
      <svg className="svgStyle">
        {blocks.map((block) => {
          // If the block has a parent, draw a line to the parent.
          if (block.parentId) {
            const parent = blocks.find((b) => b.id === block.parentId); // Find the parent block
            if (parent) {
              return (
                <line
                  key={`line-${block.id}`} // Unique key for each line
                  x1={parent.position.x + 50} // Center of parent block
                  y1={parent.position.y + 50}
                  x2={block.position.x + 50} // Center of child block
                  y2={block.position.y + 50}
                  stroke="black" // Line color
                  strokeWidth="2" // Line thickness
                  strokeDasharray="5,5" // Dashed line style
                />
              );
            }
          }
          return null;
        })}
      </svg>

      {/* Render each block on the page */}
      {blocks.map((block) => (
        <div
          key={block.id} // Unique key for React to track elements
          style={{
            position: "absolute", // Allow free positioning
            top: block.position.y,
            left: block.position.x,
            width: "100px",
            height: "100px",
            backgroundColor: "green", // Block color
            border: "1px solid #ccc", // Block border
            display: "flex", // Center content inside the block
            justifyContent: "center",
            alignItems: "center",
            cursor: "move", // Cursor changes to indicate draggable
          }}
          draggable // Makes the block draggable
          onDragStart={(e) => onDragStart(e, block.id)} // Handle drag start
        >
          {/* Button to add a new child block */}
          <button
            onClick={() => addBlock(block.id)} // Adds a child block
            className="btnStyle"
          >
            +
          </button>
        </div>
      ))}
    </div>
  );
};

export default App;
