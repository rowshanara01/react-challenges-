import React, { useState } from "react";
import "./App.css"; // Add your styles here

const generateRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215).toString(16)}`;

const App = () => {
  const [partitions, setPartitions] = useState([
    {
      id: "root",
      direction: null, // Initial direction
      size: 1, // Size (relative to parent)
      color: generateRandomColor(),
      children: [],
    },
  ]);

  

  const updatePartition = (id, direction = null, newSize = null) => {
  const newPartitions = [...partitions];

  const modifyPartition = (partition) => {
    if (partition.id === id) {
      if (direction) {
        // Split logic
        partition.direction = direction === "h" ? "column" : "row"; // Dynamically set direction
        partition.children = [
          {
            id: `${id}-1`,
            direction: partition.direction, // Inherit the split direction
            size: 1,
            color: partition.color, // Retain old color for one partition
            children: [],
          },
          {
            id: `${id}-2`,
            direction: partition.direction, // Inherit the split direction
            size: 1,
            color: generateRandomColor(), // New color for the new partition
            children: [],
          },
        ];
      } else if (newSize !== null) {
        // Resize logic
        partition.size = newSize;
      }
    } else {
      partition.children.forEach(modifyPartition);
    }
  };

  newPartitions.forEach(modifyPartition);
  setPartitions(newPartitions);
};


  const removePartition = (id) => {
    const filterPartitions = (partition) => {
      if (partition.id === id) return null;
      partition.children = partition.children
        .map(filterPartitions)
        .filter((child) => child !== null);
      return partition;
    };

    const updatedPartitions = partitions
      .map(filterPartitions)
      .filter((partition) => partition !== null);

    setPartitions(updatedPartitions);
  };

  return (
    <div className="app">
      {partitions.map((partition) => (
        <Partition
          key={partition.id}
          id={partition.id}
          partition={partition}
          updatePartition={updatePartition}
          removePartition={removePartition}
        />
      ))}
    </div>
  );
};

const Partition = ({ id, partition, updatePartition, removePartition }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [startSize, setStartSize] = useState(partition.size);

  const handleMouseDown = (e) => {
    setIsResizing(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
    setStartSize(partition.size);
  };

  const handleMouseMove = (e) => {
    if (isResizing) {
      const delta = partition.direction === "row" ? e.clientX - startX : e.clientY - startY;
      const newSize = startSize + delta / 500; // Adjust scaling factor as needed
      updatePartition(id, null, Math.max(0.1, Math.min(newSize, 1))); // Keep size valid
    }
  };

  const handleMouseUp = () => setIsResizing(false);

  return (
    <div
      className="partition"
      style={{
        backgroundColor: partition.color,
        flex: partition.size,
        display: "flex",
        flexDirection: partition.direction,
        position: "relative",
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="controls">
        <button onClick={() => updatePartition(id, "v")}>v</button>
        <button onClick={() => updatePartition(id, "h")}>h</button>
        <button onClick={() => removePartition(id)}>-</button>
      </div>
      {partition.children.map((child) => (
        <Partition
          key={child.id}
          id={child.id}
          partition={child}
          updatePartition={updatePartition}
          removePartition={removePartition}
        />
      ))}
      <div
        className="resizer"
        onMouseDown={handleMouseDown}
        style={{
          cursor: partition.direction === "row" ? "ew-resize" : "ns-resize",
        }}
      />
    </div>
  );
};

export default App;
