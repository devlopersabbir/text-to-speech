import { useEffect } from "react";
import "./Popup.css";

export default function () {
  useEffect(() => {
    console.log("Hello from the popup!");
  }, []);

  return <h1>Hello, Ashra Reader</h1>;
}
