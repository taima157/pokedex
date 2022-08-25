import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

export default function PageNotFound() {
  return (
    <div className="PageNotFound">
      <div className="content">
        <h1> PAGE NOT FOUND </h1>
        <Link className="button-back-to-home" to="/">Back to home page</Link>
      </div>
    </div>
  );
}
