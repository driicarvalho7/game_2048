"use client";

// pages/index.tsx
import { useState, useEffect } from "react";

const SIZE = 4;
type Grid = number[][];

type Direction = "ArrowUp" | "ArrowRight" | "ArrowDown" | "ArrowLeft";

const EMPTY_GRID = (): Grid =>
  Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

const randomTile = (grid: Grid): Grid => {
  const empty: [number, number][] = [];
  grid.forEach((row, r) =>
    row.forEach((val, c) => val === 0 && empty.push([r, c]))
  );
  if (empty.length === 0) return grid;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  return grid;
};

const rotate = (grid: Grid): Grid =>
  grid[0].map((_, i) => grid.map((row) => row[i]).reverse());

const slide = (row: number[]): number[] =>
  row.filter((val) => val).concat(row.filter((val) => !val));

const combine = (row: number[]): number[] => {
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
    }
  }
  return slide(row);
};

const move = (grid: Grid, direction: Direction): Grid => {
  let rotations = { ArrowUp: 3, ArrowRight: 2, ArrowDown: 1, ArrowLeft: 0 };
  let newGrid = grid;
  for (let i = 0; i < rotations[direction]; i++) newGrid = rotate(newGrid);
  newGrid = newGrid.map((row) => combine(row));
  for (let i = rotations[direction]; i < 4; i++) newGrid = rotate(newGrid);
  return newGrid;
};

const colors: Record<number, string> = {
  0: "bg-gray-200",
  2: "bg-yellow-100",
  4: "bg-yellow-200",
  8: "bg-orange-300",
  16: "bg-orange-400",
  32: "bg-red-300",
  64: "bg-red-400",
  128: "bg-green-300",
  256: "bg-green-400",
  512: "bg-blue-300",
  1024: "bg-blue-400",
  2048: "bg-purple-400",
};

export default function Home() {
  const [grid, setGrid] = useState<Grid>(EMPTY_GRID());

  const saveGrid = (newGrid: Grid) => {
    setGrid(newGrid);
    localStorage.setItem("grid", JSON.stringify(newGrid));
  };

  const loadGrid = () => {
    const saved = localStorage.getItem("grid");
    if (saved) setGrid(JSON.parse(saved));
    else saveGrid(randomTile(randomTile(EMPTY_GRID())));
  };

  const handleMove = (direction: Direction) => {
    let newGrid = move(grid, direction);
    newGrid = randomTile(newGrid);
    saveGrid(newGrid);
  };

  useEffect(() => {
    loadGrid();

    const handleKey = (event: KeyboardEvent) => {
      if (
        ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(event.key)
      ) {
        event.preventDefault();
        setGrid((prevGrid) => {
          const newGrid = move(prevGrid, event.key as Direction);
          const updatedGrid = randomTile(newGrid);
          localStorage.setItem("grid", JSON.stringify(updatedGrid));
          return updatedGrid;
        });
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">2048</h1>
      <div className="grid grid-cols-4 gap-2 bg-gray-300 p-3 rounded-md">
        {grid.flat().map((val, i) => (
          <div
            key={i}
            className={`w-24 h-24 ${colors[val]} flex items-center justify-center text-xl font-bold rounded`}
          >
            {val || ""}
          </div>
        ))}
      </div>
      <h1 className="text-[0.8rem] font-bold mt-6 mb-2">Adriano Carvalho</h1>
      <button
        onClick={() => saveGrid(randomTile(EMPTY_GRID()))}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Reiniciar
      </button>
    </div>
  );
}
