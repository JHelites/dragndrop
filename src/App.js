import "./App.css";
import { useState, useEffect, createRef, useRef } from "react";
import { GridStack } from "gridstack";

function App() {
  const [items, setItems] = useState([
    { id: "item-1", text: "Item 1" },
    { id: "item-2", text: "Item 2" },
  ]);
  const refs = useRef({});
  const gridRef = useRef();

  if (Object.keys(refs.current).length !== items.length) {
    items.forEach(({ id }) => {
      refs.current[id] = refs.current[id] || createRef();
    });
  }

  useEffect(() => {
    gridRef.current =
      gridRef.current || GridStack.init({ float: true }, ".controlled");
    const grid = gridRef.current;

    grid.batchUpdate();
    grid.removeAll(false);
    items.forEach(({ id }) => grid.makeWidget(refs.current[id].current));
    grid.batchUpdate(false);

    // Listen for resize events to adjust textarea size
    grid.on("resizestop", function (event, el) {
      const textarea = el.querySelector("textarea");
      if (textarea) {
        textarea.style.width = "100%";
        textarea.style.height = "100%";
      }
    });
  }, [items]);

  const handleTextChange = (id, text) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, text } : item))
    );
  };

  return (
    <div>
      <button
        onClick={() =>
          setItems([
            ...items,
            {
              id: `item-${items.length + 1}`,
              text: `Item ${items.length + 1}`,
              type: "text",
            },
          ])
        }
      >
        Add text widget
      </button>

      <div className="grid-stack controlled">
        {items.map((item) => (
          <div
            ref={refs.current[item.id]}
            key={item.id}
            className="grid-stack-item"
          >
            <div className="grid-stack-item-content">
              <div style={{ cursor: "pointer", padding: "2px" }}>Drag</div>
              <textarea
                value={item.text}
                onChange={(e) => handleTextChange(item.id, e.target.value)}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
